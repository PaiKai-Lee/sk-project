import type { GetBalanceLogsDto } from './types';

export const meQueryKeys = {
  all: ['me'] as const,
  get: () => [...meQueryKeys.all, 'get'] as const,
  getBalanceLogs: (params: GetBalanceLogsDto) =>
    [...meQueryKeys.all, 'get-balance-logs', params] as const,
};
