import { defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

function getLocaleSlug(path: string) {
  const localeMatch = path.match(
    /^(?<slug>.+)\.(?<locale>en|zh|zh-hans|zh-hant)$/
  );
  if (localeMatch?.groups) {
    // Existing migrated legal/changelog files use `.zh.md`; keep those
    // files attached to the original Simplified Chinese `/zh-hans` locale.
    const locale =
      localeMatch.groups.locale === 'zh'
        ? 'zh-hans'
        : localeMatch.groups.locale;
    return {
      locale,
      slug: localeMatch.groups.slug,
    };
  }
  return { locale: 'en', slug: path };
}

const pages = defineCollection({
  name: 'pages',
  directory: 'content/pages',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
    content: z.string(),
  }),
  transform: (doc) => {
    const { locale, slug } = getLocaleSlug(
      (doc as { _meta: { path: string } })._meta.path
    );
    return { ...doc, locale, slug };
  },
});

const changelog = defineCollection({
  name: 'changelog',
  directory: 'content/changelog',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    version: z.string(),
    published: z.boolean().default(true),
    content: z.string(),
  }),
  transform: (doc) => {
    const { locale, slug } = getLocaleSlug(
      (doc as { _meta: { path: string } })._meta.path
    );
    return { ...doc, locale, slug };
  },
});

export default defineConfig({
  // Blog Markdown is uploaded to R2 during deployment. Keeping article bodies
  // out of Content Collections prevents the Worker bundle from exceeding the
  // Cloudflare free-plan 3 MiB script limit.
  collections: [pages, changelog],
});
