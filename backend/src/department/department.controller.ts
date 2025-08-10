import { Controller, Get, Logger } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('departments')
export class DepartmentController {
  private readonly logger = new Logger(DepartmentController.name);
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getRoles() {
    return this.departmentService.getDepartments();
  }
}
