import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { IconArrowRight } from '@tabler/icons-react';
export default function CallToActionSection() {
  return (
    <section id="call-to-action" className="px-4 py-16 md:py-24">
      <Container className="px-2">
        <ScrollReveal>
          <Card className="mx-auto max-w-5xl border border-border/70 bg-background/60 text-foreground shadow-lg shadow-foreground/5 backdrop-blur-xl dark:bg-background/50 dark:shadow-black/20">
            <CardContent className="flex flex-col items-start gap-8 p-6 sm:p-10 md:flex-row md:items-center md:justify-between md:p-12">
              <div className="max-w-2xl">
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {m.home_call_to_action_title()}
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                  {m.home_call_to_action_description()}
                </p>
              </div>
              <Link
                to="/play"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                  'shrink-0 gap-2'
                )}
              >
                {m.home_call_to_action_primary_button()}
                <IconArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </ScrollReveal>
      </Container>
    </section>
  );
}
