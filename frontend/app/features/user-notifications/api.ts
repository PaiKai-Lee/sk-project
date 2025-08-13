import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IUserNotificationsResponse, IUnreadCountResponse } from './types';
import type { IApiResponse } from '../types';

export class UserNotificationClient {
  static getUserNotifications(
    options?: AxiosRequestConfig
  ): Promise<IUserNotificationsResponse> {
    return httpClient.get('/user-notifications', options);
  }

  static getUnreadNotificationsCount(
    options?: AxiosRequestConfig
  ): Promise<IUnreadCountResponse> {
    return httpClient.get('/user-notifications/unread-count', options);
  }

  static markNotificationAsRead(
    id: number,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<void>> {
    return httpClient.patch(`/user-notifications/${id}/mark-read`, {}, options);
  }

  static markAllNotificationsAsRead(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<void>> {
    return httpClient.patch('/user-notifications/mark-all-read', {}, options);
  }
}
