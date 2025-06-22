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
}

export default UserClient;
