import type { IApiResponse, Pagination } from '~/features/types';

export interface ITransactionItem {
  id: string;
  user: {
    uid: string;
    name: string;
  };
  value: number;
  details: string;
  createdAt: string;
}

export interface IOneTransaction {
  transactionId: string;
  remark: string;
  createdByUser: {
    uid: string;
    name: string;
  };
  createdAt: string;
  transactionsItems?: ITransactionItem[];
}

export interface ITransactions {
  pagination: Pagination;
  rows: IOneTransaction[];
}

export interface IOneTransactionResponse
  extends IApiResponse<IOneTransaction> {}
export interface ITransactionsResponse extends IApiResponse<ITransactions> {}
