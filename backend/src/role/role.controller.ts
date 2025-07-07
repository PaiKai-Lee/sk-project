import { Controller, Get, Logger, Query, ValidationPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { GetRolesDto } from './dtos/get-roles.dto';

@Controller('roles')
export class RoleController {
  private readonly logger = new Logger(RoleController.name);
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getRoles(
    @Query(new ValidationPipe({ transform: true })) query: GetRolesDto,
  ) {
    return this.roleService.getRoles(query);
  }
}
