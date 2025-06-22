// httpClient.ts
import axios from 'axios';
import { tokenManager } from '~/lib/token-manager';
import AuthClient from '~/api/auth';

const httpClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

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
        await AuthClient.logout();
        console.error(error);
        return Promise.reject(refreshErr);
      }
    }

    if (error.response?.status === 401) {
      // 無 refreshToken，直接登出
      tokenManager.removeRefreshToken();
      tokenManager.removeAccessToken();
      try {
        await AuthClient.logout();
      } catch (error) {
        console.error(error);
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
