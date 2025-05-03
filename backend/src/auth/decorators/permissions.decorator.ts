import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../enums/permissions.enum';

export const PERMISSION_KEY = Symbol('permissions');
export const Roles = (...roles: Permissions[]) =>
  SetMetadata(PERMISSION_KEY, roles);
