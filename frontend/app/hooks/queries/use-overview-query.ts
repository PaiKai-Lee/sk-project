import { useQuery } from '@tanstack/react-query';
import { overviewQueryKeys } from '~/features/overview';
import { OverviewClient } from '~/features/overview';

export function useOverviewQuery() {
  return useQuery({
    queryKey: overviewQueryKeys.getOverview(),
    queryFn: () => OverviewClient.getOverview(),
    select: (result) => result?.data?.data,
    staleTime: 60 * 1000,
  });
}
