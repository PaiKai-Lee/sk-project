import { queryOptions } from '@tanstack/react-query';
import { OverviewClient } from './api';

export const overviewQueryKeys = {
  all: ['overview'] as const,
  getOverview: (params?: any) => [...overviewQueryKeys.all, params] as const,
};

export function getOverviewOptions() {
  return queryOptions({
    queryKey: overviewQueryKeys.getOverview(),
    queryFn: () => OverviewClient.getOverview(),
    select: (result) => result.data.data,
    staleTime: 60 * 1000,
  });
}
