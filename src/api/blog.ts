import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { getPostBySlug } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';

const blogPostSchema = z.object({ slug: z.string().min(1).max(200) });

function stripFrontmatter(markdown: string): string {
  if (!markdown.startsWith('---')) return markdown;
  const end = markdown.indexOf('\n---', 3);
  if (end < 0) return markdown;
  return markdown.slice(end + 4).replace(/^\s+/, '');
}

function extractBlogContent(markdown: string) {
  const rawContent = stripFrontmatter(markdown);
  const schemas: string[] = [];
  const scriptRegex =
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  let match = scriptRegex.exec(rawContent);
  while (match !== null) {
    const schema = match[1]?.trim();
    if (schema) schemas.push(schema);
    match = scriptRegex.exec(rawContent);
  }

  // Schema and editorial comments belong in the document head or source file,
  // not in the visible article prose. This mirrors the production blog
  // renderer and keeps the synced markdown body safe to SSR.
  const content = rawContent
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gim, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  return { content, schemas };
}

export const loadBlogPost = createServerFn({ method: 'GET' })
  .validator(blogPostSchema)
  .handler(async ({ data }) => {
    const post = getPostBySlug(data.slug);
    if (!post) return null;

    const object = await env.BUCKET.get(post.contentKey);
    if (!object?.body) return null;

    const markdown = await new Response(object.body).text();
    const { content, schemas } = extractBlogContent(markdown);
    const contentHtml = (await renderMarkdown(content)).markup;

    // Return the rendered body instead of the raw markdown. That keeps the
    // article in the initial SSR HTML without duplicating a large markdown
    // payload in the hydration data sent to the browser.
    return { ...post, contentHtml, schemas };
  });
