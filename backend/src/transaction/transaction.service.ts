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
      orderBy = 'createdAt',
      order = 'desc',
      includeItems = 'true',
      all = 'false',
      startDate,
      endDate,
      userName,
    } = getTransactionsDto;

    const where: Prisma.TransactionWhereInput = {};
    const skip = all === 'true' ? undefined : (page - 1) * pageSize;
    const take = all === 'true' ? undefined : pageSize;

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
      where.transactionsItems = {
        some: {
          user: {
            name: userName,
          },
        },
      };
    }

    // 查總筆數（不受 skip/take 影響）
    const total = await this.prisma.transaction.count({ where });

    const query: Prisma.TransactionFindManyArgs = {
      skip,
      take,
      where,
      orderBy: [
        {
          id: 'desc',
        },
        {
          [orderBy]: order,
        },
      ],
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
        transactionsItems: includeItems === 'true' && {
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
        page: all === 'true' ? null : page,
        pageSize: all === 'true' ? null : pageSize,
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
    //TODO: 使用者扣款(加鎖避免競爭)
    const createTransactionResult = await this.prisma.$transaction(
      async (tx) => {
        // 取得所有使用者的錢並扣款
        const users = await tx.user.findMany({
          select: {
            uid: true,
            balance: true,
          },
          where: {
            uid: {
              in: createTransactionItemsDto.map((item) => item.uid),
            },
          },
        });

        const transactionItemsMap = createTransactionItemsDto.reduce(
          (acc, item) => {
            acc[item.uid] = item;
            return acc;
          },
          {},
        ) as Record<string, CreateTransactionItemDto>;

        const userBalanceLog: Prisma.UserBalanceLogCreateManyInput[] = [];

        for (const user of users) {
          const transactionItems = transactionItemsMap[user.uid];
          const newBalance = user.balance + transactionItems.value;
          await tx.user.update({
            where: {
              uid: user.uid,
            },
            data: {
              balance: newBalance,
            },
          });
          // 建立balance-log，後續更新使用
          userBalanceLog.push({
            uid: user.uid,
            value: transactionItems.value,
            currentBalance: newBalance,
          });
        }
        const transactionId = this.transactionHelper.generateTrxId();
        // 建立清單跟清單項目
        await tx.transaction.create({
          data: {
            transactionId,
            remark,
            createdByUser:{
                connect:{
                    uid: authUser.uid
                }
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
          users: users.map((user) => user.uid),
        };
      },
    );

    this.eventEmitter.emit(
      'transaction.created',
      new TransactionCreatedEvent({
        transactionId: createTransactionResult.transactionId,
        users: createTransactionResult.users,
        context: this.cls.get(),
      }),
    );
  }
}
