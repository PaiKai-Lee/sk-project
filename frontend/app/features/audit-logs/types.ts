import type { Pagination, IApiResponse } from '../types';

export interface IOneAudit {
  id: number;
  uid: string;
  action: string;
  content: string;
  meta: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export interface IAuditLogResponse
  extends IApiResponse<{
    pagination: Pagination;
    rows: IOneAudit[];
  }> {}
