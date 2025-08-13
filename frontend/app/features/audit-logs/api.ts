import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IAuditLogResponse } from './types';

export class AuditLogClient {
  static async getAuditLogs(
    options?: AxiosRequestConfig
  ): Promise<IAuditLogResponse> {
    return httpClient.get('audit-log', options);
  }
}
