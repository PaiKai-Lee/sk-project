import { useTranslation } from 'react-i18next';
import type { IOneTransaction } from '~/features/transactions';
import { Skeleton } from '../ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Text } from '../ui/typography';
import { DateFormatter } from '~/lib/time-formatter';
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specificTransactionData?: IOneTransaction;
};

export function SpecificTransactionDialog(props: Props) {
  const { open, onOpenChange, specificTransactionData } = props;
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('transaction.transactionDetails')}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-1 lg:flex-row">
              <Text className="md:basis-1/2">
                <strong>{t('transaction.transactionId')}:</strong>{' '}
                {specificTransactionData?.transactionId}
              </Text>
              <Text className="md:basis-1/2">
                <strong>{t('transaction.remark')}:</strong>{' '}
                {specificTransactionData?.remark}
              </Text>
            </div>
          </DialogDescription>
        </DialogHeader>
        {!specificTransactionData && (
          <Skeleton className="h-[100px] w-full animate-pulse" />
        )}
        {specificTransactionData && (
          <TransactionDetails specificTransaction={specificTransactionData} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TransactionDetails({
  specificTransaction,
}: {
  specificTransaction?: IOneTransaction;
}) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-2/10">{t('transaction.user')}</TableHead>
          <TableHead className="w-1/10">{t('transaction.value')}</TableHead>
          <TableHead className="w-full">{t('transaction.details')}</TableHead>
          <TableHead className="w-2/10">{t('transaction.createdAt')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specificTransaction?.transactionsItems &&
          specificTransaction.transactionsItems.map((item) => (
            <TableRow
              key={item.id}
              className={`${item.value > 0
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
                }`}
            >
              <TableCell className="font-medium">
                <Text>{item.user.name}</Text>
                <Text className="text-xs font-light">{item.user.uid}</Text>
              </TableCell>
              <TableCell className="font-medium">{item.value}</TableCell>
              <TableCell className="font-medium">{item.details}</TableCell>
              <TableCell className="font-medium">
                {DateFormatter.format(new Date(item.createdAt))}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
