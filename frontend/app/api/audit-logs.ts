import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IApiResponse, IAuditLogResponse } from './types';

class AuditLogClient {
  static async getAuditLogs(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IAuditLogResponse>> {
    return httpClient.get('audit-log', options);
  }
}

export default AuditLogClient;
