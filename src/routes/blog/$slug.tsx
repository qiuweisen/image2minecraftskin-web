import { m } from '@/locale/paraglide/messages';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { loadBlogPost } from '@/api/blog';
import Container from '@/components/layout/container';
import { websiteConfig } from '@/config/website';
import { getCanonicalUrl, getImageUrl } from '@/lib/urls';
import { getCanonicalLocale, getLocale, localeConfig } from '@/lib/locale';
import { jsonLdScript, seo, siteStructuredData } from '@/lib/seo';
import { IconArrowLeft } from '@tabler/icons-react';
import { formatDate } from '@/lib/formatter';
import { PracticeModesCard } from '@/components/blog/practice-modes-card';
import { splitBlogContentForPracticeCard } from '@/lib/blog-content';

function scriptJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function schemaTypes(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as {
      '@type'?: string | string[];
      '@graph'?: Array<{ '@type'?: string | string[] }>;
    };
    const direct = Array.isArray(parsed['@type'])
      ? parsed['@type']
      : [parsed['@type']];
    const graph = Array.isArray(parsed['@graph'])
      ? parsed['@graph'].flatMap((item) =>
          Array.isArray(item?.['@type']) ? item['@type'] : [item?.['@type']]
        )
      : [];
    return [...direct, ...graph].filter(
      (type): type is string => typeof type === 'string'
    );
  } catch {
    return [];
  }
}

function shouldRenderLegacySchema(value: string) {
  const types = schemaTypes(value);
  // Keep only schemas that describe visible FAQ/content structures. The
  // production route generates BlogPosting and BreadcrumbList itself, so old
  // Article schemas from legacy markdown must not create duplicates.
  return types.some((type) => ['FAQPage', 'ItemList', 'HowTo'].includes(type));
}

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await loadBlogPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    const post = loaderData;
    if (!post) return {};
    const path = `/blog/${params.slug}`;
    const title = `${post.metaTitle ?? post.title} | ${websiteConfig.metadata?.name} Blog`;
    const description =
      post.description ?? websiteConfig.metadata?.description ?? '';
    const image = post.image ? getImageUrl(post.image) : undefined;
    const canonicalUrl = getCanonicalUrl(path);
    const metadata = seo(path, {
      title,
      description,
      image,
      type: 'article',
    });
    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      inLanguage: localeConfig[getCanonicalLocale(getLocale())].hreflang,
      ...(image && { image }),
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.dateModified ?? post.date).toISOString(),
      url: canonicalUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      author: {
        '@type': 'Person',
        name: 'Iven W.',
        url: getCanonicalUrl('/about'),
      },
      publisher: {
        '@type': 'Organization',
        name: websiteConfig.metadata?.name ?? '',
        logo: {
          '@type': 'ImageObject',
          url: getImageUrl('/logo.png'),
        },
      },
      articleSection: post.categories,
      keywords: post.tags?.join(', '),
    };
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: getCanonicalUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: getCanonicalUrl('/blog'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    };
    const authorJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Iven W.',
      url: getCanonicalUrl('/about'),
      jobTitle: 'Founder & Developer',
      description:
        'MBA and active trader since 2007 with nearly two decades of experience. Built ChartMini — a lightweight trading simulator for focused practice.',
      sameAs: ['https://www.linkedin.com/in/ivenwg'],
      worksFor: {
        '@type': 'Organization',
        name: 'ChartMini',
        url: getCanonicalUrl('/'),
      },
    };
    const legacySchemas = (post.schemas ?? [])
      .filter(shouldRenderLegacySchema)
      .map((schema) => {
        try {
          return JSON.parse(schema) as Record<string, unknown>;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    return {
      ...metadata,
      ...(post.noindex === true || post.indexable === false
        ? {
            meta: [
              ...(metadata.meta ?? []),
              { name: 'robots', content: 'noindex, follow' },
            ],
          }
        : {}),
      scripts: [
        {
          type: 'application/ld+json',
          children: scriptJson(articleJsonLd),
        },
        {
          type: 'application/ld+json',
          children: scriptJson(breadcrumbJsonLd),
        },
        {
          type: 'application/ld+json',
          children: scriptJson(authorJsonLd),
        },
        ...legacySchemas.map((schema) => ({
          type: 'application/ld+json',
          children: scriptJson(schema),
        })),
        jsonLdScript(siteStructuredData()),
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  if (!post || !websiteConfig.blog?.enable) throw notFound();
  const content = splitBlogContentForPracticeCard(post.contentHtml);
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/blog"
          search={{ page: 1 }}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        >
          <IconArrowLeft className="size-4" />
          {m.blog_all_posts()}
        </Link>

        <article>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium capitalize">
              {post.category}
            </span>
            <span>{formatDate(new Date(post.date))}</span>
            {post.dateModified && post.dateModified !== post.date ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated:{' '}
                  <time dateTime={post.dateModified}>
                    {formatDate(new Date(post.dateModified))}
                  </time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>
              By{' '}
              <Link to="/about" className="font-medium hover:underline">
                Iven W.
              </Link>
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

          {post.description && (
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {post.description}
            </p>
          )}

          <div className="mt-6 pt-10 border-t border-border">
            {content.before ? (
              <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content.before }}
              />
            ) : null}

            <PracticeModesCard />

            {content.after ? (
              <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content.after }}
              />
            ) : null}
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <Link
              to="/blog"
              search={{ page: 1 }}
              className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
              {m.blog_all_posts()}
            </Link>
          </div>
        </article>
      </div>
    </Container>
  );
}
