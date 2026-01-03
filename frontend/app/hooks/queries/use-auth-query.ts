import { useQuery } from '@tanstack/react-query';
import { AuthClient, authQueryKeys } from '~/features/auth';

export function useAuthProfileQuery() {
  return useQuery({
    queryKey: authQueryKeys.getProfile(),
    queryFn: async () => {
      const { data } = await AuthClient.getProfile();
      return data;
    },
    select: (data) => data.data,
    retry: false,
  });
}
