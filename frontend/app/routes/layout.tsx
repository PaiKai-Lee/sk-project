import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/app-sidebar';
import { Navigate, Outlet } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { AuthClient, authQueryKeys } from '~/features/auth';
import { useEffect } from 'react';
import { SiteHeader } from '~/components/site-header';
import { useAuth } from '~/context/auth';
import { Skeleton } from '~/components/ui/skeleton';
export default function Layout() {
  const auth = useAuth();
  const profileQuery = useQuery({
    queryKey: authQueryKeys.getProfile(),
    queryFn: async () => {
      const { data } = await AuthClient.getProfile();
      return data;
    },
    select: (rawData) => rawData.data,
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.data) {
      auth.setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  if (profileQuery.isError) {
    return <Navigate to="/login" />;
  }

  if (profileQuery.isLoading) {
    return (
      <div className="flex flex-col flex-1 h-screen gap-4 p-4 lg:flex-row">
        <Skeleton className="h-screen hidden lg:block lg:basis-1/5" />
        <Skeleton className="h-screen lg:basis-4/5 " />
      </div>
    );
  }

  if (profileQuery.isSuccess && profileQuery.data) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="container mx-auto my-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
}
