import { lazy, Suspense, useEffect, useState } from 'react';

const LazyMarketLineBackground = lazy(() => import('./home-background-line'));

export default function HomeBackground() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (!desktopQuery.matches || reducedMotionQuery.matches) return;

    let cancelled = false;
    const load = () => {
      if (!cancelled) setShouldLoad(true);
    };

    const usesIdleCallback = typeof window.requestIdleCallback === 'function';
    const idleId = usesIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1800 })
      : window.setTimeout(load, 1200);

    return () => {
      cancelled = true;
      if (usesIdleCallback && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <Suspense fallback={null}>
        <LazyMarketLineBackground />
      </Suspense>
    </div>
  );
}
