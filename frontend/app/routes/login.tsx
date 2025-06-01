import { LoginForm } from '~/components/login-form';
import type { Route } from './+types/demo';
import { redirect, useNavigate } from 'react-router';
import { toast } from 'sonner';
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'demo' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  // TODO 處理 API 登入
  return redirect('/');
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigator = useNavigate();

  //TODO 如果登入中直接導向首頁

  //TODO 如果登入失敗顯示錯誤，判斷action data
  if (actionData) {
    toast.error(actionData?.error);
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
