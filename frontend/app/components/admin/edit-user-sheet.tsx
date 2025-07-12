import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserClient from '~/api/users';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import RoleClient from '~/api/roles';
import DepartmentClient from '~/api/departments';
import { Separator } from '../ui/separator';
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

const formSchema = z.object({
  uid: z.string({
    required_error: 'uid不得為空',
  }),
  name: z
    .string()
    .min(1, { message: '名稱不得為空' })
    .max(10, { message: '長度需為 1 至 10 字' })
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/, {
      message: '只能包含中文、英文與數字',
    }),

  roleId: z.coerce.number({
    required_error: 'roleId不得為空',
    invalid_type_error: 'roleId必須為數字',
  }),

  departmentId: z.coerce.number({
    required_error: 'departmentId不得為空',
    invalid_type_error: 'departmentId必須為數字',
  }),

  version: z.coerce.number({
    required_error: '版本戳不得為空',
    invalid_type_error: '版本戳必須為數字',
  }),
});

export function EditUserSheet(props: {
  isEditOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: User | null;
}) {
  const { isEditOpen, setIsEditOpen, selectedUser } = props;
  const { t } = useTranslation();

  const FORM_ID = 'edit-user-form';
  const queryClient = useQueryClient();

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

  const userEditMutation = useMutation({
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
        queryKey: ['users'],
      });
      toast.success('更新成功');
      setIsEditOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('更新失敗');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: selectedUser?.uid || '',
      name: selectedUser?.name || '',
      roleId: selectedUser?.role.id,
      departmentId: selectedUser?.department.id,
      version: selectedUser?.version,
    },
  });

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        uid: selectedUser.uid,
        name: selectedUser.name,
        roleId: selectedUser.role.id,
        departmentId: selectedUser.department.id,
        version: selectedUser.version,
      });
    }
  }, [selectedUser, form]);

  function submitHandler(values: z.infer<typeof formSchema>) {
    userEditMutation.mutate(values);
    form.reset();
  }

  function openChangeHandler(status: boolean) {
    setIsEditOpen(status);
  }

  if (!selectedUser) return null;

  return (
    <>
      <Sheet open={isEditOpen} onOpenChange={openChangeHandler}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('admin.editUser')}</SheetTitle>
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
                      <Input
                        placeholder="Uid"
                        autoComplete="off"
                        {...field}
                        disabled
                      />
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
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
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <SheetFooter>
            <Button type="submit" form={FORM_ID}>
              Edit
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
