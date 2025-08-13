import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { INotificationsResponse, INotificationResponse } from './types';
import type { IApiResponse } from '../types';

export class NotificationClient {
  static getNotifications(
    options?: AxiosRequestConfig
  ): Promise<INotificationsResponse> {
    return httpClient.get('/notifications', options);
  }

  static createNotification(
    data: {
      title: string;
      content: string;
      targets: string[];
    },
    options?: AxiosRequestConfig
  ): Promise<INotificationResponse> {
    return httpClient.post('/notifications', data, options);
  }

  static deleteNotification(
    id: number,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<void>> {
    return httpClient.delete(`/notifications/${id}`, options);
  }
}
