import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MeModule } from './me/me.module';
import { TransactionModule } from './transaction/transaction.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppFilter } from './app.filter';
import { ResponseInterceptor } from './app.interceptor';
import { AuthenticationMiddleware } from './auth/auth.middleware';

@Module({
  imports: [CommonModule, AuthModule, UserModule, TransactionModule, MeModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
