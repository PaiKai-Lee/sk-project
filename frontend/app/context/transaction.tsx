import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
type TransactionProviderProps = {
  children: React.ReactNode;
};

type TransactionItems = {
  name: string;
  uid: string;
  balance: number;
  deposit: number;
  depositDetails: string;
  withdraw: number;
  withdrawDetails: string;
};

type TransactionCart = {
  uid: string;
  name: string;
  value: number;
  details: string;
};

type TransactionProviderState = {
  transactionItems: TransactionItems[];
  setTransactionItems: (transactionItems: TransactionItems[]) => void;
  updateTransactionItems: (
    uid: string,
    type: string,
    value: number | string
  ) => void;
  cart: TransactionCart[];
  totalDeposit: number;
  totalWithdraw: number;
};

const TransactionProviderContext = createContext<
  TransactionProviderState | undefined
>(undefined);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactionItems, setTransactionItems] = useState<TransactionItems[]>(
    []
  );
  const cart = useMemo(() => {
    const result: TransactionCart[] = [];

    transactionItems.forEach((item) => {
      if (item.deposit > 0) {
        result.push({
          uid: item.uid,
          name: item.name,
          value: item.deposit,
          details: item.depositDetails,
        });
      }

      if (item.withdraw > 0) {
        result.push({
          uid: item.uid,
          name: item.name,
          value: 0 - item.withdraw,
          details: item.withdrawDetails,
        });
      }
    });

    return result;
  }, [transactionItems]);

  const totalDeposit = useMemo(() => {
    return transactionItems.reduce((total, item) => {
      return total + item.deposit;
    }, 0);
  }, [transactionItems]);

  const totalWithdraw = useMemo(() => {
    return transactionItems.reduce((total, item) => {
      return total + item.withdraw;
    }, 0);
  }, [transactionItems]);

  const updateTransactionItems = useCallback(
    (uid: string, type: string, value: number | string) => {
      setTransactionItems((prev) => {
        return prev.map((item) => {
          if (item.uid === uid) {
            return {
              ...item,
              [type]: value,
            };
          }
          return item;
        });
      });
    },
    []
  );

  return (
    <TransactionProviderContext.Provider
      value={{
        transactionItems,
        setTransactionItems,
        updateTransactionItems,
        cart,
        totalDeposit,
        totalWithdraw,
      }}
    >
      {children}
    </TransactionProviderContext.Provider>
  );
}

export const useTransaction = () => {
  const context = useContext(TransactionProviderContext);

  if (context === undefined) {
    throw new Error(
      'useTransaction must be used within an TransactionProvider'
    );
  }

  return context;
};
