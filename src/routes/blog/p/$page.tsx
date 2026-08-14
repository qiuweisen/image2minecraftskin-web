import { m } from '@/locale/paraglide/messages';
import { createFileRoute, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { BlogGrid } from '@/components/blog/blog-grid';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { loadBlogPage } from '@/api/blog';
import { websiteConfig } from '@/config/website';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { getCanonicalLocale, getLocale } from '@/lib/locale';

export const Route = createFileRoute('/blog/p/$page')({
  loader: async ({ params }) => {
    const page = Number(params.page);
    if (!Number.isInteger(page) || page < 2) throw notFound();

    const result = await loadBlogPage({ data: { page } });
    if (result.currentPage !== page) throw notFound();
    return result;
  },
  head: ({ loaderData, params }) => {
    const page = loaderData?.currentPage ?? Number(params.page);
    const isEnglish = getCanonicalLocale(getLocale()) === 'en';
    const title = isEnglish
      ? `Trading Blog - Page ${page} | ChartMini`
      : `${m.blog_title()} - Page ${page} | ${websiteConfig.metadata?.name}`;
    const description = isEnglish
      ? `Learn trading strategies, forex basics, chart reading and more. Free trading education from ChartMini's simulator team. Page ${page}.`
      : m.blog_description();
    const metadata = seo(`/blog/p/${params.page}`, {
      title,
      description,
    });
    const links = [
      ...metadata.links.filter((link) => link.rel !== 'canonical'),
      { rel: 'canonical', href: getCanonicalUrl(`/blog/p/${page}`) },
    ];
    if (page > 2) {
      links.push({ rel: 'prev', href: getCanonicalUrl(`/blog/p/${page - 1}`) });
    } else {
      links.push({ rel: 'prev', href: getCanonicalUrl('/blog') });
    }
    if (loaderData && page < loaderData.totalPages) {
      links.push({ rel: 'next', href: getCanonicalUrl(`/blog/p/${page + 1}`) });
    }
    return { ...metadata, links };
  },
  component: BlogPagedPage,
});

function BlogPagedPage() {
  const { posts, totalPages, currentPage } = Route.useLoaderData();
  if (!websiteConfig.blog?.enable) throw notFound();

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {m.blog_title()} - Page {currentPage}
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
