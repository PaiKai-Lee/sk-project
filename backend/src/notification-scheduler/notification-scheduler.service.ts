import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);
  
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('執行定時任務: 清除過期通知');
    const res = await this.prisma.userNotification.deleteMany({
      where: {
        expiredAt: {
          lt: new Date(),
        },
      },
    });
    this.logger.log(`清除了 ${res.count} 筆過期通知`);
  }
}
