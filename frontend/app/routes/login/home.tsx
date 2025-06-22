import type { Route } from '../login/+types/home';
import { LoginForm } from '~/components/login/login-form';
import { toast } from 'sonner';
import { tokenManager } from '~/lib/token-manager';
import { redirect } from 'react-router';
import AuthClient from '~/api/auth';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'login' }, { name: 'description', content: 'login page' }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  try {
    const { data: axiosData } = await AuthClient.login({
      uid: formData.get('uid') as string,
      password: formData.get('password') as string,
    });
    const accessToken = axiosData.data.accessToken;
    const refreshToken = axiosData.data.refreshToken;
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
    return redirect('/');
  } catch (error) {
    console.log('error');
    console.error(error);
    return { error: '登入失敗' };
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  // 如果登入失敗顯示錯誤，判斷action data
  if (actionData) {
    toast.error(actionData?.error);
  }

  return <LoginForm />;
}
