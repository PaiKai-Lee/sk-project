import {
  SidebarInset,
  SidebarProvider,
} from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/app-sidebar';
import { Outlet, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import AuthClient from '~/api/auth';
import { useEffect } from 'react';
import { SiteHeader } from '~/components/site-header';
import { useAuth } from '~/context/auth';
export default function Layout() {
  const navigate = useNavigate();
  const auth = useAuth();
  const profileQuery = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const { data } = await AuthClient.getProfile();
      return data;
    },
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.isError) {
      navigate('/login');
    }
  }, [profileQuery.isError]);

  useEffect(() => {
    if (profileQuery.isSuccess) {
      auth.setProfile(profileQuery.data.data);
    }
  }, [profileQuery.isSuccess]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className='container mx-auto my-6'>
          {profileQuery.isSuccess && <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
