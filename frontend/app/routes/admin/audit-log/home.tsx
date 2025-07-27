import type { Route } from '../audit-log/+types/home';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Loader } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ServerDataTable } from '~/components/admin/audit-log-server-data-table';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/typography';
import AuditLogClient from '~/api/audit-logs';
import useDebounce from '~/hooks/use-debounce';
import DateFormatter from '~/lib/date-formatter';
import { Input } from '~/components/ui/input';
import { DataTablePagination } from '~/components/transaction-records/data-table-pagination';
import { toast } from 'sonner';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'admin audit-log' },
    { name: 'description', content: 'admin audit-log page' },
  ];
}

type AuditLogs = {
  uid: string;
  action: string;
  content: string;
  ip: string;
  meta: string;
  userAgent: string;
  createdAt: string;
};

export default function auditLogPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debounceFilters = useDebounce(
    columnFilters,
    1000
  ) as ColumnFiltersState;

  const columns = useMemo<ColumnDef<AuditLogs>[]>(
    () => [
      {
        accessorKey: 'uid',
        header: () => {
          return <Text className="font-semibold">{t('admin.uid')}</Text>;
        },
        cell: ({ row }) => <Text>{row.original.uid}</Text>,
      },
      {
        accessorKey: 'action',
        header: () => (
          <Text className="font-semibold">{t('admin.auditLog.action')}</Text>
        ),
        cell: ({ row }) => {
          return <Text>{row.original.action}</Text>;
        },
      },
      {
        accessorKey: 'content',
        header: () => (
          <Text className="font-semibold">{t('admin.auditLog.content')}</Text>
        ),
        cell: ({ row }) => <Text>{row.original.content}</Text>,
      },
      {
        accessorKey: 'ip',
        header: () => (
          <Text className="font-semibold">{t('admin.auditLog.ip')}</Text>
        ),
        cell: ({ row }) => <Text>{row.original.ip}</Text>,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            className="cursor-pointer font-semibold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('admin.auditLog.createdAt')}
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <Text>{DateFormatter.format(new Date(row.original.createdAt))}</Text>
        ),
      },
    ],
    []
  );

  const auditLogQuery = useQuery({
    queryKey: [
      'auditLog',
      {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sorting: JSON.stringify(sorting),
        filters: JSON.stringify(debounceFilters),
      },
    ],
    queryFn: async () => {
      const apiParams = new URLSearchParams();
      apiParams.append('page', (pagination.pageIndex + 1).toString());
      apiParams.append('pageSize', pagination.pageSize.toString());
      if (sorting.length > 0) {
        sorting.forEach((item) => {
          apiParams.append('sort', `${item.id}:${item.desc ? 'desc' : 'asc'}`);
        });
      }
      if (debounceFilters.length > 0) {
        debounceFilters.forEach((item) => {
          if (item.id === 'uid') {
            apiParams.append('uid', `${item.value}`);
          }
        });
      }
      const { data } = await AuditLogClient.getAuditLogs({ params: apiParams });
      return data;
    },
    select: (data) => data.data,
  });

  const table = useReactTable({
    data: auditLogQuery?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters, pagination, sorting },
    rowCount: auditLogQuery?.data?.pagination.total ?? 0,
  });

  if (auditLogQuery.isError) {
    toast.error(auditLogQuery.error.message);
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Input
          placeholder={`${t('admin.auditLog.filterByUid')}…`}
          value={(table.getColumn('uid')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table?.getColumn('uid')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        {auditLogQuery.isFetching && <Loader className="animate-spin" />}
      </div>
      <ServerDataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}
