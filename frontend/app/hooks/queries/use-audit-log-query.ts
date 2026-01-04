import { useQuery } from '@tanstack/react-query';
import { auditLogQueryKeys, AuditLogClient } from '~/features/audit-logs';
import {
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

type GetAuditLogsParams = {
  pagination?: PaginationState;
  sorting?: SortingState;
  filters?: ColumnFiltersState; // already debounced
};

export function useAuditLogQuery(params: GetAuditLogsParams = {}) {
  const { pagination, sorting, filters } = params;
  return useQuery({
    queryKey: auditLogQueryKeys.getAuditLogs({
      page: pagination && pagination.pageIndex + 1,
      pageSize: pagination && pagination.pageSize,
      sorting: sorting && JSON.stringify(sorting),
      filters: filters && JSON.stringify(filters),
    }),
    queryFn: async () => {
      const apiParams = new URLSearchParams();
      if (pagination) {
        apiParams.append('page', (pagination.pageIndex + 1).toString());
        apiParams.append('pageSize', pagination.pageSize.toString());
      }
      if (sorting && sorting.length > 0) {
        sorting.forEach((item) => {
          apiParams.append('sort', `${item.id}:${item.desc ? 'desc' : 'asc'}`);
        });
      }
      if (filters && filters.length > 0) {
        filters.forEach((item) => {
          if (item.id === 'uid') {
            apiParams.append('uid', `${item.value}`);
          }
        });
      }
      const { data } = await AuditLogClient.getAuditLogs({ params: apiParams });
      return data;
    },
    select: (data) => data.data,
  });
}
