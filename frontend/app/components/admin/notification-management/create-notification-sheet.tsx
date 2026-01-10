import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { useTranslation } from 'react-i18next';
import { Checkbox } from '~/components/ui/checkbox';
import type { IUser } from '~/features/users';
import { getUsersQueryOptions } from '~/features/users/query';
import { useCreateNotificationMutation } from '~/features/notifications/query';

export function CreateNotificationSheet() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm();
  const usersQuery = useQuery(getUsersQueryOptions());

  const createMutation = useCreateNotificationMutation({
    onSuccess: () => {
      form.reset();
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
