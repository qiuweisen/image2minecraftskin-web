import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
export default function StatsSection() {
  const stats = [
    { value: m.home_stats_value_1(), label: m.home_stats_items_item_1_title() },
    { value: m.home_stats_value_2(), label: m.home_stats_items_item_2_title() },
    { value: m.home_stats_value_3(), label: m.home_stats_items_item_3_title() },
    { value: m.home_stats_value_4(), label: m.home_stats_items_item_4_title() },
  ];

  return (
    <section id="stats" className="px-4 py-8 md:py-10">
      <Container className="px-2">
        <ScrollReveal>
          <Card>
            <CardContent className="grid p-0 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center gap-2 border-b p-6 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-r lg:last:border-r-0"
                >
                  <div className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
                    {stat.value}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </ScrollReveal>
      </Container>
    </section>
  );
}
