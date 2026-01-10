import type { Route } from '../transaction-records/+types/home';
import { useEffect, useMemo, useState } from 'react';
import { ServerDataTable } from '~/components/transaction-records/data-table';
import { DataTablePagination } from '~/components/transaction-records/data-table-pagination';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useDebounce } from '~/hooks';
import { Input } from '~/components/ui/input';
import { DateFormatter } from '~/lib/time-formatter';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/typography';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SpecificTransactionDialog } from '~/components/transaction-records/specificTransaction-dialog';
import { useQuery } from '@tanstack/react-query';
import {
  getTransactionsDetailOptions,
  getTransactionsListOptions,
} from '~/features/transactions/query';

export function meta({}: Route.MetaArgs) {
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    userName: false,
  });
  const debounceFilters = useDebounce(
    columnFilters,
    1000
  ) as ColumnFiltersState;

  const transactionDetailQuery = useQuery(
    getTransactionsDetailOptions(transactionId as string)
  );
  const transactionListQuery = useQuery(
    getTransactionsListOptions({
      pagination,
      sorting,
      filters: debounceFilters,
    })
  );

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
        id: 'userName',
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
    data: transactionListQuery?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnFilters, pagination, sorting, columnVisibility },
    rowCount: transactionListQuery?.data?.pagination.total,
  });

  if (transactionListQuery.isError) {
    toast.error(transactionListQuery.error.message);
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Input
          placeholder={`${t('transaction.filterByCreatorName')}…`}
          value={
            (table.getColumn('createdBy')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table?.getColumn('createdBy')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder={`${t('transaction.filterByParticipantName')}…`}
          value={
            (table.getColumn('userName')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table.getColumn('userName')?.setFilterValue(e.target.value)
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
        {transactionListQuery.isFetching && <Loader className="animate-spin" />}
      </div>
      {transactionListQuery.isSuccess && <ServerDataTable table={table} />}
      <DataTablePagination table={table} />
      <SpecificTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        specificTransactionData={transactionDetailQuery.data}
      />
    </>
  );
}
