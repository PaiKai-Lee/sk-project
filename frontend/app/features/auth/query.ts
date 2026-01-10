import { queryOptions } from '@tanstack/react-query';
import { AuthClient } from './api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { tokenManager } from '~/lib/token-manager';

export const authQueryKeys = {
  all: ['auth'],
  getProfile: () => [...authQueryKeys.all, 'profile'],
} as const;

export function getAuthProfileOptions() {
  return queryOptions({
    queryKey: authQueryKeys.getProfile(),
    queryFn: async () => {
      const { data } = await AuthClient.getProfile();
      return data;
    },
    select: (data) => data.data,
  });
}

export function useAuthLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: { uid: string; password: string }) => {
      const { data: axiosData } = await AuthClient.login(data);
      const { accessToken, refreshToken, profile } = axiosData.data;
      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
      queryClient.setQueryData(authQueryKeys.getProfile(), profile);
    },
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useAuthLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await AuthClient.logout();
    },
    onSuccess: () => {
      tokenManager.removeAccessToken();
      tokenManager.removeRefreshToken();
      queryClient.setQueryData(authQueryKeys.getProfile(), null);
      navigate('/login');
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
