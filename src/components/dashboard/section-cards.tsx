import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconChartLine,
  IconCoin,
  IconFlame,
  IconClock,
} from '@tabler/icons-react';
import { m } from '@/locale/paraglide/messages';
import {
  formatDashboardNumber,
  formatDashboardPracticeDuration,
  formatDashboardUnit,
} from '@/lib/dashboard-formatters';

type Summary = {
  totalSessions: number;
  practiceSeconds: number;
  currentStreak: number;
  pointsBalance: number;
};

export function SectionCards({
  summary,
  isLoading,
}: {
  summary?: Summary;
  isLoading?: boolean;
}) {
  const metrics = [
    {
      label: m.dashboard_total_sessions(),
      value: formatDashboardNumber(summary?.totalSessions ?? 0),
      icon: IconChartLine,
    },
    {
      label: m.dashboard_practice_time(),
      value: formatDashboardPracticeDuration(summary?.practiceSeconds ?? 0),
      icon: IconClock,
    },
    {
      label: m.dashboard_current_streak(),
      value: formatDashboardUnit(summary?.currentStreak ?? 0, 'day'),
      icon: IconFlame,
    },
    {
      label: m.dashboard_points_balance(),
      value: formatDashboardNumber(summary?.pointsBalance ?? 0),
      icon: IconCoin,
    },
  ];

  return (
    <Card className="shrink-0">
      <CardHeader className="border-b">
        <CardTitle>{m.dashboard_summary()}</CardTitle>
        <CardDescription>{m.dashboard_summary_description()}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 py-4 @xl/main:grid-cols-4">
        {metrics.map((metric) => (
          <div className="flex items-start gap-3" key={metric.label}>
            <Badge
              variant="outline"
              className="mt-0.5 size-8 justify-center p-0"
            >
              <metric.icon className="size-4" />
            </Badge>
            <div className="min-w-0">
              <div className="text-muted-foreground text-xs leading-5">
                {metric.label}
              </div>
              {isLoading ? (
                <Skeleton className="mt-1 h-6 w-20" />
              ) : (
                <div className="text-lg font-semibold tabular-nums sm:text-xl">
                  {metric.value}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
