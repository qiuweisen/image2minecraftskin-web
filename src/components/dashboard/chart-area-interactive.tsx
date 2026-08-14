import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { m } from '@/locale/paraglide/messages';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  formatDashboardChartDate,
  formatDashboardNumber,
} from '@/lib/dashboard-formatters';

type ActivityPoint = { date: string; sessions: number };

export function ChartAreaInteractive({
  data = [],
  isLoading = false,
}: {
  data?: ActivityPoint[];
  isLoading?: boolean;
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');
  const chartInstanceId = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    const daysToShow = timeRange === '30d' ? 30 : timeRange === '7d' ? 7 : 90;
    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - daysToShow + 1);

    const activeData = data.filter((item) => {
      const date = new Date(`${item.date}T00:00:00Z`);
      return date >= startDate && date <= endDate;
    });
    if (activeData.length === 0) return [];

    const sessionsByDay = new Map(
      activeData.map((item) => [item.date, item.sessions])
    );
    return Array.from({ length: daysToShow }, (_, index) => {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + index);
      const dateKey = date.toISOString().slice(0, 10);
      return { date: dateKey, sessions: sessionsByDay.get(dateKey) ?? 0 };
    });
  }, [data, timeRange]);

  const chartConfig = {
    sessions: {
      label: m.dashboard_sessions(),
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;
  const fillId = `training-sessions-fill-${chartInstanceId}`;

  return (
    <Card className="h-full @container/card">
      <CardHeader>
        <CardTitle>{m.dashboard_training_overview()}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {m.dashboard_training_overview_description()}
          </span>
          <span className="@[540px]/card:hidden">
            {m.dashboard_last_90_days()}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              setTimeRange(value[0] ?? '90d');
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">
              {m.dashboard_last_90_days()}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d">
              {m.dashboard_last_30_days()}
            </ToggleGroupItem>
            <ToggleGroupItem value="7d">
              {m.dashboard_last_7_days()}
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label={m.common_select_value()}
            >
              <SelectValue placeholder={m.dashboard_last_90_days()} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {m.dashboard_last_90_days()}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {m.dashboard_last_30_days()}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {m.dashboard_last_7_days()}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-h-[300px] flex-1 flex-col px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="min-h-[250px] flex-1 animate-pulse rounded-lg bg-muted" />
        ) : filteredData.length === 0 ? (
          <div className="flex min-h-[250px] flex-1 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            {m.dashboard_no_training_description()}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto min-h-[250px] h-full w-full flex-1"
          >
            <AreaChart data={filteredData} margin={{ left: 4, right: 8 }}>
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-sessions)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-sessions)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDashboardChartDate}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      formatDashboardChartDate(String(value))
                    }
                    formatter={(value) => (
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formatDashboardNumber(Number(value))}
                      </span>
                    )}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="sessions"
                type="monotone"
                stroke="var(--color-sessions)"
                strokeWidth={2}
                fill={`url(#${fillId})`}
                fillOpacity={1}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
