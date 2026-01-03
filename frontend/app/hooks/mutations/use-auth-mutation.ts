import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AuthClient, authQueryKeys } from '~/features/auth';
import { tokenManager } from '~/lib/token-manager';

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
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await AuthClient.logout();
      tokenManager.removeAccessToken();
      tokenManager.removeRefreshToken();
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
