import { sessionClient } from '@/auth/session-client';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { ModeSwitcher } from '@/components/theme/mode-switcher';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { Routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { Link } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState } from 'react';
import { m } from '@/locale/paraglide/messages';

const UserButton = lazy(() =>
  import('@/components/shared/user-button').then(({ UserButton: button }) => ({
    default: button,
  }))
);

export function SimulatorHeader() {
  const { data: session, isPending } = sessionClient.useSession();
  const [mounted, setMounted] = useState(false);
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between gap-4 px-3 sm:px-4 lg:px-6">
        <Link
          to="/"
          aria-label={m.simulator_home()}
          className="flex shrink-0 items-center"
        >
          <Logo className="h-6 sm:h-7" />
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            to="/play"
            className="rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {m.simulator_nav_daily_replay()}
          </Link>
          <Link
            to="/day-trading-simulator"
            className="hidden rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-block"
          >
            {m.simulator_nav_day_trading()}
          </Link>
          <Link
            to="/blog"
            search={{ page: 1 }}
            className="hidden rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-block"
          >
            {m.simulator_nav_blog()}
          </Link>
          <div className="ml-1 flex items-center gap-1 sm:ml-2 sm:gap-2">
            <LocaleSwitcher />
            <ModeSwitcher />
            {websiteConfig.auth?.enable &&
              (!mounted || isPending ? (
                <Skeleton className="size-8 rounded-full" />
              ) : user ? (
                <Suspense
                  fallback={<Skeleton className="size-8 rounded-full" />}
                >
                  <UserButton user={user} />
                </Suspense>
              ) : (
                <>
                  <LoginWrapper mode="modal" asChild>
                    <button
                      type="button"
                      className={cn(
                        buttonVariants({
                          variant: 'outline',
                          size: 'sm',
                        }),
                        'cursor-pointer'
                      )}
                    >
                      {m.auth_common_login()}
                    </button>
                  </LoginWrapper>
                  <Link
                    to={Routes.Register}
                    className={buttonVariants({ size: 'sm' })}
                  >
                    {m.auth_common_signup()}
                  </Link>
                </>
              ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
