import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationClient } from './api';
import { toast } from 'sonner';
import { t } from 'i18next';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  getNotifications: (params?: any) =>
    [...notificationQueryKeys.all, params] as const,
};

export function useCreateNotificationMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      targets: string[];
    }) => {
      return NotificationClient.createNotification(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
      toast.success(t('notification.createSuccess'));
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('notification.createFailed'));
      onError?.();
    },
  });
}
