import { useTransaction } from '~/context/transaction';
import { Card } from '../ui/card';
import { FileStack } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '~/lib/http-client';
import { toast } from 'sonner';
import { Text } from '../ui/typography';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useTranslation } from 'react-i18next';
import { overviewQueryKeys } from '~/features/overview';
import { userQueryKeys } from '~/features/users';

const formSchema = z.object({
  remark: z.string().max(30, { message: '備註長度不能超過 30 字' }),
  items: z.array(
    z.object({
      uid: z.string().min(1, { message: 'uid不得為空' }),
      value: z.number(),
      details: z.string().optional(),
    })
  ),
});

export function Cart() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { cart, totalDeposit, totalWithdraw, isCartChecked, setIsCartChecked } =
    useTransaction();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remark: '',
      items: cart,
    },
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: (transactions) => {
      return httpClient.post('/transactions', transactions);
    },
    onSuccess: async (data) => {
      toast.success('交易提交成功');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.getUsers({ showDisable: 'false' }),
        }),
        queryClient.invalidateQueries({
          queryKey: overviewQueryKeys.all,
        }),
      ]);
      form.reset();
    },
    onError: (error) => {
      toast.error('交易提交失敗');
    },
  });

  function onSubmit(values: any) {
    mutation.mutate(values);
  }

  useEffect(() => {
    form.reset({
      remark: form.getValues('remark') ?? '',
      items: cart,
    });
  }, [cart]);

  return (
    <Card className="p-4 lg:basis-2/5 lg:self-start lg:sticky lg:top-4">
      <div className="flex flex-col gap-4 rounded-xl ">
        <CartTitle
          cartItemsQuantity={cart.length}
          text={t('transaction.cartTitle')}
        />
        {cart.length === 0 ? (
          <CartEmpty
            icon={<FileStack className="w-10 h-10" />}
            text={t('transaction.cartEmpty')}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transaction.user')}</TableHead>
                    <TableHead>{t('transaction.value')}</TableHead>
                    <TableHead>{t('transaction.details')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item, index) => (
                    <TableRow
                      key={index}
                      className={`${item.value < 0 && 'text-red-400'}`}
                    >
                      <TableCell className="font-medium w-[100px] max-w-[100px] truncate">
                        <FormField
                          control={form.control}
                          name={`items.${index}.uid`}
                          render={({ field }) => (
                            <>
                              <Text className="truncate">{item.name}</Text>
                              <Text className="text-xs truncate">
                                {field.value}
                              </Text>
                            </>
                          )}
                        />
                      </TableCell>
                      <TableCell className="w-[100px] max-w-[100px]">
                        <FormField
                          control={form.control}
                          name={`items.${index}.value`}
                          render={({ field }) => (
                            <Text className="truncate">{field.value}</Text>
                          )}
                        />
                      </TableCell>
                      <TableCell className="w-[200px] max-w-[200px]">
                        <FormField
                          control={form.control}
                          name={`items.${index}.details`}
                          render={({ field }) => (
                            <Text className="truncate">{field.value}</Text>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className="w-full flex">
                        <Text className="basis-1/2 max-w-1/2 truncate">
                          {t('transaction.deposit')}: {totalDeposit}
                        </Text>
                        <Text className="basis-1/2 max-w-1/2 text-red-400 truncate">
                          {t('transaction.withdraw')}: {totalWithdraw}
                        </Text>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transaction.remark')}</FormLabel>
                    <FormControl>
                      <Input placeholder="remark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="check"
                  className="cursor-pointer"
                  checked={isCartChecked}
                  onCheckedChange={setIsCartChecked}
                />
                <Label htmlFor="check">{t('transaction.confirm')}</Label>
              </div>
              <Button
                type="submit"
                className="cursor-pointer w-full"
                disabled={!isCartChecked}
              >
                Submit
              </Button>
            </form>
          </Form>
        )}
      </div>
    </Card>
  );
}

function CartTitle({
  cartItemsQuantity,
  text,
}: {
  cartItemsQuantity: number;
  text: string;
}) {
  return (
    <h1 className="text-2xl font-bold text-custom-red">
      {text} ({cartItemsQuantity})
    </h1>
  );
}

export function CartEmpty({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {icon}
      <p className="text-custom-rose-900">{text}</p>
    </div>
  );
}

export function CartOrderTotal({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between pt-4">
      <p className="text-custom-rose-900">Order Total</p>

      <p className="text-2xl font-bold text-custom-rose-900">${children}</p>
    </div>
  );
}

export function CartMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-1 rounded-xl bg-custom-rose-50 py-4">
      {children}
    </div>
  );
}
