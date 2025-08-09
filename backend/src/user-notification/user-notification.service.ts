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

    const { status, cursor, limit } = query;

    const where: Prisma.UserNotificationWhereInput = {
      userUid: uid,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    };

    if (status === 'unread') {
      where.isRead = false;
    }

    const findManyArgs: Prisma.UserNotificationFindManyArgs = {
      where,
      orderBy: {
        id: 'desc',
      },
    };

    if (limit) {
      findManyArgs.take = limit + 1;
      if (cursor) {
        findManyArgs.cursor = {
          id: cursor,
        };
        findManyArgs.skip = 1; // Skip the cursor item
      }
    }

    const [notifications, total] = await Promise.all([
      this.prisma.userNotification.findMany(findManyArgs),
      this.prisma.userNotification.count({ where }),
    ]);

    let items = notifications;
    let nextCursor: number | null = null;

    if (limit) {
      const hasNextPage = notifications.length > limit;
      items = hasNextPage ? notifications.slice(0, limit) : notifications;
      nextCursor = hasNextPage ? items[items.length - 1]?.id ?? null : null;
    }

    return {
      cursorPagination: {
        nextCursor,
        limit: limit ?? null,
        total,
      },
      rows: items,
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
