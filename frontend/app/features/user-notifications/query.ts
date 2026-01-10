import {
  queryOptions,
  infiniteQueryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { UserNotificationClient } from './api';

export const userNotificationQueryKeys = {
  all: ['user-notifications'] as const,
  getUserNotifications: (params?: any) =>
    [...userNotificationQueryKeys.all, params] as const,
  getUnreadNotificationsCount: (params?: any) =>
    [
      ...userNotificationQueryKeys.all,
      'user-notifications-unread-count',
      params,
    ] as const,
};

export function getUserNotificationsOptions() {
  return infiniteQueryOptions({
    queryKey: userNotificationQueryKeys.getUserNotifications(),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append('limit', '5'); // Set a default limit for pagination
      if (pageParam) {
        params.append('cursor', String(pageParam));
      }

      const { data } = await UserNotificationClient.getUserNotifications({
        params,
      });
      return data.data;
    },
    initialPageParam: undefined as string | number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.cursorPagination.nextCursor ?? undefined,
  });
}

export function getUnreadNotificationsCountOptions() {
  return queryOptions({
    queryKey: userNotificationQueryKeys.getUnreadNotificationsCount(),
    queryFn: () => UserNotificationClient.getUnreadNotificationsCount(),
    select: (result) => result.data.data,
  });
}

export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => UserNotificationClient.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userNotificationQueryKeys.getUnreadNotificationsCount(),
      });
    },
  });
}
