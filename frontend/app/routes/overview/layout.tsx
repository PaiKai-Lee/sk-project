import { Outlet } from 'react-router';

export default function OverviewLayout() {
  return (
    <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
      <Outlet />
    </div>
  );
}
