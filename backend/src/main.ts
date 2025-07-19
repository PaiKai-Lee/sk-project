import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.set('trust proxy', 1);
  const configService = app.get(ConfigService);
  const port = configService.get('app.port') as number;
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.use(
    morgan('tiny', {
      stream: {
        write: (message) => {
          logger.log(message, 'HTTP');
        },
      },
    }),
  );
  app.useLogger(logger);
  app.use((req: Request, res: Response, next: NextFunction) => {
    // 參考MDN處理BigInt
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#description
    // @ts-ignore
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
    next();
  });
  app.enableShutdownHooks();
  await app.listen(port);
  logger.log(`Server running on port ${port}`, 'Bootstrap');
}
bootstrap();
