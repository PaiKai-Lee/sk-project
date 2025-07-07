import { useLocation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { routeItems } from './app-sidebar';
import { useAuth } from '~/context/auth';
import { Heading1, Text } from '~/components/ui/typography';
import { CircleUser } from 'lucide-react';
import { GitHubIcon } from './ui/icons';
export function SiteHeader() {
  const location = useLocation();
  const routeItem = routeItems.find((item) => item.url === location.pathname);
  const title = routeItem?.title;
  const auth = useAuth();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Heading1 className="text-lg">{title}</Heading1>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CircleUser className="size-5" />
            <Text className="font-semibold">{auth.profile?.uid}</Text>
          </div>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <div className="flex items-center gap-1">
              <GitHubIcon className="size-5" />
              <a
                href="https://github.com/PaiKai-Lee/sk-project"
                rel="noopener noreferrer"
                target="_blank"
                className="dark:text-foreground"
              >
                GitHub
              </a>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
