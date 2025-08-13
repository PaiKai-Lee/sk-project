import type { IApiResponse } from '~/features/types';

export interface IUser {
  id: string;
  uid: string;
  name: string;
  balance?: number;
  role?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  isInit?: boolean;
  isDisable?: boolean;
  version?: number;
}

export interface IUsersResponse extends IApiResponse<IUser[]> {}
export interface IUserResponse extends IApiResponse<IUser> {}
