import { Languages, LogOut } from 'lucide-react';
import { usePreference } from '~/hooks';
import { useAuth } from '~/features/auth/hooks';
import type { Language } from '~/context/preference';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import { ModeToggle } from './theme-toggle';
import { useTranslation } from 'react-i18next';

export function NavSetting() {
  const { setLanguage } = usePreference();
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const auth = useAuth();

  function handleLogout() {
    return auth.logout();
  }

  function changeLanguage(lang: Language) {
    setLanguage(lang);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Languages />
              <span>{t('common.changeLanguage')}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={() => changeLanguage('en')}>
              English
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => changeLanguage('zh-TW')}>
              中文
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <ModeToggle />
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout}>
          <LogOut />
          {t('auth.logout')}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
