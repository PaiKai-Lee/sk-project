import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TransactionModule } from 'src/transaction';
import { CommonModule } from 'src/common';
import { UserListener } from './user.listener';
import { AuditLogModule } from 'src/audit-log/audit-log.module';

@Module({
  imports: [CommonModule, AuditLogModule, forwardRef(() => TransactionModule)],
  controllers: [UserController],
  providers: [UserService, UserListener],
  exports: [UserService],
})
export class UserModule {}
