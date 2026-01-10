import {
  CirclePlus,
  ChartNoAxesCombined,
  Bell,
  DatabaseBackup,
  SquarePlus,
  ShieldUser,
  Logs,
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
  useSidebar,
} from '~/components/ui/sidebar';
import { NavSetting } from '~/components/nav-setting';
import { Link, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useIsMobile } from '~/hooks';
import { useAuth } from '~/features/auth/hooks';
import { useTranslation } from 'react-i18next';

// TODO 後續群組處理 管理頁面,交易頁面
// Menu items.
export const routeItems = [
  {
    title: 'overview',
    url: '/overview',
    icon: ChartNoAxesCombined,
    isShowInSidebar: true,
  },
  {
    title: 'transaction',
    url: '/transaction',
    icon: SquarePlus,
    isShowInSidebar: true,
  },
  {
    title: 'transaction_records',
    url: '/transaction-records',
    icon: DatabaseBackup,
    isShowInSidebar: true,
  },
  {
    title: 'user_management',
    url: '/admin/user',
    icon: ShieldUser,
    isShowInSidebar: true,
  },
  {
    title: 'audit_logs',
    url: '/admin/audit-logs',
    icon: Logs,
    isShowInSidebar: true,
  },
  {
    title: 'profile',
    url: '/profile',
    icon: Bell,
    isShowInSidebar: false,
  },
  {
    title: 'demo',
    url: '/demo',
    icon: CirclePlus,
    isShowInSidebar: false,
  },
];

export function AppSidebar() {
  const { t } = useTranslation();
  const auth = useAuth();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const location = useLocation();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('title.app')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routeItems.map((item) => {
                if (!item.isShowInSidebar) return null;
                if (item.url.startsWith('/admin') && !auth.isAdmin) return null;
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
