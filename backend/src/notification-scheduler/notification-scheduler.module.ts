import { Module } from '@nestjs/common';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { CommonModule } from 'src/common';

@Module({
  imports: [CommonModule],
  providers: [NotificationSchedulerService]
})
export class NotificationSchedulerModule {}
