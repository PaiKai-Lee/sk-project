import { Navigate, Outlet, useNavigate } from 'react-router';
import { AuthClient, authQueryKeys } from '~/features/auth';
import { useAuth } from '~/context/auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function LoginLayout() {
  const auth = useAuth();
  const profileQuery = useQuery({
    queryKey: authQueryKeys.getProfile(),
    queryFn: async () => {
      const { data } = await AuthClient.getProfile();
      return data;
    },
    select: (data) => data.data,
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.isSuccess) {
      auth.setProfile(profileQuery.data);
    }
  }, [profileQuery.isSuccess]);

  if (profileQuery.isSuccess && profileQuery.data) {
    return <Navigate to="/" />;
  }

  if (profileQuery.isError) {
    return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    );
  }
}
