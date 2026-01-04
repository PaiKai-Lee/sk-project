import { useQuery } from '@tanstack/react-query';
import { roleQueryKeys, RoleClient } from '~/features/roles';

export function useRoleQuery() {
  return useQuery({
    queryKey: roleQueryKeys.getRoles(),
    queryFn: () => RoleClient.getRoles(),
    select: ({ data }) => data.data,
    staleTime: 60 * 1000 * 60,
  });
}
