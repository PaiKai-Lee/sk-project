import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CommonModule } from 'src/common';
import { AuditLogModule } from 'src/audit-log';

@Module({
  imports: [CommonModule, AuditLogModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
