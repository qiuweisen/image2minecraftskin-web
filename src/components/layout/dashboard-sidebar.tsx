import { Logo } from '@/components/shared/logo';
import { SidebarMain } from '@/components/layout/sidebar-main';
import { SidebarUser } from '@/components/layout/sidebar-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { Routes } from '@/lib/routes';
import type { SessionUser } from '@/auth/types';
import type * as React from 'react';

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: SessionUser;
};

/**
 * Dashboard sidebar
 */
export function DashboardSidebar({ user, ...props }: DashboardSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link
                  to={Routes.Root}
                  aria-label="ChartMini"
                  onClick={closeMobileSidebar}
                >
                  <Logo className="!h-8 !w-auto group-data-[collapsible=icon]:hidden" />
                  <img
                    src="/chartmini-favicon.svg"
                    alt=""
                    aria-hidden="true"
                    width={24}
                    height={24}
                    className="hidden !size-6 shrink-0 object-contain group-data-[collapsible=icon]:block"
                  />
                </Link>
              }
              className="data-[slot=sidebar-menu-button]:!p-1.5 group-data-[collapsible=icon]:p-1!"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMain user={user} />
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-4">
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
