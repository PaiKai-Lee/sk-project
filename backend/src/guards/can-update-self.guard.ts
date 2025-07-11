import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';

@Injectable()
export class CanUpdateSelfGuard implements CanActivate {
  constructor(
    private cls: ClsService<AppClsStore>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // params 對象不能是自己
    const params = context.switchToHttp().getRequest().params;
    return params.uid !== this.cls.get('user')?.uid;
  }
}
