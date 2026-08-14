import { getDashboardSnapshot } from '@/api/dashboard';
import { useQuery } from '@tanstack/react-query';

export type DashboardSnapshot = Awaited<
  ReturnType<typeof getDashboardSnapshot>
>;

export const dashboardKeys = {
  all: ['dashboard'] as const,
  snapshot: (timezone: string) => [...dashboardKeys.all, { timezone }] as const,
};

function getBrowserTimezone() {
  if (typeof Intl === 'undefined') return 'UTC';

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function useDashboardSnapshot() {
  const timezone = getBrowserTimezone();

  return useQuery({
    queryKey: dashboardKeys.snapshot(timezone),
    queryFn: () => getDashboardSnapshot({ data: { timezone } }),
    // A session can be completed on /play or /day-trading-simulator and then
    // the user can return here through client-side navigation. Always refresh
    // on mount so the recent record and points are not hidden by a stale cache.
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}
