import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ContentSection() {
  return (
    <section id="content" className="px-4 py-16 md:py-24">
      <Container className="px-2">
        <ScrollReveal>
          <Card className="mx-auto max-w-4xl">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                {m.home_body_title()}
              </h2>
            </CardHeader>
            <CardContent className="space-y-5 p-6 text-base leading-7 text-muted-foreground sm:p-8">
              <p>{m.home_body_paragraph_1()}</p>
              <p>{m.home_body_paragraph_2()}</p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </Container>
    </section>
  );
}
