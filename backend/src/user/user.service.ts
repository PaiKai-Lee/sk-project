import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma';
import { BcryptService } from 'src/common/utils';
import {
  CreateUserDto,
  ChangePasswordDto,
  GetUsersQueryDto,
  ChangeUserNameDto,
  EditUserDto,
} from './dtos';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserCreatedEvent,
  UserDisabledEvent,
  UserEditedEvent,
  UserEnabledEvent,
  UserNameChangedEvent,
  UserPasswordChangedEvent,
  UserPasswordResetEvent,
} from './user.event';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly cls: ClsService<AppClsStore>,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getUsers(getUsersQueryDto: GetUsersQueryDto) {
    this.logger.debug('getUsers');
    const { fields, sort = ['id:asc'], showDisable = false } = getUsersQueryDto;
    // 預設只撈沒停用的帳號
    const where = {
      NOT: {
        role: {
          name: Role.Root,
        },
      },
    };

    if (!showDisable) {
      where['isDisable'] = false;
    }

    const select = {
      id: true,
      uid: true,
      name: true,
      balance: false,
      role: false as boolean,
      department: false as boolean,
      isInit: false,
      isDisable: false,
      version: false,
    };

    if (fields) {
      fields.forEach((key) => {
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

  async getUserByUid(
    uid: string,
    select?: Prisma.UserSelect,
    where?: Prisma.UserWhereUniqueInput,
  ) {
    this.logger.debug(`getUserByUid: ${uid}`);
    where = where ? { uid, ...where } : { uid };
    return this.prisma.user.findUnique({
      where,
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
            id: true,
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
    const { uid, roleId, name, departmentId } = createUserDto;

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
      isInit: true, // 目部不開放修改密碼，都預設初始化
      role: {
        connect: {
          id: roleId,
        },
      },
      department: {
        connect: {
          id: departmentId,
        },
      },
      createdByUser: {
        connect: {
          uid: authUser.uid || 'root',
        },
      },
    };

    if (name) {
      createData.name = name;
    }

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

  async editUser(uid: string, editUserDto: EditUserDto) {
    this.logger.debug(`editUser: ${JSON.stringify(editUserDto)}`);
    const { name, roleId, departmentId, version } = editUserDto;

    const user = await this.getUserByUid(uid);
    if (!user) {
      throw new NotFoundException('找不到使用者');
    }

    // 不可以設定 role root
    const rootRoleId = await this.prisma.role.findUniqueOrThrow({
      select: { id: true },
      where: { name: 'root' },
    });
    if (roleId === rootRoleId.id) {
      throw new BadRequestException('不可以設定 root role');
    }

    const editData: Prisma.UserUpdateInput = {
      isInit: true,
      version: { increment: 1 },
    };

    if (name) {
      editData.name = name;
    }

    if (roleId) {
      editData.role = {
        connect: {
          id: roleId,
        },
      };
    }

    if (departmentId) {
      editData.department = {
        connect: {
          id: departmentId,
        },
      };
    }

    const editedUser = await this.prisma.user.update({
      where: { uid, version, NOT: { uid: 'root' } },
      data: editData,
      omit: { password: true },
    });

    this.eventEmitter.emit(
      'user.updated',
      new UserEditedEvent({
        uid,
        editData: editUserDto,
        context: this.cls.get(),
      }),
    );

    return editedUser;
  }

  async disableUser(uid: string, version: number) {
    this.logger.debug(`disableUser: ${uid}`);
    const disableResult = await this.prisma.user.update({
      where: { uid, version, NOT: [{ uid: 'root' }, { isDisable: true }] },
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

  async enableUser(uid: string, version: number) {
    this.logger.debug(`enableUser: ${uid}`);
    const enableResult = await this.prisma.user.update({
      where: { uid, version, NOT: [{ uid: 'root' }, { isDisable: false }] },
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

  async resetUserPassword(uid: string, version: number) {
    this.logger.debug(`resetUserPassword: ${uid}`);
    const defaultPassword = this.configService.getOrThrow(
      'app.defaultPassword',
    );
    const hashedPassword = await this.bcryptService.hash(defaultPassword);
    const resetResult = await this.prisma.user.update({
      where: { uid, version, NOT: { uid: 'root' } },
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
    const { newPassword, confirmPassword, version } = changePasswordDto;
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('密碼不一致');
    }

    const hashedPassword = await this.bcryptService.hash(newPassword);
    // 更新密碼，並調整帳號為已初始化
    const changeResult = await this.prisma.user.update({
      where: { uid, version, NOT: { uid: 'root' } },
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

  async changeUserName(uid: string, changeUserNameDto: ChangeUserNameDto) {
    this.logger.debug(`changeUserName`);
    const { name, version } = changeUserNameDto;
    const changeResult = await this.prisma.user.update({
      where: { uid, version, NOT: { uid: 'root' } },
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
