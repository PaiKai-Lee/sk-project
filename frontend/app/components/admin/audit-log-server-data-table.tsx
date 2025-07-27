import type { Table as TanStackTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { cn } from '~/lib/utils';

interface ServerDataTableProps<TData> {
  table: TanStackTable<TData>;
}

export function ServerDataTable<TData>({ table }: ServerDataTableProps<TData>) {
  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className={cn(
                    h.id === 'uid' && 'w-30',
                    h.id === 'action' && 'w-50',
                    h.id === 'ip' && 'w-50',
                    h.id === 'createdAt' && 'w-40'
                  )}
                >
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? 'selected' : ''}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    'truncate',
                    cell.column.id !== 'content' && 'select-all',
                    cell.column.id === 'uid' && 'max-w-30',
                    cell.column.id === 'action' && 'max-w-50',
                    cell.column.id === 'ip' && 'max-w-50',
                    cell.column.id === 'createdAt' && 'max-w-40'
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
