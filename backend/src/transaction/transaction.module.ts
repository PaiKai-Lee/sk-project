import { forwardRef, Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { UserModule } from 'src/user';
import { CommonModule } from 'src/common';
import { TransactionHelper } from './transaction.helper';
import { TransactionListener } from './transaction.listener';
import { AuditLogModule } from 'src/audit-log';

@Module({
  imports: [CommonModule, AuditLogModule, forwardRef(() => UserModule)],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionListener, TransactionHelper],
})
export class TransactionModule {}
