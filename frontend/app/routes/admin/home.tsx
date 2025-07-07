import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Route } from '../admin/+types/home';
import UserClient from '~/api/users';
import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { Button } from '~/components/ui/button';
import { ArrowUpDown, Circle, Loader } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Switch } from '~/components/ui/switch';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Text } from '~/components/ui/typography';

import { DataTable } from '~/components/admin/data-table';
import { CreateUserSheet } from '~/components/admin/create-user-sheet';

export type User = {
  id: string;
  uid: string;
  name: string;
  balance: number;
  role: {
    name: string;
  };
  department: {
    name: string;
  };
  isInit: boolean;
  isDisable: boolean;
  version: number;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'admin' }, { name: 'description', content: 'admin page' }];
}

export default function AdminPage() {
  const queryClient = useQueryClient();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const selectedFields = useMemo(
    () => ['balance', 'department', 'role', 'isInit', 'isDisable', 'version'],
    []
  );
  const userQuery = useQuery({
    queryKey: ['users', { showDisable: true, fields: selectedFields }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('showDisable', 'true');
      selectedFields.forEach((field) => {
        params.append('fields', field);
      });
      const { data } = await UserClient.getUsers({
        params,
      });
      return data;
    },
    select: (data) => data.data as User[],
  });

  const userSwitchMutation = useMutation({
    mutationFn: (value: { uid: string; isDisable: boolean }) => {
      const switchFunc = value.isDisable
        ? UserClient.enableUser
        : UserClient.disableUser;
      return switchFunc(value.uid);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      toast.success('切換成功');
    },
    onError: (error) => {
      console.error(error);
      toast.error('切換失敗');
    },
  });

  function handleConfirm() {
    userSwitchMutation.mutate({
      uid: selectedUser?.uid || '',
      isDisable: selectedUser?.isDisable || false,
    });
  }

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        id: 'uid',
        accessorKey: 'uid',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Uid
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          );
        },
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Name
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          );
        },
      },
      {
        id: 'balance',
        accessorKey: 'balance',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Balance
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          if (row.original.balance < 0) {
            return <Text className="text-red-500">{row.original.balance}</Text>;
          } else {
            return <Text>{row.original.balance}</Text>;
          }
        },
      },
      {
        id: 'department',
        accessorKey: 'department.name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Department
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.department.name}</Badge>
        ),
      },
      {
        id: 'role',
        header: 'Role',
        accessorKey: 'role.name',
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.role.name}</Badge>
        ),
      },
      {
        id: 'isInit',
        header: 'Init Status',
        accessorKey: 'isInit',
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.isInit === true ? (
              <Circle className="fill-green-500 dark:fill-green-400" />
            ) : (
              <Loader />
            )}
            {row.original.isInit === true ? 'Yes' : 'No'}
          </Badge>
        ),
      },
      {
        id: 'isDisable',
        header: 'Disable Status',
        accessorKey: 'isDisable',
        cell: ({ row }) => (
          <Switch
            className="data-[state=checked]:bg-destructive"
            checked={row.original.isDisable}
            onCheckedChange={(value) => {
              setSelectedUser(row.original);
              setIsAlertOpen(true);
            }}
          />
        ),
      },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <CreateUserSheet />
      <DataTable columns={columns} data={userQuery?.data || []} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will disable uid “{selectedUser?.uid}” , name “
              {selectedUser?.name}”
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
