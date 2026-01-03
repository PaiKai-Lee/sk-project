import { useMemo } from 'react';
import { useAuthProfileQuery } from './queries/use-auth-query';
import {
  useAuthLoginMutation,
  useAuthLogoutMutation,
} from './mutations/use-auth-mutation';

export const useAuth = () => {
  const authProfileQuery = useAuthProfileQuery();
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
