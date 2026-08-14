import { m } from '@/locale/paraglide/messages';
import { createFileRoute, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { BlogGrid } from '@/components/blog/blog-grid';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { loadBlogPage } from '@/api/blog';
import { websiteConfig } from '@/config/website';
import { jsonLdScript, seo, siteStructuredData } from '@/lib/seo';
import { getCanonicalUrlForLocale } from '@/lib/urls';
import { getCanonicalLocale, getLocale } from '@/lib/locale';

export const Route = createFileRoute('/blog/')({
  validateSearch: (search: Record<string, unknown>) => ({
    page:
      typeof search.page === 'number'
        ? search.page
        : typeof search.page === 'string'
          ? Number(search.page) || undefined
          : undefined,
  }),
  loader: async ({ location }) => {
    const page = Number(new URLSearchParams(location.search).get('page')) || 1;
    return loadBlogPage({ data: { page } });
  },
  head: ({ loaderData }) => {
    const path = '/blog';
    const currentPage = loaderData?.currentPage ?? 1;
    const totalPages = loaderData?.totalPages ?? 1;
    const pageSuffix = currentPage > 1 ? ` - Page ${currentPage}` : '';
    const isEnglish = getCanonicalLocale(getLocale()) === 'en';
    const title = isEnglish
      ? `Trading Blog - Forex, Stocks & Crypto Trading Tips${pageSuffix} | ChartMini`
      : `${m.blog_title()}${pageSuffix} | ${websiteConfig.metadata?.name}`;
    const description = isEnglish
      ? `Learn trading strategies, forex basics, chart reading and more. Free trading education from ChartMini's simulator team.${currentPage > 1 ? ` Page ${currentPage}.` : ''}`
      : m.blog_description();
    const metadata = seo(path, {
      title,
      description,
    });
    // Pass the current locale explicitly so canonical/prev/next are stable
    // across SSR + CSR regardless of any mid-render locale swap.
    const localizedUrl = (page?: number) => {
      if (page && page > 1) {
        return getCanonicalUrlForLocale(`/blog/p/${page}`, getLocale());
      }
      return getCanonicalUrlForLocale(path, getLocale());
    };
    const canonicalHref = localizedUrl(currentPage);
    const paginationLinks: Array<{
      rel: string;
      href: string;
    }> = [{ rel: 'canonical', href: canonicalHref }];
    if (currentPage > 1) {
      paginationLinks.push({
        rel: 'prev',
        href: localizedUrl(currentPage - 1),
      });
    }
    if (currentPage < totalPages) {
      paginationLinks.push({
        rel: 'next',
        href: localizedUrl(currentPage + 1),
      });
    }
    return {
      ...metadata,
      links: [
        ...paginationLinks,
        ...metadata.links.filter((link) => link.rel !== 'canonical'),
      ],
      scripts: [jsonLdScript(siteStructuredData())],
    };
  },
  component: BlogListPage,
});

function BlogListPage() {
  const { posts, totalPages, currentPage } = Route.useLoaderData();
  if (!websiteConfig.blog?.enable) {
    throw notFound();
  }
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {m.blog_title()}
          </h1>
          <p className="text-muted-foreground text-lg">
            {m.blog_description()}
          </p>
        </div>
        <BlogGrid posts={posts} />
        <BlogPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </Container>
  );
}
