import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { BcryptService } from './bcrypt.service';

@Module({
  providers: [UtilsService, BcryptService],
  exports: [UtilsService, BcryptService],
})
export class UtilsModule {}
