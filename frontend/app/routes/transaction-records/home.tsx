import type { Route } from '../transaction-records/+types/home';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import TransactionsClient from '~/api/transactions';
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
import DateFormatter from '~/lib/date-formatter';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Text } from '~/components/ui/typography';
import { Skeleton } from '~/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader, LoaderCircle } from 'lucide-react';
import { useLocation } from 'react-router';

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
  });

  const specificTransactionQuery = useQuery({
    queryKey: ['transactions', transactionId],
    enabled: !!transactionId,
    queryFn: async () => {
      const { data } = await TransactionsClient.getOneTransaction(
        transactionId as string
      );
      return data;
    },
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
        header: 'Transaction ID',
      },
      {
        accessorKey: 'remark',
        header: 'Remark',
      },
      {
        id: 'createdBy',
        header: 'Created By',
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
        header: 'Created At',
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
            Details
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: transactionQuery.data?.data.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters, pagination, sorting },
    rowCount: transactionQuery.data?.data.pagination.total,
  });

  if (transactionQuery.isError) {
    toast.error(transactionQuery.error.message);
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by name…"
          value={
            (table.getColumn('createdBy')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table?.getColumn('createdBy')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by transaction ID…"
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {specificTransactionQuery.isLoading && (
          <Skeleton className="h-[300px] w-full" />
        )}
        {specificTransactionQuery.isSuccess && (
          <DialogContent className="md:max-w-2xl lg:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription className="flex flex-col gap-1 lg:flex-row ">
                <Text className="md:basis-1/2">
                  <strong>Transaction ID:</strong>{' '}
                  {specificTransactionQuery.data.data?.transactionId}
                </Text>
                <Text className="md:basis-1/2">
                  <strong>Remark:</strong>{' '}
                  {specificTransactionQuery.data.data?.remark}
                </Text>
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/10">User</TableHead>
                  <TableHead className="w-1/10">Value</TableHead>
                  <TableHead className="w-full">Details</TableHead>
                  <TableHead className="w-2/10">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specificTransactionQuery.data.data?.transactionsItems.map(
                  (item) => (
                    <TableRow
                      key={item.id}
                      className={`${
                        item.value > 0
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      }`}
                    >
                      <TableCell className="font-medium">
                        <Text>{item.user.name}</Text>
                        <Text className="text-xs font-light">
                          {item.user.uid}
                        </Text>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.value}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.details}
                      </TableCell>
                      <TableCell className="font-medium">
                        {DateFormatter.format(new Date(item.createdAt))}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
