import { m } from '@/locale/paraglide/messages';
import { getNavbarLinks } from '@/config/navbar-config';
import { isLinkActive } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Link, useLocation } from '@tanstack/react-router';
import { IconChevronRight, IconMenu2, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/shared/logo';
import { ModeSwitcherHorizontal } from '@/components/theme/mode-switcher-horizontal';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { websiteConfig } from '@/config/website';
const mobileLinkClass =
  'flex w-full items-center rounded-md p-2 text-base text-muted-foreground transition-colors duration-150 hover:text-foreground';
const mobileLinkActiveClass = 'font-semibold text-primary';
const mobileSubLinkClass =
  'flex w-full items-center gap-4 rounded-md p-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground';
interface NavbarMobileProps extends React.HTMLAttributes<HTMLDivElement> {}
export function NavbarMobile({ className, ...props }: NavbarMobileProps) {
  const pathname = useLocation().pathname;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuLinks = getNavbarLinks();
  // Sync mount (avoid hydration mismatch) and close drawer on route change
  useEffect(() => {
    setMounted(true);
    setOpen(false);
  }, [pathname]);
  if (!mounted) return null;
  return (
    <>
      <div
        className={cn('flex items-center justify-between', className)}
        {...props}
      >
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-semibold">
            {websiteConfig.metadata?.name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label={m.common_toggle_menu()}
            onClick={() => setOpen((o) => !o)}
            className="size-8 rounded-md border"
          >
            {open ? (
              <IconX className="size-4" />
            ) : (
              <IconMenu2 className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={m.common_mobile_navigation()}
          className="fixed inset-0 top-14.25 z-50 flex flex-col overflow-y-auto bg-background animate-in fade-in-0 duration-200"
        >
          <div className="flex flex-1 flex-col items-start gap-4 p-4">
            <ul className="w-full space-y-1">
              {menuLinks?.map((item) => {
                const active = item.href
                  ? isLinkActive(item.href, pathname)
                  : item.items?.some((sub) => isLinkActive(sub.href, pathname));
                return (
                  <li key={item.title} className="py-1">
                    {item.items ? (
                      <Collapsible>
                        <CollapsibleTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              className={cn(
                                'w-full justify-between text-left text-base',
                                'bg-transparent text-muted-foreground hover:text-foreground',
                                active && 'font-semibold text-primary'
                              )}
                            >
                              {item.title}
                              <IconChevronRight className="size-4" />
                            </Button>
                          }
                          nativeButton={false}
                        />
                        <CollapsibleContent className="pl-2">
                          <ul className="mt-2 space-y-2">
                            {item.items.map((sub) => (
                              <li key={sub.title}>
                                <Link
                                  to={sub.href ?? '#'}
                                  target={sub.external ? '_blank' : undefined}
                                  rel={
                                    sub.external
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  onClick={() => setOpen(false)}
                                  className={cn(
                                    mobileSubLinkClass,
                                    isLinkActive(sub.href, pathname) &&
                                      mobileLinkActiveClass
                                  )}
                                >
                                  {sub.icon ? (
                                    <sub.icon className="size-4 shrink-0" />
                                  ) : null}
                                  {sub.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Link
                        to={item.href ?? '#'}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          mobileLinkClass,
                          active && mobileLinkActiveClass
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto w-full border-t border-border/50 p-4 flex items-center justify-end gap-2">
              {websiteConfig.ui?.locale?.enableSwitch && (
                <LocaleSwitcher onLocaleChange={() => setOpen(false)} />
              )}
              <ModeSwitcherHorizontal />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
