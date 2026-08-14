import { Link } from '@tanstack/react-router';
import { IconCalendarCheck, IconCoin } from '@tabler/icons-react';

import { m } from '@/locale/paraglide/messages';
import { getLocale } from '@/lib/locale';
import { formatDashboardNumber } from '@/lib/dashboard-formatters';
import { useCalendarLocale } from '@/hooks/use-calendar-locale';
import { Routes } from '@/lib/routes';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type CheckIn = {
  monthKey: string;
  todayKey: string;
  signedDays: string[];
  signedCount: number;
  milestones: readonly number[];
  dailyPoints: number;
  milestonePoints: number;
};

function parseDayKey(dayKey: string) {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function monthFromKey(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

export function DailyPracticeCard({
  checkIn,
  pointsBalance = 0,
  isLoading = false,
}: {
  checkIn?: CheckIn;
  pointsBalance?: number;
  isLoading?: boolean;
}) {
  const calendarLocale = useCalendarLocale(getLocale());

  if (isLoading || !checkIn) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const signedDates = checkIn.signedDays.map(parseDayKey);
  const milestoneDates = checkIn.signedDays
    .filter((_, index) => checkIn.milestones.includes(index + 1))
    .map(parseDayKey);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{m.dashboard_daily_practice()}</CardTitle>
            <CardDescription>
              {m.dashboard_daily_practice_description()}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1">
            <IconCoin className="size-3.5" />
            {formatDashboardNumber(pointsBalance)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {m.dashboard_check_in_completed()}
          </span>
          <span className="font-medium tabular-nums">
            {formatDashboardNumber(checkIn.signedCount)} /{' '}
            {formatDashboardNumber(28)}
          </span>
        </div>
        <Calendar
          aria-label={m.dashboard_daily_practice()}
          mode="single"
          month={monthFromKey(checkIn.monthKey)}
          locale={calendarLocale}
          disableNavigation
          showOutsideDays={false}
          modifiers={{
            signed: signedDates,
            milestone: milestoneDates,
          }}
          modifiersClassNames={{
            signed:
              'bg-primary text-primary-foreground rounded-md font-semibold',
            milestone:
              'ring-2 ring-amber-400 ring-offset-1 ring-offset-background',
          }}
          className="mx-auto w-full max-w-sm [--cell-size:--spacing(7)]"
        />
        <div className="mt-auto grid gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <IconCalendarCheck className="size-3.5 text-primary" />
            <span>{m.dashboard_check_in_rule()}</span>
          </div>
          <div className="flex items-start gap-2">
            <IconCoin className="mt-0.5 size-3.5 text-amber-500" />
            <span>{m.dashboard_check_in_bonus()}</span>
          </div>
        </div>
        <Link
          to={Routes.Play}
          className={cn(
            buttonVariants({ variant: 'secondary' }),
            'mt-1 w-full'
          )}
        >
          {m.dashboard_check_in_start()}
        </Link>
      </CardContent>
    </Card>
  );
}
