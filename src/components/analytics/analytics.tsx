import { useEffect, useState } from 'react';
import { ClarityAnalytics } from './clarity-analytics';
import { GoogleAnalytics } from './google-analytics';
import { PlausibleAnalytics } from './plausible-analytics';
import { UmamiAnalytics } from './umami-analytics';

const analyticsInteractionEvents = [
  'pointerdown',
  'keydown',
  'touchstart',
  'scroll',
] as const;

/**
 * Renders analytics after the first meaningful interaction, or after a
 * maximum delay. Keeping these third-party scripts out of the initial render
 * protects mobile LCP/TBT while still recording engaged visitors.
 */
export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!import.meta.env.PROD) return;

    let activated = false;
    let timeoutId: number | undefined;
    const activate = () => {
      if (activated) return;
      activated = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      for (const eventName of analyticsInteractionEvents) {
        window.removeEventListener(eventName, activate);
      }
      setEnabled(true);
    };

    for (const eventName of analyticsInteractionEvents) {
      window.addEventListener(eventName, activate, {
        once: true,
        passive: true,
      });
    }
    timeoutId = window.setTimeout(activate, 10_000);

    return () => {
      window.clearTimeout(timeoutId);
      for (const eventName of analyticsInteractionEvents) {
        window.removeEventListener(eventName, activate);
      }
    };
  }, []);

  if (!import.meta.env.PROD || !enabled) return null;

  return (
    <>
      <GoogleAnalytics />
      <UmamiAnalytics />
      <PlausibleAnalytics />
      <ClarityAnalytics />
    </>
  );
}
