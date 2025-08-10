import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type {
  IApiResponse,
  INotificationResponse,
  IUserNotificationsResponse,
} from './types';

class NotificationClient {
  static async getNotifications(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<INotificationResponse[]>> {
    return httpClient.get('/notifications', options);
  }

  static async createNotification(
    data: {
      title: string;
      content: string;
      targets: string[];
    },
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<INotificationResponse>> {
    return httpClient.post('/notifications', data, options);
  }

  static async deleteNotification(
    id: number,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<void>> {
    return httpClient.delete(`/notifications/${id}`, options);
  }

  static async getUserNotifications(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IUserNotificationsResponse>> {
    return httpClient.get('/user-notifications', options);
  }

  static async getUnreadNotificationsCount(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<number>> {
    return httpClient.get('/user-notifications/unread-count', options);
  }

  static async markNotificationAsRead(
    id: number,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<void>> {
    return httpClient.patch(`/user-notifications/${id}/mark-read`, {}, options);
  }

  static async markAllNotificationsAsRead(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<void>> {
    return httpClient.patch('/user-notifications/mark-all-read', {}, options);
  }
}

export default NotificationClient;