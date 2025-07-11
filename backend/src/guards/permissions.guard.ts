import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cls: ClsService<AppClsStore>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 取得handler的permissions
    const requiredPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    // 確認使用者的permissions是否滿足handler的permissions
    const userPermissions = this.cls.get('user')?.permissions ?? [];
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }
}
