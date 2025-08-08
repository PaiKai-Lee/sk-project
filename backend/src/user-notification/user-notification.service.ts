import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GetUserNotificationsQueryDto } from './dto/get-user-notifications-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserNotificationService {
  private readonly logger = new Logger(UserNotificationService.name);

  constructor(private readonly prisma: PrismaService) { }

  async findAll(uid: string, query: GetUserNotificationsQueryDto) {
    this.logger.debug('findAll user notifications: ' + JSON.stringify(query));

    const {
      status,
      page = null,
      pageSize = null,
    } = query;

    const where: Prisma.UserNotificationWhereInput = {
      userUid: uid,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    };

    if (status === 'unread') {
      where['is_read'] = false;
    }

    // 查總筆數（不受 skip/take 影響）
    const findManyArgs: Prisma.UserNotificationFindManyArgs = {
      where,
      orderBy: {
        createdAt: 'desc',
      }
    };

    if (page && pageSize) {
      const skip = (page - 1) * pageSize;
      findManyArgs.skip = skip;
      findManyArgs.take = pageSize;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.userNotification.findMany(findManyArgs),
      this.prisma.userNotification.count({ where }),
    ]);

    return {
      pagination: {
        page: page,
        pageSize: pageSize,
        total,
      },
      rows: notifications,
    };
  }

  getUnreadCount(uid: string) {
    return this.prisma.userNotification.count({
      where: {
        userUid: uid,
        isRead: false,
      },
    });
  }

  markAsRead(id: number) {
    return this.prisma.userNotification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  markAllAsRead(uid: string) {
    return this.prisma.userNotification.updateMany({
      where: {
        userUid: uid,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}
