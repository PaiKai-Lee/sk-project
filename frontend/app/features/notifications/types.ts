import type { IApiResponse } from '~/features/types';

export interface INotification {
  id: number;
  title: string;
  content: string;
  sourceType: string;
  createdAt: string;
  users?: { uid: string; name: string }[];
}

export interface INotificationsResponse extends IApiResponse<INotification[]> {}
export interface INotificationResponse extends IApiResponse<INotification> {}
