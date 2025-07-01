import { Outlet } from 'react-router';
export default function TransactionRecordsLayout() {
  return (
    <div className="flex flex-col flex-1">
      <Outlet />
    </div>
  );
}
