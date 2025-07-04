import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma';
import { BcryptService } from 'src/common/utils';
import { CreateUserDto, ChangePasswordDto, GetUsersQueryDto } from './dtos';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserCreatedEvent,
  UserDisabledEvent,
  UserEnabledEvent,
  UserNameChangedEvent,
  UserPasswordChangedEvent,
  UserPasswordResetEvent,
} from './user.event';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly cls: ClsService<AppClsStore>,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async getUsers(getUsersQueryDto: GetUsersQueryDto) {
    this.logger.debug('getUsers');
    const {
      fields,
      sort = ['id:asc'],
      showDisable = false
    } = getUsersQueryDto;
    // 預設只撈沒停用的帳號
    const where = showDisable ? {} : { isDisable: false };

    const select = {
      id: true,
      uid: true,
      name: true,
      balance: false,
      role: false as boolean | { select: { name: true } },
      isInit: false,
      isDisable: false,
      version: false,
    };

    if (fields) {
      fields.forEach((key) => {
        if (key === 'role') {
          select[key] = {
            select: {
              name: true,
            },
          };
          return;
        }
        select[key] = true;
      });
    }

    const orderBy = [] as Prisma.UserOrderByWithRelationInput[];
    if (sort) {
      sort.forEach((key) => {
        const [field, order] = key.split(':');
        orderBy.push({ [field]: order as Prisma.SortOrder });
      });
    }
    return this.prisma.user.findMany({ select, where, orderBy });
  }

  async getUserByUid(uid: string, select?: Prisma.UserSelect) {
    this.logger.debug(`getUserByUid: ${uid}`);
    return this.prisma.user.findUnique({
      where: { uid },
      select,
    });
  }

  async getUserProfile(uid: string) {
    this.logger.debug(`getUserProfile: ${uid}`);
    const foundUser = await this.prisma.user.findUnique({
      where: { uid },
      select: {
        id: true,
        uid: true,
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
      },
    });

    if (!foundUser) {
      throw new BadRequestException('找不到使用者');
    }

    return {
      uid: foundUser.uid,
      name: foundUser.name,
      isDisable: foundUser.isDisable,
      isInit: foundUser.isInit,
      role: foundUser.role.name,
      permissions: foundUser.role.rolePermissions.map(
        (item) => item.permission.action,
      ),
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    this.logger.debug(`createUser: ${JSON.stringify(createUserDto)}`);
    const authUser = this.cls.get('user');
    const { uid, roleId } = createUserDto;

    // 確認是否有重複使用者
    const user = await this.getUserByUid(uid);
    if (user) {
      throw new ConflictException('使用者已存在');
    }

    // TODO: 後續調整為RoleService
    // 不可以設定 role root
    const rootRoleId = await this.prisma.role.findUniqueOrThrow({
      select: { id: true },
      where: { name: 'root' },
    });
    if (createUserDto.roleId === rootRoleId.id) {
      throw new BadRequestException('不可以設定 root role');
    }

    const defaultPassword = this.configService.getOrThrow(
      'app.defaultPassword',
    );
    // 加密密碼
    const hashedPassword = await this.bcryptService.hash(defaultPassword);

    const createData: Prisma.UserCreateInput = {
      uid,
      password: hashedPassword,
      role: {
        connect: {
          id: roleId,
        },
      },
      createdByUser: {
        connect: {
          uid: authUser.uid || 'root',
        },
      },
    };

    const createdUser = await this.prisma.user.create({
      data: createData,
      omit: { password: true },
    });

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent({
        uid,
        name: createdUser.name,
        context: this.cls.get(),
      }),
    );

    return createdUser;
  }

  async disableUser(uid: string) {
    this.logger.debug(`disableUser: ${uid}`);
    const disableResult = await this.prisma.user.update({
      where: { uid, NOT: [{ uid: 'root' }, { isDisable: true }] },
      data: { isDisable: true, version: { increment: 1 } },
      omit: {
        password: true,
      },
    });

    this.eventEmitter.emit(
      'user.disabled',
      new UserDisabledEvent({ uid, context: this.cls.get() }),
    );
    return disableResult;
  }

  async enableUser(uid: string) {
    this.logger.debug(`enableUser: ${uid}`);
    const enableResult = await this.prisma.user.update({
      where: { uid, NOT: [{ uid: 'root' }, { isDisable: false }] },
      data: { isDisable: false, version: { increment: 1 } },
      omit: {
        password: true,
      },
    });

    this.eventEmitter.emit(
      'user.enabled',
      new UserEnabledEvent({ uid, context: this.cls.get() }),
    );
    return enableResult;
  }

  async resetUserPassword(uid: string) {
    this.logger.debug(`resetUserPassword: ${uid}`);
    const defaultPassword = this.configService.getOrThrow(
      'app.defaultPassword',
    );
    const hashedPassword = await this.bcryptService.hash(defaultPassword);
    const resetResult = await this.prisma.user.update({
      where: { uid, NOT: { uid: 'root' } },
      data: { password: hashedPassword, version: { increment: 1 } },
      omit: { password: true },
    });

    this.eventEmitter.emit(
      'user.passwordReset',
      new UserPasswordResetEvent({
        uid,
        context: this.cls.get(),
      }),
    );
    return resetResult;
  }

  async changeUserPassword(uid: string, changePasswordDto: ChangePasswordDto) {
    this.logger.debug(`changeUserPassword`);
    const { newPassword, confirmPassword } = changePasswordDto;
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('密碼不一致');
    }

    const hashedPassword = await this.bcryptService.hash(newPassword);
    // 更新密碼，並調整帳號為已初始化
    const changeResult = await this.prisma.user.update({
      where: { uid },
      data: {
        password: hashedPassword,
        isInit: true,
        version: { increment: 1 },
      },
      omit: { password: true },
    });

    this.eventEmitter.emit(
      'user.passwordChanged',
      new UserPasswordChangedEvent({
        context: this.cls.get(),
      }),
    );
    return changeResult;
  }

  async changeUserName(uid: string, name: string) {
    this.logger.debug(`changeUserName`);
    const changeResult = await this.prisma.user.update({
      where: { uid },
      data: { name, version: { increment: 1 } },
      omit: { password: true },
    });
    this.eventEmitter.emit(
      'user.nameChanged',
      new UserNameChangedEvent({
        name,
        context: this.cls.get(),
      }),
    );
    return changeResult;
  }
}
