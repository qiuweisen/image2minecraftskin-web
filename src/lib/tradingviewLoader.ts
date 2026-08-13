const TRADINGVIEW_SCRIPT_ID = 'tradingview-library';
const TRADINGVIEW_SCRIPT_SRC =
  '/TradingView/charting_library/charting_library.js';

type TradingViewWindow = Window & {
  TradingView?: unknown;
};

let tradingViewLoadPromise: Promise<void> | null = null;

/**
 * Load the local TradingView entry script once.
 *
 * This module is intentionally browser-safe and does not run on the homepage
 * by itself. Entry points can call it when the user shows intent to open a
 * chart, or when Start is pressed.
 */
export function loadTradingViewLibrary(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new Error('TradingView library can only load in the browser')
    );
  }

  const tradingViewWindow = window as TradingViewWindow;
  if (tradingViewWindow.TradingView) {
    return Promise.resolve();
  }

  if (tradingViewLoadPromise) {
    return tradingViewLoadPromise;
  }

  tradingViewLoadPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      TRADINGVIEW_SCRIPT_ID
    ) as HTMLScriptElement | null;

    const handleLoad = (script: HTMLScriptElement) => {
      script.dataset.loaded = 'true';
      resolve();
    };

    const handleError = (script: HTMLScriptElement) => {
      tradingViewLoadPromise = null;
      script.remove();
      reject(new Error('TradingView library failed to load'));
    };

    if (existingScript) {
      if (
        existingScript.dataset.loaded === 'true' ||
        tradingViewWindow.TradingView
      ) {
        resolve();
        return;
      }
      existingScript.addEventListener(
        'load',
        () => handleLoad(existingScript),
        { once: true }
      );
      existingScript.addEventListener(
        'error',
        () => handleError(existingScript),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.id = TRADINGVIEW_SCRIPT_ID;
    script.src = TRADINGVIEW_SCRIPT_SRC;
    script.async = true;
    script.dataset.loaded = 'false';
    script.addEventListener('load', () => handleLoad(script), { once: true });
    script.addEventListener('error', () => handleError(script), { once: true });
    document.head.appendChild(script);
  });

  return tradingViewLoadPromise;
}

/** Start loading without making hover/focus navigation wait on the result. */
export function preloadTradingViewLibrary(): Promise<void> {
  return loadTradingViewLibrary().catch(() => undefined);
}

/** Wait for the entry script, with a bounded failure time for the Start flow. */
export function waitForTradingView(timeoutMs = 15000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('TradingView library failed to load'));
    }, timeoutMs);

    loadTradingViewLibrary()
      .then(() => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve();
      })
      .catch((error: unknown) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        reject(error);
      });
  });
}
