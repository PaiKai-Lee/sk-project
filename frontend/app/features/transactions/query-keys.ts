const FEATURE_NAME = 'transactions';

export const transactionQueryKeys = {
  all: [FEATURE_NAME] as const,
  getTransactions: (params?: any) => [FEATURE_NAME, 'list', params] as const,
  getOneTransaction: (id: string) => [FEATURE_NAME, 'detail', id] as const,
};
