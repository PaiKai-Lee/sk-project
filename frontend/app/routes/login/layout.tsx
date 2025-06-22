import { Outlet, useNavigate } from 'react-router';
import AuthClient from '~/api/auth';
import { useAuth } from '~/context/auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function LoginLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const profileQuery = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const { data } = await AuthClient.getProfile();
      return data;
    },
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.isSuccess) {
      auth.setProfile(profileQuery.data.data);
      navigate('/');
    }
  }, [profileQuery.isSuccess]);

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
