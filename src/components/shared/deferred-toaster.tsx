import { lazy, Suspense, useEffect, useState } from 'react';
import type { ToasterProps } from 'sonner';

const LazyToaster = lazy(() =>
  import('./toaster').then(({ Toaster }) => ({ default: Toaster }))
);

const activationEvents = ['pointerdown', 'keydown', 'touchstart'] as const;

/**
 * Toasts are interaction-driven UI. Keep Sonner out of the initial marketing
 * bundle and load it on the first interaction (or as a delayed fallback for
 * scripts that need to show a toast without a user click).
 */
export function DeferredToaster(props: ToasterProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let activated = false;
    const timeoutId = window.setTimeout(activate, 5000);

    function activate() {
      if (activated) return;
      activated = true;
      window.clearTimeout(timeoutId);
      for (const eventName of activationEvents) {
        window.removeEventListener(eventName, activate);
      }
      setEnabled(true);
    }

    for (const eventName of activationEvents) {
      window.addEventListener(eventName, activate, {
        once: true,
        passive: true,
      });
    }

    return () => {
      window.clearTimeout(timeoutId);
      for (const eventName of activationEvents) {
        window.removeEventListener(eventName, activate);
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <LazyToaster {...props} />
    </Suspense>
  );
}
