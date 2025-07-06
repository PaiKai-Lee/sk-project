import { Injectable } from '@nestjs/common';
import { TransactionService } from 'src/transaction';
import { UserService } from 'src/user';

@Injectable()
export class OverviewService {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async getOverview() {
    // TODO: cron job 處理部份總攬資料
    this.userService.getUsers({ fields: ['balance'] });
    const results = await Promise.all([
      this.userService.getUsers({ fields: ['balance'] }),
      this.transactionService.getTransactions({
        sort: ['createdAt:desc'],
        includeItems: false,
        page: 1,
        pageSize: 5,
      }),
    ]);
    const [users, transactions] = results;
    // get Total Balance
    const totalBalance = users.reduce((acc, user) => acc + user.balance, 0);
    // get Overdraw Users
    const overdrawUsers = users.filter((user) => user.balance < 0);
    // get Recent Transactions
    const recentTransactions = transactions.rows;
    return {
      totalBalance,
      overdrawUsers,
      recentTransactions,
    };
  }
}
