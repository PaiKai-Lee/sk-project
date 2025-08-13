import type { IApiResponse } from '../types';

export interface IRefreshToken {
  accessToken: string;
  refreshToken: string;
}

export interface IProfile {
  uid: string;
  role: string;
  isDisable: boolean;
  isInit: boolean;
  permissions: string[];
  name: string;
}

export interface IProfileResponse extends IApiResponse<IProfile> {}
export interface IRefreshTokenResponse extends IApiResponse<IRefreshToken> {}
export interface ILoginResponse
  extends IApiResponse<{
    accessToken: string;
    refreshToken: string;
    profile: {
      uid: string;
      name: string;
      isDisable: boolean;
      isInit: boolean;
      role: string;
      permissions: string[];
    };
  }> {}
export interface ILogoutResponse extends IApiResponse<null> {}
