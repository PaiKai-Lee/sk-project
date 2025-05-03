import { AppClsStore } from 'src/common';
export class TransactionCreatedEvent {
  transactionId: string;
  users: string[];
  context: AppClsStore;
  constructor({
    transactionId,
    users,
    context,
  }: {
    transactionId: string;
    users: string[];
    context: AppClsStore;
  }) {
    this.transactionId = transactionId;
    this.users = users;
    this.context = context;
  }
}
