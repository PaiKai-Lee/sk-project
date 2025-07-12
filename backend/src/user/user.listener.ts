import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserCreatedEvent,
  UserDisabledEvent,
  UserEditedEvent,
  UserEnabledEvent,
  UserNameChangedEvent,
  UserPasswordChangedEvent,
  UserPasswordResetEvent,
} from './user.event';
import { AuditLogService } from 'src/audit-log';

@Injectable()
export class UserListener {
  private readonly logger = new Logger(UserListener.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  @OnEvent('user.created')
  async logUserCreatedEvent(event: UserCreatedEvent) {
    const { context } = event;
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'user.created',
      content: `建立使用者: uid: ${event.uid}, name: ${event.name}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('user.created')
  handleUserCreatedEvent2(event: UserCreatedEvent) {
    // TODO: 建立通知，通知其他使用者有心使用者加入，並使用websocket通知使用者刷新通知
    this.logger.log(event);
  }

  @OnEvent('user.disabled')
  async logUserDisabledEvent(event: UserDisabledEvent) {
    const { context } = event;
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'user.disabled',
      content: `禁用使用者: uid: ${event.uid}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('user.updated')
  async handleUserEditedEvent(event: UserEditedEvent) {
    const { context, editData } = event;
    const contentString = Object.entries(editData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    console.log(contentString);
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'user.updated',
      content: `編輯使用者: uid: ${event.uid}, ${contentString}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('user.enabled')
  async logUserEnabledEvent(event: UserEnabledEvent) {
    const { context } = event;
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'user.enabled',
      content: `啟用使用者: uid: ${event.uid}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('user.passwordReset')
  async logUserPasswordResetEvent(event: UserPasswordResetEvent) {
    const { context } = event;
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'user.passwordReset',
      content: `重設使用者密碼: uid: ${event.uid}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('user.passwordChanged')
  async logUserPasswordChangedEvent(event: UserPasswordChangedEvent) {
    const { context } = event;
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'user.passwordChanged',
      content: `使用者修改密碼`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('user.nameChanged')
  async logUserNameChangedEvent(event: UserNameChangedEvent) {
    const { name, context } = event;
    await this.auditLogService.createAuditLog({
      userAgent: context.reqInfo.userAgent,
      ip: context.reqInfo.ip,
      action: 'user.nameChanged',
      content: `使用者修改名稱: ${name}`,
      user: {
        connect: {
          uid: context.user.uid,
        },
      },
    });
  }

  @OnEvent('user.*')
  userProfileChangedEvent(
    event:
      | UserDisabledEvent
      | UserEnabledEvent
      | UserPasswordChangedEvent
      | UserPasswordResetEvent,
  ) {
    // 排除user.created事件
    if (event instanceof UserCreatedEvent) return;

    // const { context } = event;
    // TODO: websocket 通知使用者 profile 更新
  }
}
