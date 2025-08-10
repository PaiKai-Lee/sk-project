import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserClient from '~/api/users';
import { toast } from 'sonner';
import { useState } from 'react';
import RoleClient from '~/api/roles';
import DepartmentClient from '~/api/departments';
import { Separator } from '~/components/ui/separator';
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  uid: z.string({ message: '格式錯誤' }).min(1, { message: 'uid不得為空' }),
  name: z
    .string({ message: '格式錯誤' })
    .min(1, { message: '名稱不得為空' })
    .max(10, { message: '長度需為 1 至 10 字' })
    .optional(),
  roleId: z.coerce.number().positive({ message: 'roleId不得為空' }),
  departmentId: z.coerce.number().positive({ message: 'departmentId不得為空' }),
});

export function CreateUserSheet() {
  const { t } = useTranslation();
  const FORM_ID = 'create-user-form';
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const roleQuery = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleClient.getRoles(),
    select: (data) => data.data.data,
    staleTime: 60 * 1000 * 60,
  });

  const departmentQuery = useQuery({
    queryKey: ['departments'],
    queryFn: () => DepartmentClient.getDepartments(),
    select: (data) => data.data.data,
    staleTime: 60 * 1000 * 60,
  });

  const userCreateMutation = useMutation({
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
        queryKey: ['users'],
      });
      toast.success('新增成功');
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('新增失敗');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      uid: '',
      roleId: 0,
      departmentId: 0,
    },
  });

  function submitHandler(values: z.infer<typeof formSchema>) {
    userCreateMutation.mutate(values);
  }

  function openChangeHandler(status: boolean) {
    setOpen(status);
    if (status) {
      form.reset();
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={openChangeHandler}>
        <SheetTrigger asChild>
          <Button className="max-w-min cursor-pointer">
            {t('admin.createUser')}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('admin.createUser')}</SheetTitle>
          </SheetHeader>
          <SheetDescription></SheetDescription>
          <Form {...form}>
            <form
              id={FORM_ID}
              onSubmit={form.handleSubmit(submitHandler)}
              className="grid flex-1 auto-rows-min gap-4 px-4"
            >
              <FormField
                control={form.control}
                name="uid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.uid')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Uid" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="User Name"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem className="basis-1/2">
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('admin.selectRole')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleQuery.data?.map((role) => {
                            if (role.name !== 'root') {
                              return (
                                <SelectItem
                                  key={role.id}
                                  value={role.id.toString()}
                                >
                                  {role.name}
                                </SelectItem>
                              );
                            }
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem className="basis-1/2">
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('admin.department')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentQuery.data?.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id.toString()}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <SheetFooter>
            <Button type="submit" form={FORM_ID}>
              Submit
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
