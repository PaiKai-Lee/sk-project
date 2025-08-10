import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GetUserNotificationsQueryDto } from './dto/get-user-notifications-query.dto';
import { Prisma } from '@prisma/client';
import { UserNotificationHelper } from './user-notification.helper';

@Injectable()
export class UserNotificationService {
  private readonly logger = new Logger(UserNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userNotificationHelper: UserNotificationHelper,
  ) {}

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

    let takeArg: number | undefined;
    let cursorArg: Prisma.UserNotificationWhereUniqueInput | undefined;
    let skipArg: number | undefined;

    if (limit) {
      takeArg = limit + 1;
      if (cursor) {
        cursorArg = { id: cursor };
        skipArg = 1; // Skip the cursor item
      }
    }

    const findManyArgs =
      Prisma.validator<Prisma.UserNotificationFindManyArgs>()({
        where,
        orderBy: { id: 'desc' as const },
        include: {
          notification: true,
        },
        take: takeArg,
        cursor: cursorArg,
        skip: skipArg,
      });

    const [userNotifications, total] = await Promise.all([
      this.prisma.userNotification.findMany(findManyArgs),
      this.prisma.userNotification.count({ where }),
    ]);

    let items = userNotifications;
    let nextCursor: number | null = null;

    if (limit) {
      const hasNextPage = userNotifications.length > limit;
      items = hasNextPage
        ? userNotifications.slice(0, limit)
        : userNotifications;
      nextCursor = hasNextPage ? (items[items.length - 1]?.id ?? null) : null;
    }

    // 處理返回資料，payload & content
    items = items.map((userNotification) => {
      const notification = userNotification.notification;

      // 格式化內容模板
      if (notification.content && userNotification.payload) {
        const formattedContent =
          this.userNotificationHelper.renderContentTemplate(
            notification.content,
            userNotification.payload as Record<string, any>,
          );
        notification.content = formattedContent;
      }

      return {
        ...userNotification,
        notification,
      };
    });

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
