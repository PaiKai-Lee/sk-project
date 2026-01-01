import { useQuery } from '@tanstack/react-query';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { transactionQueryKeys } from '~/features/transactions';
import { TransactionsClient } from '~/features/transactions';

export function useTransactionDetailQuery(trxId: string) {
  return useQuery({
    queryKey: transactionQueryKeys.getOneTransaction(trxId as string),
    enabled: !!trxId,
    queryFn: async () => {
      const { data } = await TransactionsClient.getOneTransaction(
        trxId as string
      );
      return data;
    },
    select: (data) => data.data,
    staleTime: 1000 * 60,
  });
}

type GetTransactionListParams = {
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFiltersState; // already debounced
};

export function useTransactionListQuery(params: GetTransactionListParams) {
  const { pagination, sorting, filters } = params;
  return useQuery({
    queryKey: transactionQueryKeys.getTransactions({
      page: params.pagination.pageIndex + 1,
      pageSize: params.pagination.pageSize,
      sorting: JSON.stringify(params.sorting),
      filters: JSON.stringify(params.filters),
    }),
    queryFn: async () => {
      const apiParams = new URLSearchParams();
      apiParams.append('page', (pagination.pageIndex + 1).toString());
      apiParams.append('pageSize', pagination.pageSize.toString());
      if (sorting.length > 0) {
        sorting.forEach((item) => {
          apiParams.append('sort', `${item.id}:${item.desc ? 'desc' : 'asc'}`);
        });
      }
      if (filters.length > 0) {
        filters.forEach((item) => {
          if (item.id === 'createdBy') {
            apiParams.append('createdBy', `${item.value}`);
          }
          if (item.id === 'userName') {
            apiParams.append('userName', `${item.value}`);
          }
          if (item.id === 'transactionId') {
            apiParams.append('transactionId', `${item.value}`);
          }
        });
      }
      const { data } = await TransactionsClient.getTransactions({
        params: apiParams,
      });
      return data;
    },
    select: (data) => data.data,
  });
}
