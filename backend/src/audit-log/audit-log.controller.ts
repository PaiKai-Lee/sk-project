import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

import { GetAuditLogsDto } from './dtos/get-audit-logs.dto';
@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAuditLogs(
    @Query(new ValidationPipe({ transform: true })) query: GetAuditLogsDto,
  ) {
    return this.auditLogService.getAuditLogs(query);
  }
}
