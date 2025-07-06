import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common';
import { TransactionModule } from 'src/transaction';
import { UserModule } from 'src/user';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';
@Module({
  imports: [CommonModule, TransactionModule, UserModule],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}
