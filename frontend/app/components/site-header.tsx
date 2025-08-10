import { useLocation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { routeItems } from './app-sidebar';
import { useAuth } from '~/context/auth';
import { Heading1, Text } from '~/components/ui/typography';
import { Bell, CircleUser } from 'lucide-react';
import { GitHubIcon } from './ui/icons';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "~/components/ui/card"
import { ScrollArea } from "~/components/ui/scroll-area"
import { cn } from '~/lib/utils';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotificationClient from '~/api/notifications';
import { Fragment, useState } from 'react';
import DateFormatter from '~/lib/date-formatter';
import type { IApiResponse, IUserNotificationsResponse } from '~/api/types';
import type { AxiosError } from 'axios';

export function NotificationPopover() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const queryClient = useQueryClient();
  const userNotificationQuery = useInfiniteQuery<
    IUserNotificationsResponse,
    AxiosError
  >({
    queryKey: ['user-notifications', filter],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append('limit', '5'); // Set a default limit for pagination
      if (pageParam) {
        params.append('cursor', String(pageParam));
      }

      if (filter === 'unread') {
        params.append('isRead', 'false');
      }
      const { data } = await NotificationClient.getUserNotifications({ params });
      return data.data;
    },
    getNextPageParam: (lastPage) => lastPage.cursorPagination.nextCursor,
    initialPageParam: undefined,
    
  });

  const { data: unReadCount } = useQuery({
    queryKey: ['user-notifications-unread-count'],
    queryFn: async () => {
      const { data } = await NotificationClient.getUnreadNotificationsCount();
      return data.data;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationClient.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-notifications-unread-count'],
      });
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open && unReadCount && unReadCount > 0) {
      markAllAsReadMutation.mutate();
    }
    setOpen(open);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className='cursor-pointer'>
          <Bell
            className={cn(
              unReadCount && unReadCount > 0 ? 'size-6 animate-bounce text-destructive' : 'size-5'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Card className="w-full max-w-xs border-none sm:max-w-sm md:max-w-lg lg:max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('title.notification')}
            </CardTitle>
            <CardDescription>
              {t('notification.showLast30Days')}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
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
                        <div
                          key={userNotification.id}
                          className="flex flex-col gap-1 border-b p-3 hover:bg-muted transition-colors"
                        >
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
                  className="w-full"
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

export function SiteHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const routeItem = routeItems.find((item) => item.url === location.pathname);
  const title = routeItem?.title;
  const auth = useAuth();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Heading1 className="text-lg">{t(`title.${title}`)}</Heading1>
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <NotificationPopover />
          <div className="flex items-center gap-1">
            <CircleUser className="size-5" />
            <Text><strong>{auth.profile?.uid}</strong> / {auth.profile?.name}</Text>
          </div>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <div className="flex items-center gap-1">
              <GitHubIcon className="size-5" />
              <a
                href="https://github.com/PaiKai-Lee/sk-project"
                rel="noopener noreferrer"
                target="_blank"
                className="dark:text-foreground"
              >
                GitHub
              </a>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}