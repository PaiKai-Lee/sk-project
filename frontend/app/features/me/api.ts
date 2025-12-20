import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type {
  IMeResponse,
  IBalanceLogsResponse,
  GetBalanceLogsDto,
} from './types';

export class MeClient {
  static get(options?: AxiosRequestConfig): Promise<IMeResponse> {
    return httpClient.get('/me', options);
  }

  static getBalanceLogs(
    params: GetBalanceLogsDto,
    options?: AxiosRequestConfig
  ): Promise<IBalanceLogsResponse> {
    return httpClient.get('/me/balance-logs', { params, ...options });
  }
}
