import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers(
    @Query('fields') fields?: string | string[],
    @Query('showDisable') showDisable?: string
  ) {
    // 預設只撈沒停用的帳號
    const where = (showDisable === 'true')
      ? {}
      : { isDisable: false };

    const select = {
      id: true,
      uid: true,
      name: true,
      balance: false,
      role: false as boolean | { select: { name: true } },
      isInit: false,
      isDisable: false,
      version: false,
    }

    if (fields) {
      fields = Array.isArray(fields) ? fields : [fields];
      fields.forEach((key) => {
        if (Object.hasOwn(select, key)) {
          if (key === 'role') {
            select[key] = {
              select: {
                name: true,
              },
            }
            return;
          }
          select[key] = true
        }
      })
    }

    return this.userService.getUsers({
      select,
      where,
      orderBy: { uid: 'asc' },
    });
  }

  @Get(':uid')
  async getUser(
    @Param('uid') uid: string,
    @Query('fields') fields?: string | string[]
  ) {

    const select = {
      id: true,
      uid: true,
      name: true,
      balance: false,
      role: false as boolean | { select: { name: true } },
      isInit: false,
      isDisable: false,
      version: false,
    }

    if (fields) {
      fields = Array.isArray(fields) ? fields : [fields];
      fields.forEach((key) => {
        if (Object.hasOwn(select, key)) {
          if (key === 'role') {
            select[key] = {
              select: {
                name: true,
              },
            }
            return;
          }
          select[key] = true
        }
      })
    }

    return this.userService.getUserByUid(uid, select);
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Root)
  @Patch(':uid/disable')
  async disableUser(@Param('uid') uid: string) {
    return this.userService.disableUser(uid);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Root)
  @Patch(':uid/enable')
  async enableUser(@Param('uid') uid: string) {
    return this.userService.enableUser(uid);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Root)
  @Patch(':uid/password')
  async resetUserPassword(@Param('uid') uid: string) {
    return this.userService.resetUserPassword(uid);
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
