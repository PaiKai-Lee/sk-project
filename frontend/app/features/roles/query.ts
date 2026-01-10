import { queryOptions } from '@tanstack/react-query';
import { RoleClient } from './api';

export const roleQueryKeys = {
  all: ['roles'] as const,
  getRoles: (params?: any) => [...roleQueryKeys.all, params] as const,
};

export function getRoleQueryOptions() {
  return queryOptions({
    queryKey: roleQueryKeys.getRoles(),
    queryFn: () => RoleClient.getRoles(),
    select: ({ data }) => data.data,
    staleTime: 60 * 1000 * 60,
  });
}
