import {
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query';
import { UserClient } from './api';
import { type SortingState } from '@tanstack/react-table';

export const userQueryKeys = {
  all: ['users'],
  getUsers: (params?: any) => [...userQueryKeys.all, 'list', params],
  getOneUser: (id: string) => [...userQueryKeys.all, 'detail', id],
} as const;

type GetUsersParams = {
  showDisable?: boolean;
  fields?: string[];
  sorting?: SortingState;
};

export function getUsersQueryOptions(params?: GetUsersParams) {
  return queryOptions({
    queryKey: userQueryKeys.getUsers(params),
    queryFn: async () => {
      if (!params) return await UserClient.getUsers();
      const searchParams = new URLSearchParams();
      if (params.showDisable !== undefined)
        searchParams.append('showDisable', params.showDisable.toString());
      if (params.fields) {
        params.fields.forEach((field) => {
          searchParams.append('fields', field);
        });
      }
      if (params.sorting) {
        params.sorting.forEach((item) => {
          searchParams.append(
            'sort',
            `${item.id}:${item.desc ? 'desc' : 'asc'}`
          );
        });
      }
      return await UserClient.getUsers({
        params: searchParams,
      });
    },
    select: (result) => result.data.data,
  });
}

export function useUserCreateMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: {
      uid: string;
      name?: string;
      roleId: number;
      departmentId: number;
    }) => {
      return UserClient.createUser(value);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.();
    },
  });
}

export function useUserEditMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: {
      uid: string;
      name: string;
      roleId: number;
      departmentId: number;
      version: number;
    }) => {
      return UserClient.editUser(value.uid, {
        name: value.name,
        roleId: value.roleId,
        departmentId: value.departmentId,
        version: value.version,
      });
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.();
    },
  });
}

export function useUserStatusSwitchMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: {
      uid: string;
      version: number;
      isDisable: boolean;
    }) => {
      console.log(value);
      const switchFunc = value.isDisable
        ? UserClient.enableUser
        : UserClient.disableUser;
      return switchFunc(value.uid, value.version);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.();
    },
  });
}
