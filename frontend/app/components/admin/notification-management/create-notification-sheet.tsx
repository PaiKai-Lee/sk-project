import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '~/components/ui/checkbox';
import {
  NotificationClient,
  notificationQueryKeys,
} from '~/features/notifications';
import { UserClient, userQueryKeys } from '~/features/users';
import type { IUser } from '~/features/users';

export function CreateNotificationSheet() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm();

  const usersQuery = useQuery({
    queryKey: userQueryKeys.getUsers(),
    queryFn: async () => {
      const { data } = await UserClient.getUsers();
      return data.data;
    },
  });

  const createMutation = useMutation({
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
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('notification.createFailed'));
    },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>{t('notification.create')}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('notification.create')}</SheetTitle>
          <SheetDescription>
            {t('notification.createDescription')}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notification.title')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notification.content')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userUids"
              render={() => (
                <FormItem>
                  <FormLabel>{t('notification.targets')}</FormLabel>
                  {usersQuery.data?.map((user: IUser) => (
                    <FormField
                      key={user.uid}
                      control={form.control}
                      name="userUids"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(user.uid)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      user.uid,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== user.uid
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {user.name} ({user.uid})
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t('notification.create')}</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
