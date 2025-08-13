import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IUsersResponse, IUserResponse } from './types';

export class UserClient {
  static getUsers(options?: AxiosRequestConfig): Promise<IUsersResponse> {
    return httpClient.get('users', options);
  }

  static getOneUser(options?: AxiosRequestConfig): Promise<IUserResponse> {
    return httpClient.get('users', options);
  }

  static createUser(
    data: { uid: string; name?: string; password?: string; roleId: number },
    options?: AxiosRequestConfig
  ): Promise<IUserResponse> {
    return httpClient.post('users', data, options);
  }

  static editUser(
    uid: string,
    data: {
      name: string;
      roleId: number;
      departmentId: number;
      version: number;
    },
    options?: AxiosRequestConfig
  ): Promise<IUserResponse> {
    return httpClient.put(`users/${uid}`, data, options);
  }

  static enableUser(
    uid: string,
    version: number,
    options?: AxiosRequestConfig
  ): Promise<IUserResponse> {
    return httpClient.patch(`users/${uid}/enable`, { version }, options);
  }

  static disableUser(
    uid: string,
    version: number,
    options?: AxiosRequestConfig
  ): Promise<IUserResponse> {
    return httpClient.patch(`users/${uid}/disable`, { version }, options);
  }
}
