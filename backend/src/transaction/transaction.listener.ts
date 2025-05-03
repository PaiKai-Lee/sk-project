import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction.event';
import { AuditLogService } from 'src/audit-log';

@Injectable()
export class TransactionListener {
  constructor(private readonly auditLogService: AuditLogService) {}

  @OnEvent('transaction.created')
  logTransactionCreatedEvent(event: TransactionCreatedEvent) {
    const { context } = event;
    this.auditLogService.createAuditLog({
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

  // TODO: 紀錄通知
  // TODO: SSE/WS 通知前端
  // @OnEvent('transaction.created')
  // notifyTransactionCreated(event: TransactionCreatedEvent) {

  // }
}
