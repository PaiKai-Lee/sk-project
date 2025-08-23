import { AppClsStore } from 'src/common';

interface UserBalanceLog {
  uid: string;
  value: number;
  currentBalance: number;
}

export class TransactionCreatedEvent {
  static EVENT_NAME = 'transaction.created';
  /** transactionId */
  transactionId: string;
  /** user balance log */
  userBalanceLog: UserBalanceLog[];
  /** user context */
  context: AppClsStore;
  constructor({
    transactionId,
    userBalanceLog,
    context,
  }: {
    transactionId: string;
    userBalanceLog: UserBalanceLog[];
    context: AppClsStore;
  }) {
    this.transactionId = transactionId;
    this.userBalanceLog = userBalanceLog;
    this.context = context;
  }
}
