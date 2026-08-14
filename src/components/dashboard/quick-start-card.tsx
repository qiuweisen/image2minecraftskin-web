import { Link } from '@tanstack/react-router';
import {
  IconChartCandle,
  IconArrowRight,
  IconRosetteDiscount,
} from '@tabler/icons-react';

import { m } from '@/locale/paraglide/messages';
import { Routes } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function QuickStartCard() {
  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle>{m.dashboard_quick_start()}</CardTitle>
        <CardDescription>
          {m.dashboard_quick_start_description()}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Link
          to={Routes.Play}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'group h-auto min-h-0 w-full flex-col items-stretch justify-between gap-3 whitespace-normal p-4 text-left hover:border-primary/50'
          )}
        >
          <span className="flex items-start gap-3">
            <IconChartCandle className="mt-0.5 size-5 shrink-0" />
            <span className="min-w-0">
              <span className="block font-medium">
                {m.home_simulator_card_1_title()}
              </span>
              <span className="text-muted-foreground mt-1 block text-xs leading-5 font-normal">
                {m.home_simulator_card_1_description()}
              </span>
            </span>
          </span>
          <span className="text-primary flex items-center gap-1 pl-8 text-xs font-medium">
            {m.home_simulator_card_1_action()}
            <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link
          to={Routes.DayTradingSimulator}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'group h-auto min-h-0 w-full flex-col items-stretch justify-between gap-3 whitespace-normal p-4 text-left hover:border-primary/50'
          )}
        >
          <span className="flex items-start gap-3">
            <IconRosetteDiscount className="mt-0.5 size-5 shrink-0" />
            <span className="min-w-0">
              <span className="block font-medium">
                {m.home_simulator_card_2_title()}
              </span>
              <span className="text-muted-foreground mt-1 block text-xs leading-5 font-normal">
                {m.home_simulator_card_2_description()}
              </span>
            </span>
          </span>
          <span className="text-primary flex items-center gap-1 pl-8 text-xs font-medium">
            {m.home_simulator_card_2_action()}
            <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
