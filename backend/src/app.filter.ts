import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from './common';
// import { Logger } from 'winston';

@Catch()
export class AppFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppFilter.name);
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly cls: ClsService<AppClsStore>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // 處理 HttpException
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && (response as any).message) {
        message = (response as any).message;
      }
    }

    // 處理 Prisma 錯誤
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          httpStatus = HttpStatus.CONFLICT;
          message = '資料重複';
          break;
        case 'P2025':
          httpStatus = HttpStatus.NOT_FOUND;
          message = `找不到對應的資料`;
          break;
        case 'P2003':
          httpStatus = HttpStatus.BAD_REQUEST;
          message = `無效關聯資料`;
          break;
        default:
          message = `資料庫錯誤: ${exception.code}`;
          break;
      }
    }

    // 其他 Prisma 錯誤
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = `資料庫請求格式錯誤`;
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = `資料庫錯誤`;
    }

    this.logger.error(message, (exception as any)?.stack || '');

    // 統一回傳格式
    const responseBody = {
      statusCode: httpStatus,
      message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
