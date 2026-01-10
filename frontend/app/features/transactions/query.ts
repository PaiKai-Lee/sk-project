import { queryOptions } from '@tanstack/react-query';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { TransactionsClient } from './api';

export const transactionQueryKeys = {
  all: ['transactions'],
  getTransactions: (params?: any) => [
    ...transactionQueryKeys.all,
    'list',
    params,
  ],
  getOneTransaction: (id: string) => [
    ...transactionQueryKeys.all,
    'detail',
    id,
  ],
} as const;

export function getTransactionsDetailOptions(trxId: string) {
  return queryOptions({
    queryKey: transactionQueryKeys.getOneTransaction(trxId),
    queryFn: () => TransactionsClient.getOneTransaction(trxId),
    enabled: !!trxId,
    select: (result) => result.data.data,
    staleTime: 1000 * 60,
  });
}

type GetTransactionListParams = {
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFiltersState; // already debounced
};

export function getTransactionsListOptions(params: GetTransactionListParams) {
  const { pagination, sorting, filters } = params;
  return queryOptions({
    queryKey: transactionQueryKeys.getTransactions({
      page: params.pagination.pageIndex + 1,
      pageSize: params.pagination.pageSize,
      sorting: JSON.stringify(params.sorting),
      filters: JSON.stringify(params.filters),
    }),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', (pagination.pageIndex + 1).toString());
      searchParams.append('pageSize', pagination.pageSize.toString());
      if (sorting.length > 0) {
        sorting.forEach((item) => {
          searchParams.append(
            'sort',
            `${item.id}:${item.desc ? 'desc' : 'asc'}`
          );
        });
      }
      if (filters.length > 0) {
        filters.forEach((item) => {
          if (item.id === 'createdBy') {
            searchParams.append('createdBy', `${item.value}`);
          }
          if (item.id === 'userName') {
            searchParams.append('userName', `${item.value}`);
          }
          if (item.id === 'transactionId') {
            searchParams.append('transactionId', `${item.value}`);
          }
        });
      }
      return TransactionsClient.getTransactions({
        params: searchParams,
      });
    },
    select: (result) => result.data.data,
  });
}
