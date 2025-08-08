import { Module } from '@nestjs/common';
import { UserNotificationController } from './user-notification.controller';
import { UserNotificationService } from './user-notification.service';
import { CommonModule } from 'src/common';
import { AuditLogModule } from 'src/audit-log';

@Module({
  imports: [CommonModule, AuditLogModule],
  controllers: [UserNotificationController],
  providers: [UserNotificationService]
})
export class UserNotificationModule { }
