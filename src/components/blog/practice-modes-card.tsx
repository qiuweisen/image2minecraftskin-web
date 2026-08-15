import { Link } from '@tanstack/react-router';
import { IconCalendar, IconChartBar } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const practiceModes = [
  {
    href: '/play' as const,
    label: 'Daily Replay',
    icon: IconCalendar,
  },
  {
    href: '/day-trading-simulator' as const,
    label: 'Day Trading Simulator',
    icon: IconChartBar,
  },
] as const;

export function PracticeModesCard() {
  return (
    <aside
      aria-labelledby="blog-practice-modes-title"
      className="not-prose my-8"
      data-testid="blog-practice-modes"
    >
      <Card className="overflow-hidden shadow-sm shadow-foreground/5">
        <CardHeader className="gap-2 p-5 sm:p-6 sm:pb-5">
          <Badge
            variant="secondary"
            className="w-fit uppercase tracking-[0.08em]"
          >
            Practice Modes
          </Badge>
          <CardTitle>
            <h2
              id="blog-practice-modes-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Practice with ChartMini
            </h2>
          </CardTitle>
          <CardDescription className="text-base leading-7">
            Two ways to practice. Build consistency and improve your edge.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Separator />
          <div className="p-5 sm:p-6 sm:pt-5">
            <div className="flex flex-col overflow-hidden rounded-lg border border-border sm:flex-row">
              {practiceModes.map(({ href, label, icon: Icon }, index) => (
                <div key={href} className="contents">
                  {index > 0 ? (
                    <>
                      <Separator className="sm:hidden" />
                      <Separator
                        orientation="vertical"
                        className="hidden h-auto sm:block"
                      />
                    </>
                  ) : null}
                  <Link
                    to={href}
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'lg',
                      className:
                        'h-auto min-h-14 w-full flex-1 justify-start gap-3 rounded-none px-4 py-3 text-left hover:bg-muted sm:min-h-16 sm:px-4',
                    })}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-muted-foreground"
                    />
                    <span className="min-w-0 truncate font-medium">
                      {label}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
