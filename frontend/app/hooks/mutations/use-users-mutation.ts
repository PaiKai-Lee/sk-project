import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserClient, userQueryKeys } from '~/features/users';

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
