import type { AxiosResponse } from 'axios';
export interface IResponseData<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type IApiResponse<T> = AxiosResponse<IResponseData<T>>;

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// Auth

export interface ILoginResponse {
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
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IProfileResponse {
  uid: string;
  role: string;
  isDisable: boolean;
  isInit: boolean;
  permissions: string[];
  name: string;
}

// Transaction

export interface ITransactionItem {
  id: string;
  user: {
    uid: string;
    name: string;
  };
  value: number;
  details: string;
  createdAt: string;
}

export interface IOneTransactionResponse {
  transactionId: string;
  remark: string;
  createdByUser: {
    uid: string;
    name: string;
  };
  createdAt: string;
  transactionsItems?: ITransactionItem[];
}

export interface ITransactionsResponse {
  pagination: Pagination;
  rows: IOneTransactionResponse[];
}

// User

export interface IUserResponse {
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

// Overview

export interface IOverviewResponse {
  totalBalance: number;
  overdrawUsers: Omit<
    IUserResponse,
    'role' | 'isInit' | 'isDisable' | 'version'
  >[];
  recentTransactions: IOneTransactionResponse[];
}

// Roles

export interface RolePermission {
  roleId: number;
  id: number;
  permissionId: number;
  permission: Permission;
}

export interface IRoleResponse {
  id: number;
  name: string;
  rolePermissions?: RolePermission[];
}

// Permissions

export interface Permission {
  id: number;
  action: string;
  description: string;
}

// Departments

export interface IDepartmentResponse {
  id: number;
  name: string;
}
