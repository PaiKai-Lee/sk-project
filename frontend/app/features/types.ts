import type { AxiosResponse } from 'axios';
export interface IResponseData<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type IApiResponse<T> = AxiosResponse<IResponseData<T>>;

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface CursorPagination {
  nextCursor: number | string | null;
  limit: number | null;
  total: number;
}
