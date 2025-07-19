import httpClient from '~/lib/http-client';
import type { AxiosRequestConfig } from 'axios';
import type {
  IApiResponse,
  IOneTransactionResponse,
  ITransactionsResponse,
} from './types';

class TransactionsClient {
  static async getTransactions(
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<ITransactionsResponse>> {
    return httpClient.get('/transactions', options);
  }

  static async getOneTransaction(
    trxId: string,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IOneTransactionResponse>> {
    return httpClient.get(`/transactions/${trxId}`, options);
  }

  static async createTransaction(options?: AxiosRequestConfig) {
    return httpClient.post('/transactions', options);
  }
}

export default TransactionsClient;
