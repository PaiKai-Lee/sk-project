import { queryOptions } from '@tanstack/react-query';
import { MeClient } from './api';
import type { GetBalanceLogsDto } from './types';

export const meQueryKeys = {
  all: ['me'] as const,
  get: () => [...meQueryKeys.all, 'get'] as const,
  getBalanceLogs: (params: GetBalanceLogsDto) =>
    [...meQueryKeys.all, 'balance-logs', params] as const,
};

export function getMeQueryOptions() {
  return queryOptions({
    queryKey: meQueryKeys.get(),
    queryFn: () => MeClient.get(),
    select: ({ data }) => data.data,
  });
}

export function getMeBalanceOptions(params: GetBalanceLogsDto) {
  return queryOptions({
    queryKey: meQueryKeys.getBalanceLogs(params),
    queryFn: () => MeClient.getBalanceLogs(params),
    select: ({ data }) => data.data,
  });
}
