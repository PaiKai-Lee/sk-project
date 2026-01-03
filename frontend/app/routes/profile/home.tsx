import type { Route } from '../profile/+types/home';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/typography';
import { type IBalanceLog } from '~/features/me';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table';
import { ServerDataTable } from '~/components/me/balance-logs/data-table';
import { DataTablePagination } from '~/components/me/balance-logs/data-table-pagination';
import { DateFormatter } from '~/lib/time-formatter';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { useBalanceLogsQuery, useMeQuery } from '~/hooks/queries/use-me-query';

export function meta({}: Route.MetaArgs) {
  const { t } = useTranslation();
  return [
    { title: t('profile.profile') },
    { name: 'description', content: t('profile.description') },
  ];
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const meQuery = useMeQuery();
  const balanceLogsQuery = useBalanceLogsQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  });

  const columns = useMemo<ColumnDef<IBalanceLog>[]>(
    () => [
      {
        accessorKey: 'value',
        header: () => t('profile.balanceChanged'),
      },
      {
        accessorKey: 'currentBalance',
        header: () => t('profile.currentBalance'),
      },
      {
        accessorKey: 'createdAt',
        header: () => t('profile.createdAt'),
        cell: (info) =>
          DateFormatter.format(new Date(info.getValue() as string)),
      },
    ],
    []
  );

  const table = useReactTable({
    data: balanceLogsQuery.data?.balanceLogs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    rowCount: balanceLogsQuery.data?.pagination.total,
  });

  if (meQuery.isLoading || !meQuery.data) {
    return <p>loading ....</p>;
  }

  return (
    <div className="space-y-4">
      <Card className="border-none overflow-hidden max-w-fit">
        <CardContent className="p-6 flex items-center space-x-6 h-20">
          <div className="flex items-center space-x-4">
            <div className="space-y-0.5">
              <Text className="font-bold text-lg">{meQuery.data?.name}</Text>
              <Text className="text-sm text-muted-foreground">
                {t('profile.uid')}: {meQuery.data.uid}
              </Text>
            </div>
          </div>
          <Separator orientation="vertical" className="bg-slate-100" />

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              {t('profile.role')}:
            </span>
            <Badge className="bg-primary hover:bg-primary/90 rounded-full px-4 py-1">
              {meQuery.data.role.name}
            </Badge>
          </div>

          <Separator orientation="vertical" className="bg-slate-100" />

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              {t('profile.department')}:
            </span>
            <Badge variant="secondary" className="rounded-full px-4 py-1">
              {meQuery.data.department.name}
            </Badge>
          </div>

          <Separator orientation="vertical" className="bg-slate-100" />

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              {t('profile.balance')}:
            </span>
            <Text className="text-xl font-bold">
              {
                new Intl.NumberFormat('zh-TW', {
                  style: 'currency',
                  currency: 'TWD',
                })
                  .format(meQuery.data.balance)
                  .split('.')[0]
              }
            </Text>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.balanceLogs')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ServerDataTable table={table} />
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
