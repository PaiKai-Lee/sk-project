import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma';
import { GetAuditLogsDto } from './dtos/get-audit-logs.dto';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);
  constructor(private readonly prisma: PrismaService) { }

  async createAuditLog(data: Prisma.AuditLogCreateInput) {
    this.logger.debug('createAuditLog ' + JSON.stringify(data));
    return this.prisma.auditLog.create({ data });
  }

  async getAuditLogs(dto: GetAuditLogsDto) {
    this.logger.debug('getAuditLogs');

    const { page = 1, pageSize = 10, sort = ['id:desc'], uid, ip } = dto;
    const where: Prisma.AuditLogWhereInput = {}
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    if (uid) {
      where.uid = { equals: uid };
    }

    if (ip) {
      where.ip = { equals: ip };
    }

    const orderBy = [] as Prisma.AuditLogOrderByWithRelationInput[];
    if (sort) {
      sort.forEach((key) => {
        const [field, order] = key.split(':');
        orderBy.push({ [field]: order as Prisma.SortOrder });
      });
    }

    // 查總筆數（不受 skip/take 影響）
    const total = await this.prisma.auditLog.count({ where });

    // 查資料
    const logsResult = await this.prisma.auditLog.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return {
      pagination: {
        page,
        pageSize,
        total,
      },
      rows: logsResult,
    };

  }
}
