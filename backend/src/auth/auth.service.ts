import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';
import { PrismaService } from 'src/common/prisma';
import { UserService } from 'src/user';
import { LoginDto } from './dtos/login.dto';
import { AuthLoginEvent, AuthLogoutEvent } from './auth.event';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from 'src/common/utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly cls: ClsService<AppClsStore>,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.debug(`login: ${JSON.stringify(loginDto)}`);
    const { uid, password } = loginDto;
    const foundUser = await this.userService.getUserByUid(uid, {
      id: true,
      uid: true,
      password: true,
      name: true,
      isDisable: true,
      isInit: true,
      role: {
        select: {
          name: true,
          rolePermissions: {
            select: {
              permission: {
                select: {
                  action: true,
                },
              },
            },
          },
        },
      },
    });
    if (!foundUser) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }
    const isMatch = await this.bcryptService.compare(
      password,
      foundUser.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }

    if (foundUser.isDisable) {
      throw new ForbiddenException('此帳號已停用');
    }

    const profile = {
      uid,
      name: foundUser.name,
      isDisable: foundUser.isDisable,
      isInit: foundUser.isInit,
      // @ts-ignore Prisma nested selected 會有型別錯誤的問題
      role: foundUser.role.name,
      // @ts-ignore
      permissions: foundUser.role.rolePermissions.map(
        (item) => item.permission.action,
      ),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        uid,
        name: profile.name,
        isDisable: profile.isDisable,
        isInit: profile.isInit,
        role: profile.role,
        permissions: profile.permissions,
      }),
      this.jwtService.signAsync({ uid }, { expiresIn: '30d' }),
    ]);

    await this.prisma.userRefreshToken.create({
      data: {
        uid,
        token: refreshToken,
      },
    });

    const userCtx = this.cls.get('user');
    userCtx.uid = foundUser.uid;
    userCtx.role = profile.role;

    const userLoginEvent = new AuthLoginEvent(this.cls.get());
    this.eventEmitter.emit(AuthLoginEvent.EVENT_NAME, userLoginEvent);

    return {
      accessToken,
      refreshToken,
      profile,
    };
  }

  async logout() {
    this.logger.debug('logout');
    const uid = this.cls.get('user').uid;
    if (!uid) {
      this.logger.warn('logout but uid not found');
      throw new UnauthorizedException('找不到使用者');
    }
    // TODO: 如果要讓accessToken馬上無法使用，後續配合redis調整
    // 全平台登出
    await this.prisma.userRefreshToken.deleteMany({
      where: { uid },
    });

    const userLogoutEvent = new AuthLogoutEvent(this.cls.get());
    this.eventEmitter.emit(AuthLogoutEvent.EVENT_NAME, userLogoutEvent);
    return;
  }

  async refreshToken(refreshTokenDto: { refreshToken: string }) {
    this.logger.debug('refreshToken');
    const { refreshToken } = refreshTokenDto;
    const userRefreshToken = await this.prisma.userRefreshToken.findFirst({
      where: {
        token: refreshToken,
      },
    });

    // TODO: 固定好jwtPayload後調整型別
    let payload: {
      uid: string;
      name: string;
      isDisable: boolean;
      isInit: boolean;
      role: string;
      permissions: string[];
    };

    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('refresh token 錯誤');
    }

    // jwt驗證合法但是找不到，表示這個refreshToken被盜用了，執行登出所有平台動作
    if (!userRefreshToken) {
      await this.prisma.userRefreshToken.deleteMany({
        where: { uid: payload.uid },
      });
      throw new UnauthorizedException('refresh token 錯誤');
    }

    // 從db抓取資料
    // TODO: 後續如果需要即時更新，調整jwt搭配redis處理狀態
    const userProfile = await this.userService.getUserProfile(payload.uid);

    const [accessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(userProfile),
      this.jwtService.signAsync(
        {
          uid: payload.uid,
        },
        { expiresIn: '30d' },
      ),
    ]);

    // 將原本的refreshToken替換
    await this.prisma.userRefreshToken.create({
      data: {
        uid: payload.uid,
        token: newRefreshToken,
      },
    });

    await this.prisma.userRefreshToken.delete({
      where: {
        id: userRefreshToken.id,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  getProfile() {
    this.logger.debug('getProfile');
    const userProfile = this.cls.get('user');
    return userProfile;
  }
}
