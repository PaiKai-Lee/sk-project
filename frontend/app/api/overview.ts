import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IApiResponse, IOverviewResponse } from './types';

class OverviewClient {
  static async getOverview(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IOverviewResponse>> {
    return httpClient.get('overview', options);
  }
}

export default OverviewClient;
