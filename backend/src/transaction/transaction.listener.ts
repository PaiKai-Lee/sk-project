import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction.event';
import { AuditLogService } from 'src/audit-log';
import { NotificationService } from 'src/notification/notification.service';
import { NOTIFICATION_SOURCE_TYPE } from 'src/common/constants';

@Injectable()
export class TransactionListener {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(TransactionCreatedEvent.EVENT_NAME)
  async logTransactionCreatedEvent(event: TransactionCreatedEvent) {
    const { context } = event;
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'transaction.created',
      content: `建立交易: ${event.transactionId}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent(TransactionCreatedEvent.EVENT_NAME)
  async notifyTransactionCreated(event: TransactionCreatedEvent) {
    const { context, userBalanceLog } = event;
    const notificationContent = `${context.user.name} 建立了一筆交易: ${event.transactionId}，你參與的交易金額: {{value}}。`;
    await this.notificationService.create(
      {
        title: '交易通知',
        content: notificationContent,
        targets: userBalanceLog.map((log) => log.uid),
      },
      NOTIFICATION_SOURCE_TYPE.SYSTEM,
      userBalanceLog.reduce((acc, log) => {
        acc[log.uid] = { value: log.value }; // Payload for each user
        return acc;
      }, {}),
    );
  }

  // TODO: 紀錄通知
  // TODO: SSE/WS 通知前端
  // @OnEvent('transaction.created')
  // notifyTransactionCreated(event: TransactionCreatedEvent) {

  // }
}
