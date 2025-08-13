// httpClient.ts
import axios from 'axios';
import { tokenManager } from '~/lib/token-manager';
import { AuthClient } from '~/features/auth';

const httpClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

async function forceLogout() {
  console.log('force logout');
  tokenManager.removeRefreshToken();
  tokenManager.removeAccessToken();
  await AuthClient.logout();
}

httpClient.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return Promise.reject(error);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const { data: axiosData } = await axios.post(
          '/api/auth/refresh-token',
          {
            refreshToken,
          }
        );
        tokenManager.setRefreshToken(axiosData.data.refreshToken);
        tokenManager.setAccessToken(axiosData.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${axiosData.data.accessToken}`;
        return httpClient(originalRequest);
      } catch (refreshErr) {
        forceLogout();
        console.error(error);
        return Promise.reject(refreshErr);
      }
    }

    if (error.response?.status === 401) {
      forceLogout();
      console.error(error);
    }
    return Promise.reject(error);
  }
);

export default httpClient;
