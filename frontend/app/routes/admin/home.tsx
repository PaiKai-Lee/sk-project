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
import { EditUserSheet } from '~/components/admin/edit-user-sheet';
import { useTranslation } from 'react-i18next';

export type User = {
  id: string;
  uid: string;
  name: string;
  balance: number;
  role: {
    id: number;
    name: string;
  };
  department: {
    id: number;
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
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
    mutationFn: (value: { uid: string; version: number, isDisable: boolean }) => {
      const switchFunc = value.isDisable
        ? UserClient.enableUser
        : UserClient.disableUser;
      return switchFunc(value.uid, value.version);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      toast.success(t('admin.switchSuccess'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('admin.switchFailed'));
    },
  });

  function handleConfirm() {
    userSwitchMutation.mutate({
      uid: selectedUser?.uid || '',
      version: selectedUser?.version || 0,
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
              className="cursor-pointer"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              {t('admin.uid')}
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
              className="cursor-pointer"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              {t('admin.name')}
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
              className="cursor-pointer"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              {t('admin.balance')}
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
              className="cursor-pointer"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              {t('admin.department')}
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
        header: () => t('admin.role'),
        accessorKey: 'role.name',
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.role.name}</Badge>
        ),
      },
      {
        id: 'isInit',
        header: () => t('admin.initStatus'),
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
        header: () => t('admin.disableStatus'),
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
        filterFn:'disableStatusFilter',
      },
      {
        id: 'action',
        cell: ({ row }) => (
          <Button
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            variant="outline"
            onClick={(value) => {
              setSelectedUser(row.original);
              setIsEditOpen(true);
            }}
          >
            {t('admin.edit')}
          </Button>
        ),
      },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <CreateUserSheet />
      <EditUserSheet
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        selectedUser={selectedUser}
      />
      <DataTable columns={columns} data={userQuery?.data || []} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('admin.areYouAbsolutelySure')}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.thisActionWillDisable', {
                uid: selectedUser?.uid,
                name: selectedUser?.name,
              })}
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
