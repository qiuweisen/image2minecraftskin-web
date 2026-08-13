import { m } from '@/locale/paraglide/messages';
import { authClient } from '@/auth/client';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { ModeSwitcher } from '@/components/theme/mode-switcher';
import { UserButton } from '@/components/shared/user-button';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { Routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function SimulatorHeader() {
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 dark:border-white/10 dark:bg-black/95">
      <div className="flex h-14 items-center justify-between gap-4 px-3 sm:px-4 lg:px-6">
        <Link
          to="/"
          aria-label={m.common_home()}
          className="flex shrink-0 items-center"
        >
          <Logo className="h-7 sm:h-8" />
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            to="/play"
            className="rounded-lg px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {m.simulator_nav_daily_replay()}
          </Link>
          <Link
            to="/day-trading-simulator"
            className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-block"
          >
            {m.simulator_nav_day_trading()}
          </Link>
          <Link
            to="/blog"
            search={{ page: 1 }}
            className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white md:inline-block"
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
                <UserButton user={user} />
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
