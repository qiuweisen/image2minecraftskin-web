import blogRedirects from '@/config/chartmini-blog-redirects.json' with {
  type: 'json',
};

const blogRedirectMap = new Map(
  blogRedirects.map((redirect) => [redirect.source, redirect.destination])
);

function withoutTrailingSlash(pathname: string): string {
  if (pathname.length <= 1) return pathname;
  return pathname.replace(/\/+$/, '');
}

function redirectResponse(requestUrl: URL, destinationPath: string): Response {
  const destination = new URL(destinationPath, requestUrl.origin);
  if (!destination.search && requestUrl.search) {
    destination.search = requestUrl.search;
  }
  return Response.redirect(destination, 301);
}

/**
 * Redirects that existed on the current ChartMini site and must remain valid
 * after the TanStarter migration. This runs before the router so old URLs
 * never become framework-level 404s.
 */
export function getChartMiniLegacyRedirect(request: Request): Response | null {
  const requestUrl = new URL(request.url);
  const pathname = withoutTrailingSlash(requestUrl.pathname);

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const destinationPath = pathname.slice('/en'.length) || '/';
    return redirectResponse(requestUrl, destinationPath);
  }

  // The original ChartMini site uses /zh-hans for Simplified Chinese.
  // Redirect the migration-only /zh alias so search engines keep one URL.
  if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    const destinationPath = `/zh-hans${pathname.slice('/zh'.length) || ''}`;
    return redirectResponse(requestUrl, destinationPath);
  }

  const blogRedirect = blogRedirectMap.get(pathname);
  if (blogRedirect) {
    return redirectResponse(requestUrl, blogRedirect);
  }

  const blogPageMatch = pathname.match(/^\/blog\/page\/(\d+)$/);
  if (blogPageMatch) {
    const page = Number(blogPageMatch[1]);
    return redirectResponse(
      requestUrl,
      page === 1 ? '/blog' : `/blog/p/${page}`
    );
  }

  if (pathname === '/blog') {
    const page =
      requestUrl.searchParams.get('page') ?? requestUrl.searchParams.get('p');
    const pageNumber = page ? Number(page) : NaN;
    if (Number.isInteger(pageNumber) && pageNumber >= 2) {
      return redirectResponse(requestUrl, `/blog/p/${pageNumber}`);
    }
  }

  return null;
}
