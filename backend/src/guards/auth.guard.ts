import {
  CanActivate,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly cls: ClsService<AppClsStore>) {}

  canActivate(): boolean {
    this.logger.debug('canActivate');
    const user = this.cls.get('user');
    // 沒有uid代表沒有登入，訪客請求
    if (!user?.uid) throw new UnauthorizedException('請先登入');
    return true;
  }
}
