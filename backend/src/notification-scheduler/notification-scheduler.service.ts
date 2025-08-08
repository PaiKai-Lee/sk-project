import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class NotificationSchedulerService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *')
  async handleCron() {
    await this.prisma.userNotification.deleteMany({
      where: {
        expiredAt: {
          lt: new Date(),
        },
      },
    });
  }
}
