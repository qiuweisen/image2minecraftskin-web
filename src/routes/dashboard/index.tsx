import { m } from '@/locale/paraglide/messages';
import { ChartAreaInteractive } from '@/components/dashboard/chart-area-interactive';
import { DailyPracticeCard } from '@/components/dashboard/daily-practice-card';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { QuickStartCard } from '@/components/dashboard/quick-start-card';
import { RecentTrainingRecords } from '@/components/dashboard/recent-training-records';
import { SectionCards } from '@/components/dashboard/section-cards';
import { useDashboardSnapshot } from '@/hooks/use-dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isError, isPending, refetch } = useDashboardSnapshot();
  const breadcrumbs = [
    {
      label: m.dashboard_title(),
      isCurrentPage: true,
    },
  ];
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 lg:gap-6 lg:px-6 lg:py-6">
            <QuickStartCard />
            <SectionCards summary={data?.summary} isLoading={isPending} />
            {isError ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {m.dashboard_load_error()}
                </p>
                <button
                  type="button"
                  className="mt-3 text-sm font-medium text-primary underline underline-offset-4"
                  onClick={() => void refetch()}
                >
                  {m.dashboard_try_again()}
                </button>
              </div>
            ) : (
              <>
                <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)]">
                  <ChartAreaInteractive
                    data={data?.activity}
                    isLoading={isPending}
                  />
                  <DailyPracticeCard
                    checkIn={data?.checkIn}
                    pointsBalance={data?.points.balance}
                    isLoading={isPending}
                  />
                </div>
                <RecentTrainingRecords
                  records={data?.recentRecords}
                  isLoading={isPending}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
