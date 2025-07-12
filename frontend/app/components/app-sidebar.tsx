import {
  CirclePlus,
  ChartNoAxesCombined,
  Bell,
  DatabaseBackup,
  SquarePlus,
  ShieldUser,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { NavSetting } from '~/components/nav-setting';
import { Link } from 'react-router';
import { useAuth } from '~/context/auth';
import { useTranslation } from 'react-i18next';

// Menu items.
export const routeItems = [
  {
    title: 'overview',
    url: '/overview',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'transaction',
    url: '/transaction',
    icon: SquarePlus,
  },
  {
    title: 'transaction_records',
    url: '/transaction-records',
    icon: DatabaseBackup,
  },
  {
    title: 'notification',
    url: '/notification',
    icon: Bell,
  },
  {
    title: 'admin',
    url: '/admin',
    icon: ShieldUser,
  },
  {
    title: 'demo',
    url: '/demo',
    icon: CirclePlus,
  },
];

export function AppSidebar() {
  const { t } = useTranslation();
  const auth = useAuth();
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('title.app')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routeItems.map((item) => {
                if (item.title === 'Admin' && !auth.isAdmin) return null;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        {item.icon && <item.icon />}
                        <span>{t(`title.${item.title}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavSetting />
      </SidebarFooter>
    </Sidebar>
  );
}
