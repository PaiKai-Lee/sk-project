import { Navigate, Outlet } from 'react-router';
import { useAuth } from '~/features/auth/hooks';
import { Skeleton } from '~/components/ui/skeleton';
import { Card } from '~/components/ui/card';

export default function LoginLayout() {
  const auth = useAuth();

  if (auth.isPendingProfile) {
    return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-[18px] w-[40px]" />
              <Skeleton className="h-[10px] w-[50%]" />
            </div>
            <Skeleton className="h-[50px] w-full" />
            <Skeleton className="h-[50px] w-full" />
            <Skeleton className="h-[50px] w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (auth.profile) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
