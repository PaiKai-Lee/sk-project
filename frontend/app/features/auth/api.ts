import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type {
  IProfileResponse,
  ILoginResponse,
  IRefreshTokenResponse,
  ILogoutResponse,
} from './types';

export class AuthClient {
  static login(
    { uid, password }: { uid: string; password: string },
    options?: AxiosRequestConfig
  ): Promise<ILoginResponse> {
    return httpClient.post(
      '/auth/login',
      {
        uid,
        password,
      },
      options
    );
  }

  static logout(): Promise<ILogoutResponse> {
    return httpClient.post('/auth/logout');
  }

  static refreshToken(
    { refreshToken }: { refreshToken: string },
    options?: AxiosRequestConfig
  ): Promise<IRefreshTokenResponse> {
    return httpClient.post(
      '/auth/refresh-token',
      {
        refreshToken,
      },
      options
    );
  }

  static getProfile(options?: AxiosRequestConfig): Promise<IProfileResponse> {
    return httpClient.get('/auth/profile', options);
  }
}
