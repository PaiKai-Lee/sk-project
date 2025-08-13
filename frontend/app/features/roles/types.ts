import type { IApiResponse } from '~/features/types';

export interface Permission {
  id: number;
  action: string;
  description: string;
}

export interface RolePermission {
  roleId: number;
  id: number;
  permissionId: number;
  permission: Permission;
}

export interface IRole {
  id: number;
  name: string;
  rolePermissions?: RolePermission[];
}

export interface IRolesResponse extends IApiResponse<IRole[]> {}
