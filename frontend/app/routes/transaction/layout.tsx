import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { toast } from 'sonner';
import UserClient from '~/api/users';
import { TransactionProvider } from '~/context/transaction';

export default function TransactionLayout() {
  const usersQuery = useQuery({
    queryKey: ['users', { showDisable: 'false', fields: ['balance'] }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('showDisable', 'false');
      params.append('fields', 'balance');
      const { data } = await UserClient.getUsers({
        params,
      });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  if (usersQuery.isFetching) {
    return <div>fetching...</div>;
  }

  if (usersQuery.isLoading) {
    return <p>Loading...</p>;
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
