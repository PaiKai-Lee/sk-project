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
import OverviewClient from '~/api/overview';
import { Loader2Icon } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'overview' },
    { name: 'description', content: 'overview page' },
  ];
}

export default function OverviewPage() {
  const overviewQuery = useQuery({
    queryKey: ['overview'],
    queryFn: () => OverviewClient.getOverview(),
    select: (rowData) => rowData?.data?.data,
    staleTime: 60 * 1000 * 5,
  });

  return (
    <>
      <Card className="px-4">
        <CardTitle>Total Balance</CardTitle>
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
        <CardTitle>Recent Transactions</CardTitle>
        {overviewQuery.isLoading && <Loader2Icon className="animate-spin" />}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Transaction ID</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead>CreatedBy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overviewQuery?.data &&
              overviewQuery.data.recentTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>{transaction.transactionId}</TableCell>
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
        <CardTitle>Overdraw Users</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Balance</TableHead>
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
