import { m } from '@/locale/paraglide/messages';
import { getFooterLinks } from '@/config/footer-config';
import { isLinkActive } from '@/lib/urls';
import { cn } from '@/lib/utils';
import Container from '@/components/layout/container';
import { Logo } from '@/components/shared/logo';
import { Link, useLocation } from '@tanstack/react-router';
import { websiteConfig } from '@/config/website';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = useLocation().pathname;
  const footerLinks = getFooterLinks();

  return (
    <footer className={cn('border-t', className)}>
      <Container className="px-4">
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-6">
          <div className="col-span-full flex flex-col items-start md:col-span-2">
            <Logo className="h-7 w-auto" />
            <p className="py-2 text-base text-muted-foreground md:pr-12">
              {m.footer_tagline()}
            </p>
          </div>

          {footerLinks.map((section) => (
            <div
              key={section.title}
              className="col-span-1 flex flex-col items-start"
            >
              <span className="text-sm font-semibold uppercase">
                {section.title}
              </span>
              <ul className="mt-4 list-inside space-y-3">
                {section.items?.map(
                  (item) =>
                    item.href && (
                      <li key={`${section.title}-${item.title}`}>
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="sponsored nofollow noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:text-primary"
                          >
                            {item.title}
                          </a>
                        ) : item.baseLocaleOnly ? (
                          <a
                            href={item.href}
                            className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:text-primary"
                          >
                            {item.title}
                          </a>
                        ) : (
                          <Link
                            to={item.href}
                            data-active={
                              item.href.includes('#')
                                ? undefined
                                : isLinkActive(item.href, pathname)
                                  ? 'true'
                                  : undefined
                            }
                            className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:text-primary data-[active=true]:font-semibold data-[active=true]:text-primary"
                          >
                            {item.title}
                          </Link>
                        )}
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t">
        <Container className="px-4 py-6">
          <p className="text-xs leading-5 text-muted-foreground">
            {m.footer_risk_disclosure()}
          </p>
        </Container>
      </div>

      <div className="border-t py-8">
        <Container className="flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {websiteConfig.metadata?.name}.{' '}
            {m.footer_rights_reserved()}
          </span>
          <span className="text-xs text-muted-foreground">
            {m.footer_made_for_traders()}
          </span>
        </Container>
      </div>
    </footer>
  );
}
