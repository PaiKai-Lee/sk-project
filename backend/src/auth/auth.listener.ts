import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditLogService } from 'src/audit-log';
import { AuthEvent } from './auth.event';

@Injectable()
export class AuthListener {
  private readonly logger = new Logger(AuthListener.name);
  constructor(private readonly auditLogService: AuditLogService) {}
  @OnEvent('auth.login')
  async UserLoginEvent(event: AuthEvent) {
    const { context } = event;
    if (!event.context.user?.uid) {
      this.logger.error('uid not found');
      return;
    }
    this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'auth.login',
      content: `使用者登入: ${event.context.user.uid}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('auth.logout')
  async UserLogoutEvent(event: AuthEvent) {
    const { context } = event;
    this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'auth.logout',
      content: `使用者登出: ${event.context.user.uid}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }
}
