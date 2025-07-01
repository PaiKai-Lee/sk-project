import {
  Home,
  CirclePlus,
  ChartNoAxesCombined,
  Bell,
  DatabaseBackup,
  SquarePlus,
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

// Menu items.
export const routeItems = [
  {
    title: 'Overview',
    url: '/overview',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'Transaction',
    url: '/transaction',
    icon: SquarePlus,
  },
  {
    title: 'Transaction Records',
    url: '/transaction-records',
    icon: DatabaseBackup,
  },
  {
    title: 'Notification',
    url: '/notification',
    icon: Bell,
  },
  {
    title: 'Demo',
    url: '/demo',
    icon: CirclePlus,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
