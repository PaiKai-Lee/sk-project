import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction.event';
import { AuditLogService } from 'src/audit-log';
import { NotificationService } from 'src/notification/notification.service';
import { NOTIFICATION_SOURCE_TYPE } from 'src/common/constants';

interface TargetsPayload {
  [key: string]: { value: number };
}

interface AggregationResult {
  targets: Set<string>;
  targetsPayload: TargetsPayload;
}

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

    const initialState: AggregationResult = {
      targets: new Set<string>(),
      targetsPayload: {},
    };
    // targets 不出現重複 uid & 將重複使用者的金額相加
    const { targets, targetsPayload } = userBalanceLog.reduce((acc, log) => {
      const { targets, targetsPayload } = acc;
      const { uid, value } = log;
      targets.add(uid);
      if (targetsPayload[uid]) {
        targetsPayload[uid].value += value;
      } else {
        targetsPayload[uid] = { value };
      }
      return acc;
    }, initialState);

    await this.notificationService.create(
      {
        title: '交易通知',
        content: notificationContent,
        targets: Array.from(targets),
      },
      NOTIFICATION_SOURCE_TYPE.SYSTEM,
      targetsPayload,
    );
  }

  // TODO: 紀錄通知
  // TODO: SSE/WS 通知前端
  // @OnEvent('transaction.created')
  // notifyTransactionCreated(event: TransactionCreatedEvent) {

  // }
}
