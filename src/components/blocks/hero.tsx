import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
export default function HeroSection() {
  return (
    <section id="hero" className="overflow-hidden">
      <Container className="px-4 py-8 md:py-12 lg:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-6 gap-2 px-3 py-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary"
            />
            {m.home_hero_introduction()}
          </Badge>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-5xl">
            <span className="block">{m.home_hero_title_line_1()}</span>
            <span className="mt-2 block text-muted-foreground">
              {m.home_hero_title_line_2()}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {m.home_hero_description()}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/play"
              className={buttonVariants({ size: 'lg' })}
              aria-label={m.home_hero_primary_aria()}
            >
              {m.home_hero_primary()}
            </Link>
            <Link
              to="/day-trading-simulator"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
              aria-label={m.home_hero_secondary_aria()}
            >
              {m.home_hero_secondary()}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
