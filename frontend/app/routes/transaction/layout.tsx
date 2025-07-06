import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { toast } from 'sonner';
import UserClient from '~/api/users';
import { TransactionProvider } from '~/context/transaction';
import { Skeleton } from '~/components/ui/skeleton';

export default function TransactionLayout() {
  const usersQuery = useQuery({
    queryKey: [
      'users',
      {
        showDisable: 'false',
        fields: ['balance'],
        sorting: [{ id: 'balance', desc: true }],
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('showDisable', 'false');
      params.append('fields', 'balance');
      params.append('sort', 'balance:desc');
      const { data } = await UserClient.getUsers({
        params,
      });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  if (usersQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="basis-3/5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-[50px] w-full mb-2" />
          ))}
        </div>
        <div className="basis-2/5">
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );
  }

  if (usersQuery.isError) {
    toast.error(usersQuery.error.message);
  }

  return (
    <TransactionProvider>
      <div className="flex flex-col gap-5 lg:flex-row">
        <Outlet context={{ usersQuery }} />
      </div>
    </TransactionProvider>
  );
}
