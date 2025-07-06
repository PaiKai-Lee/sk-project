import httpClient from '~/lib/http-client';
import type { IApiResponse, IUserResponse } from './types';
import type { AxiosRequestConfig } from 'axios';

class UserClient {
  static async getUsers(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IUserResponse[]>> {
    return httpClient.get('users', options);
  }

  static async getOneUser(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IUserResponse>> {
    return httpClient.get('users', options);
  }

  static async createUser(
    data: { uid: string; name?: string; password?: string; roleId: number },
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IUserResponse>> {
    return httpClient.post('users', data, options);
  }

  static async enableUser(
    uid: string,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IUserResponse>> {
    return httpClient.patch(`users/${uid}/enable`, options);
  }

  static async disableUser(
    uid: string,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IUserResponse>> {
    return httpClient.patch(`users/${uid}/disable`, options);
  }
}

export default UserClient;
