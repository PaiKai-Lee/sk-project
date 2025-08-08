import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CommonModule } from 'src/common';
import { AuditLogModule } from 'src/audit-log';

@Module({
  imports: [CommonModule, AuditLogModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule { }
