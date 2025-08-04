import type { Route } from '../transaction/+types/home';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { Input } from '~/components/ui/input';

import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useTransaction } from '~/context/transaction';
import { Cart } from '~/components/transaction/cart';
import { Text } from '~/components/ui/typography';
import { useOutletContext } from 'react-router';
import type { UseQueryResult } from '@tanstack/react-query';
import type { IResponseData, IUserResponse } from '~/api/types';
import { useTranslation } from 'react-i18next';

const amountInputSchema = z
  .number({ message: 'must be a number' })
  .min(0, { message: 'must be greater than 0' });

const detailInputSchema = z
  .string({ message: 'must be a string' })
  .max(30, { message: 'must be less than 30 character' });

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'transaction' },
    { name: 'description', content: 'transaction page' },
  ];
}

export default function TransactionPage() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const {
    transactionItems,
    updateTransactionItems,
    setTransactionItems,
    setIsCartChecked,
  } = useTransaction();
  const { usersQuery } = useOutletContext<{
    usersQuery: UseQueryResult<IResponseData<IUserResponse[]>, Error>;
  }>();

  useEffect(() => {
    if (usersQuery.data) {
      setTransactionItems(
        usersQuery.data.data.map((user) => ({
          name: user.name,
          uid: user.uid,
          balance: user?.balance || 0,
          deposit: 0,
          depositDetails: '',
          withdraw: 0,
          withdrawDetails: '',
        }))
      );
    }
    return () => {
      setTransactionItems([]);
    };
  }, [usersQuery.dataUpdatedAt, usersQuery.data]);

  function amountChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setIsCartChecked(false);
    const uid = e.target.dataset.uid as string;
    const type = e.target.dataset.type as string;
    const amount = Number(e.target.value);
    const parseResult = amountInputSchema.safeParse(amount);
    if (parseResult.success) {
      setErrors((prev) => ({
        ...prev,
        [uid]: {
          ...prev[uid],
          [type]: '',
        },
      }));

      updateTransactionItems(uid, type, amount);
      return;
    }
    setErrors((prev) => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        [type]: parseResult.error.issues[0].message,
      },
    }));
  }

  function detailChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setIsCartChecked(false);
    const uid = e.target.dataset.uid as string;
    const type = e.target.dataset.type as string;
    const details = e.target.value;
    const parseResult = detailInputSchema.safeParse(details);
    if (parseResult.success) {
      updateTransactionItems(uid, type, details);
      setErrors((prev) => ({
        ...prev,
        [uid]: {
          ...prev[uid],
          [type]: '',
        },
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        [type]: parseResult.error.issues[0].message,
      },
    }));
  }
  // TODO: 使用 tanstack table 處理 editable table
  return (
    <>
      <Table className="basis-3/5">
        <TableHeader>
          <TableRow>
            <TableHead>{t('transaction.user')}</TableHead>
            <TableHead>{t('transaction.balance')}</TableHead>
            <TableHead>{t('transaction.withdraw')}</TableHead>
            <TableHead>{t('transaction.withdrawDetails')}</TableHead>
            <TableHead>{t('transaction.deposit')}</TableHead>
            <TableHead>{t('transaction.depositDetails')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionItems.length > 0 &&
            transactionItems.map((item) => (
              <TableRow key={item.uid}>
                <TableCell className="font-medium w-[100px] max-w-[100px] *:truncate">
                  <Text>{item.name}</Text>
                  <Text className="text-xs font-light">{item.uid}</Text>
                </TableCell>
                <TableCell className="w-[100px]">
                  <Text className={item.balance < 0 ? 'text-red-500' : ''}>
                    {item.balance}
                  </Text>
                </TableCell>
                <TableCell className="w-[100px]">
                  <Input
                    type="text"
                    data-uid={item.uid}
                    data-type="withdraw"
                    value={item.withdraw}
                    onChange={amountChangeHandler}
                  />
                  {errors[item.uid]?.withdraw && (
                    <Text className="text-red-500">
                      {errors[item.uid]?.withdraw}
                    </Text>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="text"
                    data-uid={item.uid}
                    data-type="withdrawDetails"
                    value={item.withdrawDetails}
                    onChange={detailChangeHandler}
                  />
                  {errors[item.uid]?.withdrawDetails && (
                    <Text className="text-red-500">
                      {errors[item.uid]?.withdrawDetails}
                    </Text>
                  )}
                </TableCell>
                <TableCell className="w-[100px]">
                  <Input
                    type="text"
                    data-uid={item.uid}
                    data-type="deposit"
                    value={item.deposit}
                    onChange={amountChangeHandler}
                  />
                  {errors[item.uid]?.deposit && (
                    <Text className="text-red-500">
                      {errors[item.uid]?.deposit}
                    </Text>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    data-uid={item.uid}
                    data-type="depositDetails"
                    value={item.depositDetails}
                    onChange={detailChangeHandler}
                  />
                  {errors[item.uid]?.depositDetails && (
                    <Text className="text-red-500">
                      {errors[item.uid]?.depositDetails}
                    </Text>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Cart />
    </>
  );
}
