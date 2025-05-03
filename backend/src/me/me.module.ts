import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common';
import { UserModule } from 'src/user/user.module';
import { MeController } from './me.controller';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [MeController],
})
export class MeModule {}
