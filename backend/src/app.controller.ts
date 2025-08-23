import { Controller, Get, Header, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('favicon.ico')
  @HttpCode(204)
  @Header('Cache-Control', 'max-age=86400, public')
  favicon() {
    /* no body */
  }
}
