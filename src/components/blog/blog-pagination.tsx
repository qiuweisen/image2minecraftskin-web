import { m } from '@/locale/paraglide/messages';
export function BlogPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label={m.blog_pagination()}
    >
      {currentPage > 1 ? (
        <a
          href={prevPage <= 1 ? '/blog' : `/blog/p/${prevPage}`}
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {m.blog_previous()}
        </a>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm">
          {m.blog_previous()}
        </span>
      )}
      <span className="px-2 text-muted-foreground text-sm">
        {m.blog_page()} {currentPage} {m.blog_of()} {totalPages}
      </span>
      {currentPage < totalPages ? (
        <a
          href={`/blog/p/${nextPage}`}
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {m.blog_next()}
        </a>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm">
          {m.blog_next()}
        </span>
      )}
    </nav>
  );
}
