import type { Route } from '../overview/+types/home';
import { Card, CardContent, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Text } from '~/components/ui/typography';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { OverviewClient, overviewQueryKeys } from '~/features/overview';
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'overview' },
    { name: 'description', content: 'overview page' },
  ];
}

export default function OverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const overviewQuery = useQuery({
    queryKey: overviewQueryKeys.getOverview(),
    queryFn: () => OverviewClient.getOverview(),
    select: (rowData) => rowData?.data?.data,
    staleTime: 60 * 1000 * 5,
  });

  function handleTransactionClick(transactionId: string) {
    navigate(`/transaction-records`, {
      state: {
        transactionId,
      },
    });
  }

  return (
    <>
      <Card className="px-4">
        <CardTitle>{t('overview.totalBalance')}</CardTitle>
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
      <Card className="col-span-3 px-4">
        <CardTitle>Maybe Announcements...</CardTitle>
      </Card>
      <Card className="col-span-2 px-4 max-h-[400px]">
        <CardTitle>{t('overview.recentTransactions')}</CardTitle>
        {overviewQuery.isLoading && <Loader2Icon className="animate-spin" />}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                {t('overview.transactionId')}
              </TableHead>
              <TableHead>{t('overview.remark')}</TableHead>
              <TableHead>{t('overview.createdBy')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overviewQuery?.data &&
              overviewQuery.data.recentTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell
                    onClick={() =>
                      handleTransactionClick(transaction.transactionId)
                    }
                  >
                    <Button variant="link" className="p-0 cursor-pointer">
                      {transaction.transactionId}
                    </Button>
                  </TableCell>
                  <TableCell>{transaction.remark}</TableCell>
                  <TableCell>
                    <Text>{transaction.createdByUser.name}</Text>
                    <Text className="text-xs font-light">
                      {transaction.createdByUser.uid}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
      <Card className="col-span-2 px-4 max-h-[400px]">
        <CardTitle>{t('overview.overdrawUsers')}</CardTitle>
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
                <TableRow key={user.uid} className="bg-red-100 dark:bg-red-900">
                  <TableCell className="w-[100px]">
                    <Text>{user.name}</Text>
                    <Text className="text-xs font-light">{user.uid}</Text>
                  </TableCell>
                  <TableCell>{user.balance}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
