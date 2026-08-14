import { useCallback, useEffect, useRef, useState } from 'react';
import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { useTheme } from '@/components/theme/theme-provider';
import { HeaderSection } from '@/components/shared/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { useInView } from '@/hooks/use-in-view';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import type { Icon } from '@tabler/icons-react';
import {
  IconArrowsExchange,
  IconArrowUpRight,
  IconCoinBitcoin,
  IconHistory,
  IconTarget,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

const FEATURE_AUTOPLAY_MS = 4500;

const featureVisuals = [
  {
    dark: '/images/simulators/market-replay-dark.webp',
    light: '/images/simulators/market-replay-light.webp',
    darkSrcSet:
      '/images/simulators/market-replay-dark-480.webp 480w, /images/simulators/market-replay-dark-600.webp 600w, /images/simulators/market-replay-dark-768.webp 768w, /images/simulators/market-replay-dark.webp 1200w',
    lightSrcSet:
      '/images/simulators/market-replay-light-480.webp 480w, /images/simulators/market-replay-light-600.webp 600w, /images/simulators/market-replay-light-768.webp 768w, /images/simulators/market-replay-light.webp 1200w',
  },
  {
    dark: '/images/simulators/intraday-practice-dark.webp',
    light: '/images/simulators/intraday-practice-light.webp',
    darkSrcSet:
      '/images/simulators/intraday-practice-dark-480.webp 480w, /images/simulators/intraday-practice-dark-600.webp 600w, /images/simulators/intraday-practice-dark-768.webp 768w, /images/simulators/intraday-practice-dark.webp 1200w',
    lightSrcSet:
      '/images/simulators/intraday-practice-light-480.webp 480w, /images/simulators/intraday-practice-light-600.webp 600w, /images/simulators/intraday-practice-light-768.webp 768w, /images/simulators/intraday-practice-light.webp 1200w',
  },
  {
    dark: '/images/simulators/forex-simulator-dark.webp',
    light: '/images/simulators/forex-simulator-light.webp',
    darkSrcSet:
      '/images/simulators/forex-simulator-dark-480.webp 480w, /images/simulators/forex-simulator-dark-600.webp 600w, /images/simulators/forex-simulator-dark-768.webp 768w, /images/simulators/forex-simulator-dark.webp 1200w',
    lightSrcSet:
      '/images/simulators/forex-simulator-light-480.webp 480w, /images/simulators/forex-simulator-light-600.webp 600w, /images/simulators/forex-simulator-light-768.webp 768w, /images/simulators/forex-simulator-light.webp 1200w',
  },
  {
    dark: '/images/simulators/crypto-simulator-dark.webp',
    light: '/images/simulators/crypto-simulator-light.webp',
    darkSrcSet:
      '/images/simulators/crypto-simulator-dark-480.webp 480w, /images/simulators/crypto-simulator-dark-600.webp 600w, /images/simulators/crypto-simulator-dark-768.webp 768w, /images/simulators/crypto-simulator-dark.webp 1200w',
    lightSrcSet:
      '/images/simulators/crypto-simulator-light-480.webp 480w, /images/simulators/crypto-simulator-light-600.webp 600w, /images/simulators/crypto-simulator-light-768.webp 768w, /images/simulators/crypto-simulator-light.webp 1200w',
  },
] as const;

type FeatureItem = {
  title: string;
  description: string;
  icon: Icon;
  href?: string;
  action?: string;
};

export default function FeaturesSection() {
  const featureItems: FeatureItem[] = [
    {
      title: m.home_simulator_card_1_title(),
      description: m.home_simulator_card_1_description(),
      action: m.home_simulator_card_1_action(),
      href: '/market-replay',
      icon: IconHistory,
    },
    {
      title: m.home_simulator_card_2_title(),
      description: m.home_simulator_card_2_description(),
      action: m.home_simulator_card_2_action(),
      href: '/intraday-trading-practice',
      icon: IconTarget,
    },
    {
      title: m.home_simulator_card_3_title(),
      description: m.home_simulator_card_3_description(),
      action: m.home_simulator_card_3_action(),
      href: '/forex-trading-simulator',
      icon: IconArrowsExchange,
    },
    {
      title: m.home_simulator_card_4_title(),
      description: m.home_simulator_card_4_description(),
      action: m.home_simulator_card_4_action(),
      href: '/crypto-trading-simulator',
      icon: IconCoinBitcoin,
    },
  ];

  const items = featureItems.map((item, index) => ({
    ...item,
    visual: featureVisuals[index],
  }));
  const { resolvedTheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [initialImageReady, setInitialImageReady] = useState(false);
  const initialImageRef = useRef<HTMLImageElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const isPaused = isHovering || isFocused;
  const { ref: imageViewportRef, isInView: isImageNearViewport } =
    useInView<HTMLDivElement>({
      rootMargin: '300px 0px 300px 0px',
    });

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const syncMediaState = () => {
      setIsDesktop(desktopQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    syncMediaState();
    desktopQuery.addEventListener('change', syncMediaState);
    reducedMotionQuery.addEventListener('change', syncMediaState);

    return () => {
      desktopQuery.removeEventListener('change', syncMediaState);
      reducedMotionQuery.removeEventListener('change', syncMediaState);
    };
  }, []);

  const selectFeature = useCallback((index: number) => {
    setActiveIndex(index);
    setTimerResetKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (
      !initialImageReady ||
      !isDesktop ||
      prefersReducedMotion ||
      isPaused ||
      items.length < 2
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, FEATURE_AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [
    activeIndex,
    initialImageReady,
    isDesktop,
    isPaused,
    prefersReducedMotion,
    timerResetKey,
  ]);

  useEffect(() => {
    if (activeIndex !== 0 || initialImageReady) return;

    const image = initialImageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setInitialImageReady(true);
    }
  }, [activeIndex, initialImageReady, isImageNearViewport, resolvedTheme]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 48) return;

    const direction = deltaX < 0 ? 1 : -1;
    selectFeature((activeIndex + direction + items.length) % items.length);
  };

  const handleBlurCapture = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (
      !(nextTarget instanceof Node) ||
      !event.currentTarget.contains(nextTarget)
    ) {
      setIsFocused(false);
    }
  };

  const activeItem = items[activeIndex];
  const activeImage =
    resolvedTheme === 'dark' ? activeItem.visual.dark : activeItem.visual.light;
  const activeImageSrcSet =
    resolvedTheme === 'dark'
      ? activeItem.visual.darkSrcSet
      : activeItem.visual.lightSrcSet;

  return (
    <section id="features" className="px-4 py-10 md:py-14">
      <Container className="space-y-6 px-2 lg:space-y-10">
        <ScrollReveal>
          <HeaderSection
            titleAs="h2"
            title={m.home_features_title()}
            className="items-start text-left"
          />
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <Card className="overflow-hidden p-2 sm:p-3">
            <CardContent
              className="grid gap-3 p-0 lg:grid-cols-[0.8fr_1.2fr]"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onFocusCapture={() => setIsFocused(true)}
              onBlurCapture={handleBlurCapture}
            >
              <div className="rounded-lg border bg-muted/20 p-2 sm:p-4">
                <Accordion
                  value={[`item-${activeIndex + 1}`]}
                  onValueChange={(value) => {
                    const nextValue = value[0];
                    if (typeof nextValue !== 'string') return;
                    const nextIndex =
                      Number(nextValue.replace('item-', '')) - 1;
                    if (
                      Number.isInteger(nextIndex) &&
                      nextIndex >= 0 &&
                      nextIndex < items.length
                    ) {
                      setActiveIndex(nextIndex);
                    }
                  }}
                  className="w-full"
                >
                  {items.map((item, index) => {
                    const ItemIcon = item.icon;
                    return (
                      <AccordionItem
                        key={item.title}
                        value={`item-${index + 1}`}
                        className="border-b last:border-b-0"
                      >
                        <AccordionTrigger
                          className={cn(
                            'gap-3 py-4 text-left hover:no-underline',
                            activeIndex === index && 'text-foreground'
                          )}
                          onClick={() => selectFeature(index)}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                              <ItemIcon className="size-4" aria-hidden="true" />
                            </span>
                            <span className="truncate text-base font-medium">
                              {item.title}
                            </span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pl-12 text-muted-foreground">
                          <p className="leading-6">{item.description}</p>
                          {item.href && item.action ? (
                            <Link
                              to={item.href}
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                              {item.action}
                              <IconArrowUpRight
                                className="size-4"
                                aria-hidden="true"
                              />
                            </Link>
                          ) : null}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              <Card
                className="bg-muted/30 p-2 sm:p-3"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <CardContent className="flex h-full items-center p-0">
                  <div
                    ref={imageViewportRef}
                    className="relative aspect-[8/5] w-full overflow-hidden rounded-lg border bg-background touch-pan-y"
                    aria-live="polite"
                  >
                    {isImageNearViewport ? (
                      <div
                        key={`${activeIndex}-${resolvedTheme}`}
                        className={cn(
                          'absolute inset-0',
                          !prefersReducedMotion && 'animate-crossfade-in'
                        )}
                      >
                        <img
                          ref={activeIndex === 0 ? initialImageRef : undefined}
                          src={activeImage}
                          srcSet={activeImageSrcSet}
                          sizes="(max-width: 1023px) calc(100vw - 3rem), 711px"
                          alt={`${activeItem.title} ${m.common_preview()}`}
                          // The feature card starts below the first viewport.
                          // Mount the image only when it is close enough to
                          // load before the user reaches it.
                          loading="lazy"
                          fetchPriority="auto"
                          decoding="async"
                          width={1200}
                          height={750}
                          onLoad={() => {
                            if (activeIndex === 0) setInitialImageReady(true);
                          }}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </ScrollReveal>
      </Container>
    </section>
  );
}
