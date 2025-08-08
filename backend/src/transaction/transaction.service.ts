import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import {
  CreateTransactionDto,
  CreateTransactionItemDto,
} from './dtos/create-transaction.dto';
import { TransactionHelper } from './transaction.helper';
import { Prisma } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransactionCreatedEvent } from './transaction.event';
import { GetTransactionsDto } from './dtos/get-transactions.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionHelper: TransactionHelper,
    private readonly cls: ClsService<AppClsStore>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getTransactions(getTransactionsDto: GetTransactionsDto) {
    this.logger.debug('getTransactions' + JSON.stringify(getTransactionsDto));
    const {
      page = 1,
      pageSize = 10,
      sort = ['createdAt:desc'],
      includeItems = false,
      all = false,
      startDate,
      endDate,
      userName,
      transactionId,
    } = getTransactionsDto;

    const where: Prisma.TransactionWhereInput = {};
    const skip = all ? undefined : (page - 1) * pageSize;
    const take = all ? undefined : pageSize;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (userName) {
      where.createdByUser = { name: { equals: userName } };
    }

    if (transactionId) {
      where.transactionId = { equals: transactionId };
    }

    const orderBy = [] as Prisma.TransactionOrderByWithRelationInput[];
    if (sort) {
      sort.forEach((key) => {
        const [field, order] = key.split(':');
        orderBy.push({ [field]: order as Prisma.SortOrder });
      });
    }

    // 查總筆數（不受 skip/take 影響）
    const total = await this.prisma.transaction.count({ where });

    const query: Prisma.TransactionFindManyArgs = {
      skip,
      take,
      where,
      orderBy,
      select: {
        transactionId: true,
        remark: true,
        createdByUser: {
          select: {
            uid: true,
            name: true,
          },
        },
        createdAt: true,
        transactionsItems: includeItems && {
          select: {
            id: true,
            user: { select: { uid: true, name: true } },
            value: true,
            details: true,
            createdAt: true,
          },
        },
      },
    };

    const transactionsResult = await this.prisma.transaction.findMany(query);
    return {
      pagination: {
        page: all ? null : page,
        pageSize: all ? null : pageSize,
        total,
      },
      rows: transactionsResult,
    };
  }

  async getTransactionByTrxId(trxId: string) {
    this.logger.debug(`getTransactionByTrxId: ${trxId}`);
    return this.prisma.transaction.findUnique({
      where: { transactionId: trxId },
      select: {
        transactionId: true,
        remark: true,
        createdByUser: {
          select: {
            uid: true,
            name: true,
          },
        },
        createdAt: true,
        transactionsItems: {
          select: {
            id: true,
            user: { select: { uid: true, name: true } },
            value: true,
            details: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * 建立交易
   */
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<void> {
    this.logger.debug(createTransactionDto);
    const { remark, items: createTransactionItemsDto } = createTransactionDto;
    const authUser = this.cls.get('user');
    const createTransactionResult = await this.prisma.$transaction(
      async (tx) => {
        const userBalanceLog: Prisma.UserBalanceLogCreateManyInput[] = [];

        for (const item of createTransactionItemsDto) {
          const user = await tx.user.update({
            where: {
              uid: item.uid,
            },
            data: {
              balance: {
                increment: item.value,
              },
            },
            select: {
              uid: true,
              balance: true,
            },
          });
          // 建立balance-log，後續更新使用
          userBalanceLog.push({
            uid: user.uid,
            value: item.value,
            currentBalance: user.balance,
          });
        }
        const transactionId = this.transactionHelper.generateTrxId();
        // 建立清單跟清單項目
        await tx.transaction.create({
          data: {
            transactionId,
            remark,
            createdByUser: {
              connect: {
                uid: authUser.uid,
              },
            },
            transactionsItems: {
              createMany: {
                data: createTransactionItemsDto,
              },
            },
          },
        });
        // 建立balance-log
        await tx.userBalanceLog.createMany({
          data: userBalanceLog,
        });

        return {
          transactionId,
          userBalanceLog,
        };
      },
    );

    this.eventEmitter.emit(
      'transaction.created',
      new TransactionCreatedEvent({
        transactionId: createTransactionResult.transactionId,
        userBalanceLog: createTransactionResult.userBalanceLog,
        context: this.cls.get(),
      }),
    );
  }
}
