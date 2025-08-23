import { AppClsStore } from 'src/common';

export class NotificationCreatedEvent {
  static EVENT_NAME = 'notification.created';
  notificationId: number;
  title: string;
  context: AppClsStore;
  constructor({
    notificationId,
    title,
    context,
  }: {
    notificationId: number;
    title: string;
    context: AppClsStore;
  }) {
    this.notificationId = notificationId;
    this.title = title;
    this.context = context;
  }
}
