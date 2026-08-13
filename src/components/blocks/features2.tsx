import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconChartBar,
  IconReportAnalytics,
  IconTarget,
} from '@tabler/icons-react';
export default function Features2Section() {
  const steps = [
    {
      icon: IconTarget,
      title: m.home_how_it_works_step_1_title(),
      description: m.home_how_it_works_step_1_description(),
    },
    {
      icon: IconChartBar,
      title: m.home_how_it_works_step_2_title(),
      description: m.home_how_it_works_step_2_description(),
    },
    {
      icon: IconReportAnalytics,
      title: m.home_how_it_works_step_3_title(),
      description: m.home_how_it_works_step_3_description(),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-y bg-muted/20 px-4 py-16 md:py-24"
    >
      <Container className="space-y-10 px-2 lg:space-y-14">
        <ScrollReveal>
          <HeaderSection
            titleAs="h2"
            title={m.home_how_it_works_title()}
            className="items-start text-left"
          />
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <Card key={step.title} className="h-full bg-background">
                  <CardHeader className="gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/60">
                        <StepIcon className="size-5" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium tabular-nums text-muted-foreground">
                        0{index + 1}
                      </span>
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="leading-6 text-muted-foreground">
                    {step.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
