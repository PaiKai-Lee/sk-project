import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NOTIFICATION_SOURCE_TYPE } from 'src/common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from './notification.event';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService<AppClsStore>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    sourceType: (typeof NOTIFICATION_SOURCE_TYPE)[keyof typeof NOTIFICATION_SOURCE_TYPE],
    targetsPayloads?: Record<string, unknown>,
  ) {
    const authUser = this.cls.get('user');
    const { title, content, targets } = createNotificationDto;
    const notification = await this.prisma.notification.create({
      data: {
        title,
        content,
        sourceType,
      },
    });

    // * 分發信件，如果有需要非同步處理，可以獨立出 handler 處理
    // Distribute notification to users
    const userNotifications = targets.map((uid) => {
      return {
        notificationId: notification.id,
        userUid: uid,
        payload: targetsPayloads?.[uid] ?? undefined,
        isRead: uid === authUser.uid, // 如果是建立者，標示為已讀
        expiredAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      };
    });

    await this.prisma.userNotification.createMany({
      data: userNotifications,
    });

    this.eventEmitter.emit(
      NotificationCreatedEvent.EVENT_NAME,
      new NotificationCreatedEvent({
        notificationId: notification.id,
        title,
        context: this.cls.get<AppClsStore>(),
      }),
    );

    return notification;
  }

  findAll() {
    return this.prisma.notification.findMany();
  }

  async remove(id: number) {
    return this.prisma.notification.deleteMany({
      where: {
        id,
        sourceType: NOTIFICATION_SOURCE_TYPE.ADMIN,
      },
    });
  }
}
