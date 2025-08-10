import { useEffect, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Input } from '~/components/ui/input';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { cn } from '~/lib/utils';

export type User = {
  id: string;
  uid: string;
  name: string;
  balance: number;
  role: {
    name: string;
  };
  isInit: boolean;
  isDisable: boolean;
  version: number;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showDisabled, setShowDisabled] = useState('enabled');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      disableStatusFilter: (row, columnId, filterValue) => {
        switch (filterValue) {
          case 'all':
            return true;
          case 'enabled':
            return !row.getValue(columnId);
          case 'disabled':
            return row.getValue(columnId);
          default:
            return true;
        }
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    table.getColumn('isDisable')?.setFilterValue(showDisabled);
  }, [showDisabled]);

  return (
    <>
      <div className="flex flex-col-reverse gap-2 md:flex-row">
        <Select value={showDisabled} onValueChange={setShowDisabled}>
          <SelectTrigger
            className={cn(
              'md:max-w-sm',
              showDisabled === 'enabled' && 'text-primary',
              showDisabled === 'disabled' && 'text-destructive'
            )}
          >
            <SelectValue placeholder={t('admin.filterByDisableStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">{t('admin.showEnabled')}</SelectItem>
            <SelectItem value="disabled">{t('admin.showDisabled')}</SelectItem>
            <SelectItem value="all">{t('admin.showAll')}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder={`${t('admin.filterByUid')}…`}
          value={(table.getColumn('uid')?.getFilterValue() as string) || ''}
          onChange={(event) =>
            table.getColumn('uid')?.setFilterValue(event.target.value)
          }
          className="md:max-w-sm"
        />
        <Input
          placeholder={`${t('admin.filterByName')}…`}
          value={(table.getColumn('name')?.getFilterValue() as string) || ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="md:max-w-sm"
        />
        <Input
          placeholder={`${t('admin.filterByDepartment')}…`}
          value={
            (table.getColumn('department')?.getFilterValue() as string) || ''
          }
          onChange={(event) =>
            table.getColumn('department')?.setFilterValue(event.target.value)
          }
          className="md:max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (
                  ['uid', 'department', 'role', 'isInit'].includes(header.id)
                ) {
                  return (
                    <TableHead
                      key={header.id}
                      className="w-[100px] max-w-[100px] text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                }

                return (
                  <TableHead
                    key={header.id}
                    className="max-w-[100px] text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : ''}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={'max-w-[100px] text-center'}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
