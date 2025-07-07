import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IApiResponse, IRoleResponse } from './types';

class RoleClient {
  static async getRoles(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IRoleResponse[]>> {
    return httpClient.get('roles', options);
  }
}

export default RoleClient;
