import { Outlet } from 'react-router';
import { toast } from 'sonner';
import { TransactionProvider } from '~/context/transaction';
import { Skeleton } from '~/components/ui/skeleton';
import { useUsersQuery } from '~/hooks/queries/use-users-query';

export default function TransactionLayout() {
  const usersQuery = useUsersQuery({
    params: {
      showDisable: false,
      fields: ['balance'],
      sorting: [{ id: 'balance', desc: true }],
    },
    options: {
      refetchOnWindowFocus: false,
    },
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
