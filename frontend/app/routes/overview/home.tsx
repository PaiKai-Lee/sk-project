import type { Route } from '../overview/+types/home';
import { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { SpecificTransactionDialog } from '~/components/transaction-records/specificTransaction-dialog';
import { Text } from '~/components/ui/typography';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { OverviewClient, overviewQueryKeys } from '~/features/overview';
import {
  transactionQueryKeys,
  TransactionsClient,
} from '~/features/transactions';
import { Link } from 'react-router';
import { RelativeTimeFormatter } from '~/lib/time-formatter';
export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'overview' },
    { name: 'description', content: 'overview page' },
  ];
}

export default function OverviewPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const specificTransactionQuery = useQuery({
    queryKey: transactionQueryKeys.getOneTransaction(transactionId as string),
    enabled: !!transactionId,
    queryFn: async () => {
      const { data } = await TransactionsClient.getOneTransaction(
        transactionId as string
      );
      return data;
    },
    select: (data) => data.data,
  });

  const overviewQuery = useQuery({
    queryKey: overviewQueryKeys.getOverview(),
    queryFn: () => OverviewClient.getOverview(),
    select: (rowData) => rowData?.data?.data,
    staleTime: 60 * 1000 * 5,
  });

  function handleTransactionClick(transactionId: string) {
    setIsDialogOpen(true);
    setTransactionId(transactionId);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('overview.totalBalance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-2xl font-bold">
            {overviewQuery?.data &&
              new Intl.NumberFormat('zh-TW', {
                style: 'currency',
                currency: 'TWD',
              })
                .format(overviewQuery.data.totalBalance)
                .split('.')[0]}
          </Text>
        </CardContent>
      </Card>
      <Card className="md:col-span-3 md:row-start-2 col-span-full">
        <CardHeader>
          <CardTitle>{t('overview.recentTransactions')}</CardTitle>
          <CardAction>
            <Button size={'sm'} variant="link" asChild>
              <Link to="/transaction-records">{t('overview.viewAll')}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-auto">
          {overviewQuery.isLoading && <Loader2Icon className="animate-spin" />}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('overview.transactionId')}</TableHead>
                <TableHead>{t('overview.remark')}</TableHead>
                <TableHead>{t('overview.createdAt')}</TableHead>
                <TableHead>{t('overview.createdBy')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overviewQuery?.data &&
                overviewQuery.data.recentTransactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell
                      className='w-1/5'
                      onClick={() =>
                        handleTransactionClick(transaction.transactionId)
                      }
                    >
                      <Button variant="link" className="p-0 cursor-pointer">
                        {transaction.transactionId}
                      </Button>
                    </TableCell>
                    <TableCell className='w-2/5'>{transaction.remark}</TableCell>
                    <TableCell className="w-1/5 max-w-[100px]">
                      {RelativeTimeFormatter.timeAgo(new Date(transaction.createdAt), currentLanguage)}
                    </TableCell>
                    <TableCell className="w-1/5 max-w-[200px]">
                      <Text>{transaction.createdByUser.name}</Text>
                      <Text className="text-xs font-light">
                        {transaction.createdByUser.uid}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="md:col-span-1 md:row-start-2 col-span-full">
        <CardHeader>
          <CardTitle>{t('overview.overdrawUsers')}</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('overview.user')}</TableHead>
                <TableHead>{t('overview.balance')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overviewQuery?.data &&
                overviewQuery.data.overdrawUsers.map((user) => (
                  <TableRow
                    key={user.uid}
                    className="bg-red-100 dark:bg-red-900"
                  >
                    <TableCell className="w-[100px]">
                      <Text>{user.name}</Text>
                      <Text className="text-xs font-light">{user.uid}</Text>
                    </TableCell>
                    <TableCell>{user.balance}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <SpecificTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        specificTransactionData={specificTransactionQuery.data}
      />
    </>
  );
}
