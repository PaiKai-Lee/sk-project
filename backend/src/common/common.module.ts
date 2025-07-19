import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { UtilsModule } from './utils';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import {
  appConfiguration,
  authConfiguration,
  loggerConfiguration,
} from './config';
import { validate } from './config/env.validation';
import { ClsModule } from 'nestjs-cls';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfiguration, authConfiguration, loggerConfiguration],
      validate,
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('reqInfo', {
            method: req.method,
            path: req.path,
            ip: (req.ip || '').replace('::ffff:', ''),
            userAgent: req.headers['user-agent'] || '',
            traceId: randomUUID(),
          });
        },
      },
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig =
          configService.getOrThrow<ConfigType<typeof appConfiguration>>('app');
        const loggerConfig =
          configService.getOrThrow<ConfigType<typeof loggerConfiguration>>(
            'logger',
          );
        const isProd = appConfig.env === 'production';
        const transports: winston.transport[] = [];
        if (isProd) {
          transports.push(
            new DailyRotateFile({
              dirname: path.join(appConfig.rootPath, loggerConfig.dirname),
              filename: 'application-%DATE%.log',
              datePattern: 'YYYY-MM-DD-HH',
              zippedArchive: loggerConfig.zipArchive,
              maxSize: loggerConfig.fileMaxSize,
              maxFiles: loggerConfig.maxFiles,
            }),
          );
        } else {
          transports.push(
            // development：Console + nest-like pretty
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike('Nest', {
                  colors: true,
                  prettyPrint: true,
                  processId: true,
                  appName: true,
                }),
              ),
            }),
          );
        }
        return {
          transports,
          level: loggerConfig.level ?? (isProd ? 'info' : 'debug'),
          format: isProd
            ? winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              )
            : undefined,
        };
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    PrismaModule,
    UtilsModule,
  ],
  exports: [ConfigModule, ClsModule, PrismaModule, UtilsModule, WinstonModule],
})
export class CommonModule {}
