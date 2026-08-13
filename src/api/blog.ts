import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { getPostBySlug } from '@/lib/blog';

const blogPostSchema = z.object({ slug: z.string().min(1).max(200) });

function stripFrontmatter(markdown: string): string {
  if (!markdown.startsWith('---')) return markdown;
  const end = markdown.indexOf('\n---', 3);
  if (end < 0) return markdown;
  return markdown.slice(end + 4).replace(/^\s+/, '');
}

export const loadBlogPost = createServerFn({ method: 'GET' })
  .validator(blogPostSchema)
  .handler(async ({ data }) => {
    const post = getPostBySlug(data.slug);
    if (!post) return null;

    const object = await env.BUCKET.get(post.contentKey);
    if (!object?.body) return null;

    const markdown = await new Response(object.body).text();
    return { ...post, content: stripFrontmatter(markdown) };
  });
