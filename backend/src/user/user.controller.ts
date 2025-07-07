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
import { CreateUserDto, GetUsersQueryDto } from './dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Prisma } from '@prisma/client';

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

  @UseGuards(RoleGuard)
  @Roles(Role.Root, Role.Admin)
  @Patch(':uid/disable')
  async disableUser(
    @Param('uid') uid: string,
    @Body('version') version: number,
  ) {
    return this.userService.disableUser(uid, version);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Root, Role.Admin)
  @Patch(':uid/enable')
  async enableUser(
    @Param('uid') uid: string,
    @Param('version') version: number,
  ) {
    return this.userService.enableUser(uid, version);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.Root, Role.Admin)
  @Patch(':uid/password')
  async resetUserPassword(
    @Param('uid') uid: string,
    @Body('version') version: number,
  ) {
    return this.userService.resetUserPassword(uid, version);
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
