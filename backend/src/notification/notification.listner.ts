import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { AuditLogService } from 'src/audit-log';
import { NotificationCreatedEvent } from './notification.event';

@Injectable()
export class TransactionListener {
  constructor(private readonly auditLogService: AuditLogService) {}

  @OnEvent('notification.created')
  logTransactionCreatedEvent(event: NotificationCreatedEvent) {
    const { context, notificationId, title } = event;
    this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'notification.created',
      content: `建立通知: ${notificationId} - ${title}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }
}
