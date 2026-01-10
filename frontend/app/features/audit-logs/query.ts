import { queryOptions } from '@tanstack/react-query';
import { AuditLogClient } from './api';
import {
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

export const auditLogQueryKeys = {
  all: ['audit-logs'],
  getAuditLogs: (params?: Record<string, any>) => [
    ...auditLogQueryKeys.all,
    'list',
    params,
  ],
} as const;

type GetAuditLogsParams = {
  pagination?: PaginationState;
  sorting?: SortingState;
  filters?: ColumnFiltersState; // already debounced
};

export function getAuditLogsOptions(params: GetAuditLogsParams = {}) {
  return queryOptions({
    queryKey: auditLogQueryKeys.getAuditLogs({
      page: params.pagination && params.pagination.pageIndex + 1,
      pageSize: params.pagination && params.pagination.pageSize,
      sorting: params.sorting && JSON.stringify(params.sorting),
      filters: params.filters && JSON.stringify(params.filters),
    }),
    queryFn: async () => {
      const apiParams = new URLSearchParams();
      if (params.pagination) {
        apiParams.append('page', (params.pagination.pageIndex + 1).toString());
        apiParams.append('pageSize', params.pagination.pageSize.toString());
      }
      if (params.sorting && params.sorting.length > 0) {
        params.sorting.forEach((item) => {
          apiParams.append('sort', `${item.id}:${item.desc ? 'desc' : 'asc'}`);
        });
      }
      if (params.filters && params.filters.length > 0) {
        params.filters.forEach((item) => {
          if (item.id === 'uid') {
            apiParams.append('uid', `${item.value}`);
          }
        });
      }
      const { data } = await AuditLogClient.getAuditLogs({ params: apiParams });
      return data;
    },
  });
}
