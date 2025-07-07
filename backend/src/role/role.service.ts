import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { GetRolesDto } from './dtos/get-roles.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(getRolesDto: GetRolesDto) {
    const { includePermissions } = getRolesDto;

    const include = includePermissions
      ? {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        }
      : undefined;

    return this.prisma.role.findMany({
      orderBy: {
        id: 'asc',
      },
      include,
    });
  }
}
