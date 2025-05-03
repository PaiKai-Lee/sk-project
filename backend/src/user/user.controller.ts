import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto, CreateUserDto } from './dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers({
      select: {
        id: true,
        uid: true,
        name: true,
        balance: true,
        role: {
          select: {
            name: true,
          },
        },
        isInit: true,
        isDisable: true,
        version: true,
      },
      orderBy: { uid: 'asc' },
    });
  }

  @Get(':uid')
  async getUser(@Param('uid') uid: string) {
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
      isInit: true,
      isDisable: true,
      version: true,
      password: false,
    });
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':uid/disable')
  async disableUser(@Param('uid') uid: string) {
    return this.userService.disableUser(uid);
  }

  @Patch(':uid/enable')
  async enableUser(@Param('uid') uid: string) {
    return this.userService.enableUser(uid);
  }

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
