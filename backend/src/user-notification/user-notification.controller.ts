import { Controller, Get, Logger, Param, Patch, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUserNotificationsQueryDto } from './dto/get-user-notifications-query.dto';
import { UserNotificationService } from './user-notification.service';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';

@Controller('/user-notifications')
@UseGuards(AuthGuard)
export class UserNotificationController {
  private readonly logger = new Logger(UserNotificationController.name);
  constructor(
    private readonly cls: ClsService<AppClsStore>,
    private readonly userNotificationService: UserNotificationService,
  ) { }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: GetUserNotificationsQueryDto,
  ) {
    this.logger.debug(`findAll query: ${JSON.stringify(query)}`);
    const uid = this.cls.get('user').uid as string;
    return this.userNotificationService.findAll(uid, query);
  }

  @Get('unread-count')
  getUnreadCount() {
    this.logger.debug(`getUnreadCount`);
    const uid = this.cls.get('user').uid as string;
    return this.userNotificationService.getUnreadCount(uid);
  }

  @Patch('mark-all-read')
  markAllAsRead() {
    this.logger.debug(`markAllAsRead`);
    const uid = this.cls.get('user').uid as string;
    return this.userNotificationService.markAllAsRead(uid);
  }

  @Patch(':id/mark-read')
  markAsRead(@Param('id') id: string) {
    return this.userNotificationService.markAsRead(+id);
  }
}
