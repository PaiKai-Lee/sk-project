// src/auth/middleware/authentication.middleware.ts
import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);
  constructor(
    private readonly cls: ClsService<AppClsStore>,
    private readonly JwtService: JwtService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    this.cls.run(() => {
      // 預設為 guest
      this.cls.set('user', {
        role: 'guest',
        permissions: [],
      });

      const token = this.extractToken(req);

      if (token) {
        try {
          const payload = this.JwtService.verify(token); // 自定 jwt 驗證方法，回傳 uid, role, permissions
          this.cls.set('user', {
            uid: payload.uid,
            role: payload.role,
            isDisable: payload.isDisable,
            isInit: payload.isInit,
            permissions: payload.permissions || [],
            name: payload.name || undefined,
          });
        } catch (err) {
          // 保持 guest 狀態，由後續的guard處理
          this.logger.warn(`jwt verify error: ${err}`);
        }
      }

      next();
    });
  }

  private extractToken(req: Request): string | undefined {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return undefined;
    if (!authHeader.startsWith('Bearer ')) return undefined;
    return authHeader.slice(7); // 移除 "Bearer "
  }
}
