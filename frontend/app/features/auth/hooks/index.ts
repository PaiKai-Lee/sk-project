import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getAuthProfileOptions,
  useAuthLoginMutation,
  useAuthLogoutMutation,
} from '../query';

export const useAuth = () => {
  const authProfileQuery = useQuery({
    ...getAuthProfileOptions(),
    retry: false,
  });
  const authLoginMutation = useAuthLoginMutation();
  const authLogoutMutation = useAuthLogoutMutation();

  const isAdmin = useMemo(() => {
    return (
      authProfileQuery.data?.role === 'root' ||
      authProfileQuery.data?.role === 'admin'
    );
  }, [authProfileQuery.data]);

  return {
    profile: authProfileQuery.data,
    isAuthenticated: !!authProfileQuery.data,

    isPendingProfile: authProfileQuery.isPending,
    isLoadingProfile: authProfileQuery.isLoading,

    login: authLoginMutation.mutate,
    logout: authLogoutMutation.mutate,
    isAdmin,
  };
};
