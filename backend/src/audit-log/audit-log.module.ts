import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CommonModule } from 'src/common';

@Module({
  imports: [CommonModule],
  controllers: [],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
