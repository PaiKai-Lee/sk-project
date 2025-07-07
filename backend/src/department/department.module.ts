import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common';
import { AuditLogModule } from 'src/audit-log';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [CommonModule, AuditLogModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
