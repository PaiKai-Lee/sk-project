import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RoleGuard } from 'src/guards/roles.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { NOTIFICATION_SOURCE_TYPE } from 'src/common/constants';

@UseGuards(RoleGuard)
@Roles(Role.Admin)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto, NOTIFICATION_SOURCE_TYPE.ADMIN);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
