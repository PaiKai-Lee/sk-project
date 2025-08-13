import type { IApiResponse, CursorPagination } from '~/features/types';

export interface INotification {
  id: number;
  title: string;
  content: string;
  sourceType: string;
  createdAt: string;
  users?: { uid: string; name: string }[];
}

export interface IUserNotification {
  id: number;
  notificationId: number;
  userUid: string;
  payload: any;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  expiredAt: string;
  notification: INotification;
}

export interface INotificationsResponse extends IApiResponse<INotification[]> {}
export interface INotificationResponse extends IApiResponse<INotification> {}
export interface IUserNotificationsResponse
  extends IApiResponse<{
    cursorPagination: CursorPagination;
    rows: IUserNotification[];
  }> {}
export interface IUnreadCountResponse extends IApiResponse<number> {}
