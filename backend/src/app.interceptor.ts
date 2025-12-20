import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { version } from '../package.json';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    res.header('x-api-version', version);

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: res.statusCode || 200,
          message: 'success',
          data: data ?? null,
        };
      }),
    );
  }
}
