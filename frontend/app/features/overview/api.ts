import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IOverviewResponse } from './types';

export class OverviewClient {
  static getOverview(options?: AxiosRequestConfig): Promise<IOverviewResponse> {
    return httpClient.get('overview', options);
  }
}
