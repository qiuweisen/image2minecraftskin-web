import blogManifest from '@/generated/blog-manifest.json';
import { websiteConfig } from '@/config/website';
import { baseLocale, getLocale, type Locale } from '@/lib/locale';

export type BlogPost = {
  slug: string;
  fileSlug: string;
  contentKey: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  category: string;
  categories?: string[];
  tags?: string[];
  image?: string;
  pinned?: boolean;
  indexable?: boolean;
  noindex?: boolean;
  redirectTo?: string;
  content?: string;
};

const DEFAULT_PAGE_SIZE = 6;
const allPosts = blogManifest as unknown as BlogPost[];

function isRoutablePost(post: BlogPost): boolean {
  return !post.redirectTo;
}

export function isIndexablePost(post: BlogPost): boolean {
  return (
    isRoutablePost(post) && post.noindex !== true && post.indexable !== false
  );
}

function getPageSize(): number {
  return websiteConfig.blog?.paginationSize ?? DEFAULT_PAGE_SIZE;
}

function getPostsForLocale(locale: Locale): BlogPost[] {
  const localized = allPosts.filter(
    (post) => post.locale === locale && isRoutablePost(post)
  );
  if (localized.length > 0 || locale === baseLocale) return localized;
  return allPosts.filter(
    (post) => post.locale === baseLocale && isRoutablePost(post)
  );
}

export function getSortedPosts(locale: Locale = getLocale()): BlogPost[] {
  return [...getPostsForLocale(locale)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(
  slug: string,
  locale: Locale = getLocale()
): BlogPost | undefined {
  return (
    allPosts.find(
      (post) =>
        post.slug === slug && post.locale === locale && isRoutablePost(post)
    ) ??
    allPosts.find(
      (post) =>
        post.slug === slug && post.locale === baseLocale && isRoutablePost(post)
    )
  );
}

export function getPaginatedPosts(page: number): {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
} {
  const pageSize = getPageSize();
  const sorted = getSortedPosts();
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  return {
    posts: sorted.slice(start, start + pageSize),
    totalPages,
    currentPage,
  };
}
