import {
  Controller,
  Get,
  Logger,
  Patch,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';
import { ChangePasswordDto, ChangeUserNameDto } from 'src/user/dtos';
import { UserService } from 'src/user/user.service';

@Controller('me')
export class MeController {
  private readonly logger = new Logger(MeController.name);

  constructor(
    private readonly cls: ClsService<AppClsStore>,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getMe() {
    this.logger.debug(`getMe`);
    const uid = this.cls.get('user').uid as string;
    return this.userService.getUserByUid(uid, {
      id: true,
      uid: true,
      name: true,
      balance: true,
      role: {
        select: {
          name: true,
        },
      },
      department: {
        select: {
          name: true,
        },
      },
      isInit: true,
      isDisable: true,
      version: true,
      password: false,
    });
  }

  @Patch('change-name')
  async changeUserName(
    @Body(new ValidationPipe()) changeUserNameDto: ChangeUserNameDto,
  ) {
    const uid = this.cls.get('user').uid as string;
    return this.userService.changeUserName(uid, changeUserNameDto.name);
  }

  @Patch('change-password')
  async changeUserPassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ) {
    const uid = this.cls.get('user').uid as string;
    return this.userService.changeUserPassword(uid, changePasswordDto);
  }
}
