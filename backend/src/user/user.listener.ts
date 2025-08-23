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

  @OnEvent(UserCreatedEvent.EVENT_NAME)
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

  @OnEvent(UserDisabledEvent.EVENT_NAME)
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

  @OnEvent(UserEditedEvent.EVENT_NAME)
  async handleUserEditedEvent(event: UserEditedEvent) {
    const { context, editData } = event;
    const contentString = Object.entries(editData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

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

  @OnEvent(UserEnabledEvent.EVENT_NAME)
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

  @OnEvent(UserPasswordResetEvent.EVENT_NAME)
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

  @OnEvent(UserPasswordChangedEvent.EVENT_NAME)
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

  @OnEvent(UserNameChangedEvent.EVENT_NAME)
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
