import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { RoleGuard } from 'src/guards/roles.guard';
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
