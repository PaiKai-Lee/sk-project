import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CommonModule } from 'src/common';
import { AuditLogController } from './audit-log.controller';

@Module({
  imports: [CommonModule],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
