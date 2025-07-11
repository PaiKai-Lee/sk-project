import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getTransactions(
    @Query(new ValidationPipe({ transform: true })) query: GetTransactionsDto,
  ) {
    this.logger.debug('getTransactions' + JSON.stringify(query));
    return this.transactionService.getTransactions(query);
  }

  @Get(':trxId')
  async getTransaction(@Param('trxId') trxId: string) {
    return this.transactionService.getTransactionByTrxId(trxId);
  }

  /**
   * 建立交易
   */
  @Post()
  async createTransaction(
    @Body(new ValidationPipe({ transform: true }))
    createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(createTransactionDto);
  }
}
