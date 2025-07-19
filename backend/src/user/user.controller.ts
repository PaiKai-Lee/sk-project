import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  EditUserDto,
  GetUsersQueryDto,
  SwitchStatusDto,
} from './dtos';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CanUpdateSelfGuard } from 'src/guards/can-update-self.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query(new ValidationPipe({ transform: true })) query: GetUsersQueryDto,
  ) {
    return this.userService.getUsers(query);
  }

  @Get(':uid')
  async getUser(
    @Param('uid') uid: string,
    @Query('fields') fields?: string | string[],
  ) {
    const select = {
      id: true,
      uid: true,
      name: true,
      balance: false,
      role: false as boolean | { select: { name: true } },
      department: false as boolean | { select: { name: true } },
      isInit: false,
      isDisable: false,
      version: false,
    };

    if (fields) {
      fields = Array.isArray(fields) ? fields : [fields];
      fields.forEach((key) => {
        if (Object.hasOwn(select, key)) {
          if (key === 'role') {
            select[key] = {
              select: {
                name: true,
              },
            };
            return;
          }
          if (key === 'department') {
            select[key] = {
              select: {
                name: true,
              },
            };
            return;
          }
          select[key] = true;
        }
      });
    }

    return this.userService.getUserByUid(uid, select);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Root, Role.Admin)
  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(RoleGuard, CanUpdateSelfGuard)
  @Roles(Role.Root, Role.Admin)
  @Put(':uid')
  async editUser(
    @Param('uid') uid: string,
    @Body(new ValidationPipe()) editUserDto: EditUserDto,
  ) {
    return this.userService.editUser(uid, editUserDto);
  }

  @UseGuards(RoleGuard, CanUpdateSelfGuard)
  @Roles(Role.Root, Role.Admin)
  @Patch(':uid/disable')
  async disableUser(
    @Param('uid') uid: string,
    @Body(new ValidationPipe()) data: SwitchStatusDto,
  ) {
    return this.userService.disableUser(uid, data.version);
  }

  @UseGuards(RoleGuard, CanUpdateSelfGuard)
  @Roles(Role.Root, Role.Admin)
  @Patch(':uid/enable')
  async enableUser(
    @Param('uid') uid: string,
    @Body(new ValidationPipe()) data: SwitchStatusDto,
  ) {
    return this.userService.enableUser(uid, data.version);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Root)
  @Patch(':uid/password')
  async resetUserPassword(
    @Param('uid') uid: string,
    @Body(new ValidationPipe()) data: SwitchStatusDto,
  ) {
    return this.userService.resetUserPassword(uid, data.version);
  }

  @Get(':uid/transactions-items')
  async getUserTransactionsItems(@Param('uid') uid: string) {
    return this.userService.getUserByUid(uid, {
      id: true,
      uid: true,
      name: true,
      transactionItems: {
        select: {
          id: true,
          value: true,
          details: true,
          createdAt: true,
        },
      },
    });
  }

  @Get(':uid/balance-logs')
  async getUserBalanceLogs(@Param('uid') uid: string) {
    return this.userService.getUserByUid(uid, {
      id: true,
      uid: true,
      name: true,
      userBalanceLogs: {
        select: {
          id: true,
          value: true,
          createdAt: true,
        },
      },
    });
  }
}
