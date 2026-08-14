import { m } from '@/locale/paraglide/messages';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatDashboardDate,
  formatDashboardPercent,
  formatDashboardRecordDuration,
} from '@/lib/dashboard-formatters';

type RecordItem = {
  id: string;
  mode: 'play' | 'day-trading-simulator';
  symbol: string;
  interval: string;
  pnlPct: number;
  durationSeconds: number;
  completedAt: string;
};

function formatMode(mode: RecordItem['mode']) {
  return mode === 'play'
    ? m.home_simulator_card_1_title()
    : m.home_simulator_card_2_title();
}

export function RecentTrainingRecords({
  records = [],
  isLoading = false,
}: {
  records?: RecordItem[];
  isLoading?: boolean;
}) {
  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle>{m.dashboard_recent_training()}</CardTitle>
        <CardDescription>
          {m.dashboard_recent_training_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-9 w-full" key={index} />
            ))}
          </div>
        ) : records.length === 0 ? (
          <Empty className="min-h-40 border border-dashed">
            <EmptyHeader>
              <EmptyTitle>{m.dashboard_no_training()}</EmptyTitle>
              <EmptyDescription>
                {m.dashboard_no_training_description()}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.dashboard_record_mode()}</TableHead>
                  <TableHead>{m.dashboard_record_symbol()}</TableHead>
                  <TableHead>{m.dashboard_record_date()}</TableHead>
                  <TableHead>{m.dashboard_result()}</TableHead>
                  <TableHead className="text-right">
                    {m.dashboard_duration()}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => {
                  const pnlClass =
                    record.pnlPct > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : record.pnlPct < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-muted-foreground';
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {formatMode(record.mode)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.symbol} · {record.interval}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDashboardDate(record.completedAt, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell
                        className={`font-medium tabular-nums ${pnlClass}`}
                      >
                        {formatDashboardPercent(record.pnlPct)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatDashboardRecordDuration(record.durationSeconds)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
