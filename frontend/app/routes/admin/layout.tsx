import { Navigate, Outlet } from 'react-router';
import { useAuth } from '~/context/auth';

export default function AdminLayout() {
  const auth = useAuth();
  if (!auth.isAdmin) return <Navigate to="/" />;

  return (
    <div className="flex flex-col flex-1">{auth.isAdmin && <Outlet />}</div>
  );
}
