import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IRolesResponse } from './types';

export class RoleClient {
  static getRoles(options?: AxiosRequestConfig): Promise<IRolesResponse> {
    return httpClient.get('roles', options);
  }
}
