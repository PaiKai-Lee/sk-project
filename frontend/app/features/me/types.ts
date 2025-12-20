import type { IApiResponse, Pagination } from '~/features/types';

export interface GetBalanceLogsDto {
  page?: number;
  pageSize?: number;
  all?: boolean;
}

export interface IMe {
  id: number;
  uid: string;
  name: string;
  balance: number;
  role: {
    name: string;
  };
  department: {
    name: string;
  };
  isInit: boolean;
  isDisable: boolean;
  version: number;
}

export type IMeResponse = IApiResponse<IMe>;

export interface IBalanceLog {
  id: number;
  value: number;
  currentBalance: number;
  createdAt: string;
}

export interface IGetBalanceLogsResponse {
  id: number;
  uid: string;
  name: string;
  pagination: Pagination;
  balanceLogs: IBalanceLog[];
}

export type IBalanceLogsResponse = IApiResponse<IGetBalanceLogsResponse>;
