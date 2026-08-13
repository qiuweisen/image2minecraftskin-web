import { Link } from '@tanstack/react-router';
import { localeConfig, localizeHref, selectableLocales } from '@/lib/locale';
import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function LanguagesPage() {
  const entries = selectableLocales.map((locale) => ({
    code: locale,
    href: localizeHref('/', { locale }),
    name: localeConfig[locale].name,
  }));

  return (
    <Container className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <HeaderSection
          subtitle={m.languages_title()}
          subtitleAs="h1"
          description={m.languages_description()}
          className="mb-8 items-start text-left"
          subtitleClassName="text-4xl font-semibold tracking-tight"
          descriptionClassName="text-base leading-7"
        />
        <Card>
          <CardContent className="p-6 sm:p-8">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {entries.map(({ code, href, name }) => (
                <li key={code}>
                  <Link
                    to={href}
                    className={cn(
                      'block border border-border bg-background px-3 py-2 text-sm transition-colors',
                      'hover:border-primary hover:bg-muted focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50'
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>{name}</span>
                      <span className="text-xs uppercase text-muted-foreground">
                        {code}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
