import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type { IOneTransactionResponse, ITransactionsResponse } from './types';

export class TransactionsClient {
  static getTransactions(
    options?: AxiosRequestConfig
  ): Promise<ITransactionsResponse> {
    return httpClient.get('/transactions', options);
  }

  static getOneTransaction(
    trxId: string,
    options?: AxiosRequestConfig
  ): Promise<IOneTransactionResponse> {
    return httpClient.get(`/transactions/${trxId}`, options);
  }

  static createTransaction(
    data: any,
    options?: AxiosRequestConfig
  ): Promise<IOneTransactionResponse> {
    return httpClient.post('/transactions', data, options);
  }
}
