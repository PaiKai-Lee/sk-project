import { Button } from '~/components/ui/button';
import type { Route } from './+types/demo';
import { useTheme } from '~/components/theme-toggle';
import { toast } from 'sonner';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'demo' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  return { data: 'data', time: Date.now() };
}

export default function Demo({ loaderData }: Route.ComponentProps) {
  const { theme, setTheme } = useTheme();
  const data = loaderData;

  function handleToggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
    toast.success('Theme changed');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={handleToggleTheme}>Click me</Button>
    </div>
  );
}
