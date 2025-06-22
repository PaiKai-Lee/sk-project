import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type {
  IResponseData,
  IProfileResponse,
  ILoginResponse,
  IRefreshTokenResponse,
  IApiResponse,
} from './types';

class AuthClient {
  static login(
    { uid, password }: { uid: string; password: string },
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<ILoginResponse>> {
    return httpClient.post(
      '/auth/login',
      {
        uid,
        password,
      },
      options
    );
  }

  static logout(): Promise<IApiResponse<null>> {
    return httpClient.post('/auth/logout');
  }

  static refreshToken(
    { refreshToken }: { refreshToken: string },
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IRefreshTokenResponse>> {
    return httpClient.post(
      '/auth/refresh-token',
      {
        refreshToken,
      },
      options
    );
  }

  static getProfile(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IProfileResponse>> {
    return httpClient.get('/auth/profile', options);
  }
}

export default AuthClient;
