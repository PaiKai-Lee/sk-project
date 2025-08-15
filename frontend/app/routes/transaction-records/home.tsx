import type { Route } from '../transaction-records/+types/home';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  TransactionsClient,
  transactionQueryKeys,
} from '~/features/transactions';
import { ServerDataTable } from '~/components/transaction-records/data-table';
import { DataTablePagination } from '~/components/transaction-records/data-table-pagination';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import useDebounce from '~/hooks/use-debounce';
import { Input } from '~/components/ui/input';
import { DateFormatter } from '~/lib/time-formatter';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/typography';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SpecificTransactionDialog } from '~/components/transaction-records/specificTransaction-dialog';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'transaction-records' },
    { name: 'description', content: 'transaction-records page' },
  ];
}

export type Transaction = {
  transactionId: string;
  remark: string;
  createdByUser: {
    uid: string;
    name: string;
  };
  createdAt: string;
};

export default function TransactionRecordsHome() {
  const { t } = useTranslation();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debounceFilters = useDebounce(
    columnFilters,
    1000
  ) as ColumnFiltersState;

  useEffect(() => {
    if (location.state) {
      setColumnFilters([
        {
          id: 'transactionId',
          value: location.state.transactionId,
        },
      ]);
    }
    return () => {
      setColumnFilters([]);
    };
  }, [location.state]);

  const transactionQuery = useQuery({
    queryKey: [
      'transactions',
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
          if (item.id === 'createdBy') {
            apiParams.append('userName', `${item.value}`);
          }
          if (item.id === 'transactionId') {
            apiParams.append('transactionId', `${item.value}`);
          }
        });
      }
      const { data } = await TransactionsClient.getTransactions({
        params: apiParams,
      });
      return data;
    },
    select: (data) => data.data,
  });

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

  function clickDetailHandler(e: React.MouseEvent<HTMLButtonElement>) {
    const transactionId = e.currentTarget.dataset.transactionId;
    setDialogOpen(true);
    setTransactionId(transactionId as string);
  }

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'transactionId',
        header: () => t('transaction.transactionId'),
      },
      {
        accessorKey: 'remark',
        header: () => t('transaction.remark'),
      },
      {
        id: 'createdBy',
        header: () => t('transaction.createdBy'),
        cell: (info) => (
          <>
            <Text>{info.row.original.createdByUser.name}</Text>
            <Text className="text-xs text-muted-foreground">
              {info.row.original.createdByUser.uid}
            </Text>
          </>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: () => t('transaction.createdAt'),
        cell: (info) =>
          DateFormatter.format(new Date(info.getValue() as string)),
      },
      {
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => (
          <Button
            size={'sm'}
            className="cursor-pointer"
            data-transaction-id={info.row.original.transactionId}
            onClick={clickDetailHandler}
          >
            {t('transaction.details')}
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: transactionQuery?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters, pagination, sorting },
    rowCount: transactionQuery?.data?.pagination.total,
  });

  if (transactionQuery.isError) {
    toast.error(transactionQuery.error.message);
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Input
          placeholder={`${t('transaction.filterByName')}…`}
          value={
            (table.getColumn('createdBy')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table?.getColumn('createdBy')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder={`${t('transaction.filterByTransactionId')}…`}
          className="max-w-sm"
          value={
            (table.getColumn('transactionId')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table?.getColumn('transactionId')?.setFilterValue(e.target.value)
          }
        />
        {transactionQuery.isFetching && <Loader className="animate-spin" />}
      </div>
      {transactionQuery.isSuccess && <ServerDataTable table={table} />}
      <DataTablePagination table={table} />
      <SpecificTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        specificTransactionData={specificTransactionQuery.data}
      />
    </>
  );
}
