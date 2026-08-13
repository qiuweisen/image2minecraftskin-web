const featuredBadges = [
  {
    type: 'compact',
    href: 'https://firstlook.tools',
    image: '/badges/firstlook-logo.png',
    label: 'Featured on',
    name: 'FirstLook.Tools',
  },
  {
    type: 'compact',
    href: 'https://deeplaunch.io',
    image: '/badges/deeplaunch-logo.png',
    label: 'Featured on',
    name: 'DeepLaunch.io',
  },
  {
    type: 'compact',
    href: 'https://twelve.tools',
    image: '/badges/twelve-tools-logo.svg',
    label: 'Featured on',
    name: 'Twelve Tools',
  },
  {
    type: 'compact',
    href: 'https://showmebest.ai',
    image: '/badges/showmebestai-logo.png',
    label: 'Featured on',
    name: 'ShowMeBestAI',
  },
  {
    type: 'compact',
    href: 'https://www.tinystartups.com/startup/chartmini-2',
    image: '/badges/tiny-startups-icon.svg',
    label: 'Launched on',
    name: 'Tiny Startups',
    ariaLabel: 'Launched on Tiny Startups',
  },
  {
    type: 'image',
    href: 'https://www.tooluck.org/item/chartmini',
    image: '/badges/tooluck-badge-light.svg',
    alt: 'Featured on Tooluck.org',
    width: 96,
    height: 25,
    ariaLabel: 'Featured on Tooluck.org',
  },
  {
    type: 'image',
    href: 'https://www.betterlaunch.co',
    image: '/badges/betterlaunch-badge.svg',
    alt: 'Featured on Better Launch',
    width: 89,
    height: 25,
    ariaLabel: 'Featured on Better Launch',
  },
  {
    type: 'image',
    href: 'https://wired.business',
    image: '/badges/wired-business-badge-dark.svg',
    alt: 'Featured on Wired Business',
    width: 93,
    height: 25,
    ariaLabel: 'Featured on Wired Business',
  },
  {
    type: 'image',
    href: 'https://ufind.best/products/chartmini?utm_source=ufind.best',
    image: '/badges/ufind-best-badge-light.svg',
    alt: 'Featured on ufind.best',
    width: 79,
    height: 25,
    ariaLabel: 'Featured on ufind.best',
  },
  {
    type: 'image',
    href: 'https://www.foundrlist.com/product/chartmini?utm_source=badge&utm_medium=embed',
    image: '/badges/foundrlist-badge.svg',
    alt: 'Featured on FoundrList',
    width: 78,
    height: 25,
    ariaLabel: 'Featured on FoundrList',
  },
  {
    type: 'image',
    href: 'https://huntfortools.com',
    image: '/badges/huntfortools-badge.png',
    alt: 'Hunt for Tools',
    width: 87,
    height: 25,
    ariaLabel: 'Hunt for Tools',
  },
  {
    type: 'image',
    href: 'https://acidtools.com',
    image: '/badges/acidtools-badge.png',
    alt: 'Acid Tools',
    width: 87,
    height: 25,
    ariaLabel: 'Acid Tools',
  },
  {
    type: 'image',
    href: 'https://startupfa.me/s/chartmini.com-968?utm_source=chartmini.com',
    image: '/badges/startupfame-badge.webp',
    alt: 'ChartMini - Featured on Startup Fame',
    width: 79,
    height: 25,
    ariaLabel: 'Featured on Startup Fame',
  },
  {
    type: 'image',
    href: 'https://marketingdb.live',
    image: '/badges/marketingdb-badge-light.svg',
    alt: 'Listed on MarketingDB',
    width: 87,
    height: 25,
    ariaLabel: 'Listed on MarketingDB',
  },
  {
    type: 'image',
    href: 'https://turbo0.com/item/chartmini',
    image: '/badges/turbo0-badge-listed-light.svg',
    alt: 'Listed on Turbo0',
    width: 75,
    height: 25,
    ariaLabel: 'Listed on Turbo0',
  },
  {
    type: 'image',
    href: 'https://uno.directory',
    image: '/badges/uno-directory.svg',
    alt: 'Listed on Uno Directory',
    width: 100,
    height: 25,
    ariaLabel: 'Listed on Uno Directory',
  },
  {
    type: 'image',
    href: 'https://domainrank.app',
    image: '/badges/domainrank-badge.svg',
    alt: 'chartmini.com Domain Rating',
    width: 100,
    height: 25,
    ariaLabel: 'chartmini.com Domain Rating',
  },
  {
    type: 'image',
    href: 'https://findly.tools/chartmini?utm_source=chartmini',
    image: '/badges/findly-tools-badge-light.svg',
    alt: 'Featured on Findly.tools',
    width: 80,
    height: 25,
    ariaLabel: 'Featured on Findly.tools',
  },
  {
    type: 'image',
    href: 'https://dofollow.tools',
    image: '/badges/dofollow-badge.svg',
    alt: 'Featured on Dofollow.Tools',
    width: 93,
    height: 25,
    ariaLabel: 'Featured on Dofollow.Tools',
  },
  {
    type: 'image',
    href: 'https://toolfame.com/item/chartmini',
    image: '/badges/toolfame-badge-light.svg',
    alt: 'Featured on toolfame.com',
    width: 93,
    height: 25,
    ariaLabel: 'Featured on toolfame.com',
  },
] as const;

function FeaturedBadge({
  badge,
  duplicate = false,
}: {
  badge: (typeof featuredBadges)[number];
  duplicate?: boolean;
}) {
  if (badge.type === 'image') {
    return (
      <a
        href={badge.href}
        target="_blank"
        rel="nofollow noopener noreferrer"
        tabIndex={duplicate ? -1 : undefined}
        aria-label={badge.ariaLabel}
        className="inline-flex shrink-0 items-center no-underline transition-opacity hover:opacity-90 hover:no-underline"
      >
        <img
          src={badge.image}
          alt={badge.alt}
          width={badge.width}
          height={badge.height}
          decoding="async"
          loading="lazy"
          className="h-[25px] shrink-0"
          style={{ width: badge.width, height: badge.height }}
        />
      </a>
    );
  }

  const ariaLabel =
    'ariaLabel' in badge ? badge.ariaLabel : `${badge.label} ${badge.name}`;

  return (
    <a
      href={badge.href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      aria-label={ariaLabel}
      className="inline-flex shrink-0 items-center gap-2 no-underline transition-opacity hover:opacity-90 hover:no-underline"
    >
      <img
        src={badge.image}
        alt=""
        aria-hidden="true"
        width={25}
        height={25}
        decoding="async"
        loading="lazy"
        className="size-[25px] shrink-0"
      />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {badge.label}
        </span>
        <span className="mt-0.5 text-[10px] font-bold text-foreground md:text-[11px]">
          {badge.name}
        </span>
      </span>
    </a>
  );
}

function FeaturedBadgeItems({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <>
      {featuredBadges.map((badge) => (
        <FeaturedBadge key={badge.href} badge={badge} duplicate={duplicate} />
      ))}
    </>
  );
}

export default function FeaturedBadgesSection() {
  return (
    <section
      id="featured-badges"
      aria-label="Featured on"
      className="border-t py-8 md:py-10"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="featured-badge-marquee overflow-hidden">
          <div className="featured-badge-marquee__track flex w-max items-center">
            <div className="featured-badge-marquee__group flex shrink-0 items-center gap-4 pr-4">
              <FeaturedBadgeItems />
            </div>
            <div
              className="featured-badge-marquee__group flex shrink-0 items-center gap-4 pr-4"
              aria-hidden="true"
            >
              <FeaturedBadgeItems duplicate />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
