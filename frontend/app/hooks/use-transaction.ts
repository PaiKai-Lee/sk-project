import { TransactionProviderContext } from '../context/transaction';
import { useContext } from 'react';

export const useTransaction = () => {
  const context = useContext(TransactionProviderContext);

  if (context === undefined) {
    throw new Error(
      'useTransaction must be used within an TransactionProvider'
    );
  }

  return context;
};
