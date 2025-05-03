import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnApplicationShutdown
{
  private logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    super.$on('query', (e) => {
      this.logger.debug(
        `Query: ${e.query}, Params: ${e.params}, Duration: ${e.duration}ms`,
      );
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.debug(`PrismaService onApplicationShutdown: ${signal}`);
    await this.$disconnect();
  }
}
