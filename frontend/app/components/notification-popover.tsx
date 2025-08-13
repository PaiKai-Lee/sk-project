import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '~/components/ui/card';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Fragment, useState } from 'react';
import DateFormatter from '~/lib/date-formatter';
import { UserNotificationClient } from '~/features/user-notifications';
import type {
  IUserNotification,
  IUserNotificationsResponse,
} from '~/features/user-notifications';
import { userNotificationQueryKeys } from '~/features/user-notifications';
import type { AxiosError } from 'axios';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Text } from './ui/typography';

export function NotificationPopover() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const userNotificationQuery = useInfiniteQuery<
    IUserNotificationsResponse['data']['data'],
    AxiosError
  >({
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
    getNextPageParam: (lastPage) => lastPage.cursorPagination.nextCursor,
    initialPageParam: undefined,
  });

  const { data: unReadCount } = useQuery({
    queryKey: userNotificationQueryKeys.getUnreadNotificationsCount(),
    queryFn: async () => {
      const { data } =
        await UserNotificationClient.getUnreadNotificationsCount();
      return data.data;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => UserNotificationClient.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userNotificationQueryKeys.getUnreadNotificationsCount(),
      });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      queryClient.invalidateQueries({
        queryKey: userNotificationQueryKeys.getUserNotifications(),
      });
    }
    if (open && unReadCount && unReadCount > 0) {
      markAllAsReadMutation.mutate();
    }
    setOpen(open);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Bell
            className={cn(
              unReadCount && unReadCount > 0
                ? 'size-6 animate-bounce text-destructive'
                : 'size-5'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Card className="w-full max-w-xs border-none sm:max-w-sm md:max-w-lg lg:max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              {t('title.notification')}
            </CardTitle>
            <CardDescription>
              {t('notification.showLast30Days')}
            </CardDescription>
          </CardHeader>
          <CardContent className="inset-shadow-xs inset-shadow-stone-400 insert-shadow- w-full p-0">
            <ScrollArea className="h-96">
              {userNotificationQuery.isLoading && (
                <div className="flex h-full items-center justify-center">
                  <Text>Loading...</Text>
                </div>
              )}

              {userNotificationQuery.data &&
                userNotificationQuery.data.pages[0].rows.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center p-4 text-muted-foreground">
                    <Bell className="h-10 w-10" />
                    <Text className="mt-2">
                      {t('notification.noNotifications')}
                    </Text>
                  </div>
                )}

              {userNotificationQuery.data &&
                userNotificationQuery.data.pages.map((page, idx) => (
                  <Fragment key={idx}>
                    {page.rows.length > 0 ? (
                      page.rows.map((userNotification) => (
                        <UserNotificationItem
                          key={userNotification.id}
                          userNotification={userNotification}
                        />
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
                        <Text>{t('notification.noNotifications')}</Text>
                      </div>
                    )}
                  </Fragment>
                ))}
              {userNotificationQuery.hasNextPage && (
                <Button
                  className="w-full cursor-pointer"
                  variant="link"
                  onClick={() => userNotificationQuery.fetchNextPage()}
                  disabled={
                    !userNotificationQuery.hasNextPage ||
                    userNotificationQuery.isFetchingNextPage
                  }
                >
                  {userNotificationQuery.isFetchingNextPage
                    ? t('notification.loadingMore')
                    : t('notification.loadMore')}
                </Button>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

function UserNotificationItem({
  userNotification,
}: {
  userNotification: IUserNotification;
}) {
  return (
    <div className="flex flex-col gap-1 border-b p-3 hover:bg-muted transition-colors">
      <div className="flex items-center gap-2">
        <Text className="text-sm font-semibold">
          {userNotification.notification.title}
        </Text>
      </div>
      <Text className="pl-4 text-sm text-muted-foreground">
        {userNotification.notification.content}
      </Text>
      <Text className="self-end text-xs text-muted-foreground">
        {DateFormatter.format(new Date(userNotification.createdAt))}
      </Text>
    </div>
  );
}
