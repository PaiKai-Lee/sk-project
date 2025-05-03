import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createAuditLog(data: Prisma.AuditLogCreateInput) {
    this.logger.debug('createAuditLog ' + JSON.stringify(data));
    return this.prisma.auditLog.create({ data });
  }
}
