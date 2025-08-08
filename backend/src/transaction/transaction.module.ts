import { forwardRef, Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { UserModule } from 'src/user';
import { CommonModule } from 'src/common';
import { TransactionHelper } from './transaction.helper';
import { TransactionListener } from './transaction.listener';
import { AuditLogModule } from 'src/audit-log';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [CommonModule, AuditLogModule, NotificationModule, forwardRef(() => UserModule)],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionListener, TransactionHelper],
  exports: [TransactionService],
})
export class TransactionModule {}
