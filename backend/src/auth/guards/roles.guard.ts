import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cls: ClsService<AppClsStore>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 取得handler的roles
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    const role = this.cls.get('user')?.role;
    return requiredRoles.length === 0 || requiredRoles.includes(role);
  }
}
