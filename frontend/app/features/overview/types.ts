import type { IApiResponse } from '~/features/types';
import type { IOneTransaction } from '~/features/transactions';
import type { IUser } from '~/features/users';

export interface IOverview {
  totalBalance: number;
  overdrawUsers: Omit<IUser, 'role' | 'isInit' | 'isDisable' | 'version'>[];
  recentTransactions: IOneTransaction[];
}

export interface IOverviewResponse extends IApiResponse<IOverview> {}
