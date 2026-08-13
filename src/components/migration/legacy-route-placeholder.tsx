import Container from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type LegacyRoutePlaceholderProps = {
  title: string;
  description: string;
};

/**
 * Temporary staging-only shell used while the original ChartMini page is
 * being ported. It is intentionally explicit so this cannot be mistaken for
 * a production-complete page during v2 review.
 */
export function LegacyRoutePlaceholder({
  title,
  description,
}: LegacyRoutePlaceholderProps) {
  return (
    <Container className="py-16 px-4">
      <main className="mx-auto max-w-3xl" data-migration-status="scaffold">
        <Card>
          <CardHeader className="items-center text-center">
            <Badge variant="outline">ChartMini v2 migration scaffold</Badge>
            <CardTitle className="pt-2 text-4xl tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-base leading-8">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              The original page and simulator workflow are being ported behind
              this URL-compatible shell. This staging page is blocked from
              indexing.
            </p>
          </CardContent>
        </Card>
      </main>
    </Container>
  );
}
