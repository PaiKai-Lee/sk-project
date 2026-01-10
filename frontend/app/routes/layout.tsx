import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/app-sidebar';
import { Navigate, Outlet } from 'react-router';
import { SiteHeader } from '~/components/site-header';
import { useAuth } from '~/features/auth/hooks';
import { Skeleton } from '~/components/ui/skeleton';
export default function Layout() {
  const auth = useAuth();

  if (auth.isLoadingProfile) {
    return (
      <div className="flex flex-col flex-1 h-screen gap-4 p-4 lg:flex-row">
        <Skeleton className="h-screen hidden lg:block lg:basis-1/5" />
        <Skeleton className="h-screen lg:basis-4/5 " />
      </div>
    );
  }

  if (auth.profile) {
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

  return <Navigate to="/login" />;
}
