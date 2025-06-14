import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get('app.port') as number;
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.use(morgan('tiny', {
    stream: {
      write: (message) => {
        logger.log(message, 'HTTP');
      },
    },
  }));
  app.useLogger(logger);
  app.enableShutdownHooks();
  await app.listen(port);
  logger.log(`Server running on port ${port}`, 'Bootstrap');
}
bootstrap();
