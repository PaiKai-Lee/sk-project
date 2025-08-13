const FEATURE_NAME = 'transactions';

export const transactionQueryKeys = {
  all: [FEATURE_NAME] as const,
  getTransactions: (params?: any) => [FEATURE_NAME, params] as const,
  getOneTransaction: (id: string) => [FEATURE_NAME, id] as const,
};
