import type { SVGProps } from 'react';
import LegacyLogo from '@/components/Logo';
import { cn } from '@/lib/utils';

/** Theme-aware ChartMini wordmark shared by the TanStarter shell. */
export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <LegacyLogo
      {...props}
      role={props.role ?? 'img'}
      aria-label={props['aria-label'] ?? 'ChartMini'}
      className={cn('h-8 w-auto shrink-0', className)}
    />
  );
}
