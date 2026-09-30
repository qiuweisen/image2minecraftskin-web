export type SkinAnalyticsEventName =
  | 'skin_upload'
  | 'skin_generation_completed'
  | 'skin_generation_failed'
  | 'skin_format_selected'
  | 'skin_model_selected'
  | 'skin_downloaded'
  | 'skin_preview_inspected'
  | 'skin_source_adjustment_opened'
  | 'skin_source_adjusted'
  | 'skin_source_adjustment_reset'
  | 'skin_source_improved'
  | 'skin_ai_improve_clicked'
  | 'skin_ai_improve_completed'
  | 'skin_ai_improve_failed'
  | 'skin_retry_started'
  | 'skin_viewer_handoff_clicked'
  | 'skin_viewer_upload'
  | 'skin_viewer_validation_failed'
  | 'skin_viewer_ready'
  | 'skin_viewer_model_selected'
  | 'skin_generator_handoff_clicked';

export type SkinAnalyticsEvent = {
  name: SkinAnalyticsEventName;
  payload: Record<string, unknown>;
};

const EVENT_FIELDS: Record<SkinAnalyticsEventName, string[]> = {
  skin_upload: ['mimeType', 'fileSize'],
  skin_generation_completed: [
    'origin',
    'format',
    'model',
    'sourceWidth',
    'sourceHeight',
  ],
  skin_generation_failed: ['reason'],
  skin_format_selected: ['format'],
  skin_model_selected: ['model'],
  skin_downloaded: ['format', 'model', 'origin', 'framing'],
  skin_preview_inspected: ['view'],
  skin_source_adjustment_opened: ['format', 'model'],
  skin_source_adjusted: ['axis', 'value', 'origin'],
  skin_source_adjustment_reset: [],
  skin_source_improved: ['zoom', 'x', 'y', 'trigger'],
  skin_ai_improve_clicked: ['format', 'model'],
  skin_ai_improve_completed: ['mode', 'zoom', 'x', 'y'],
  skin_ai_improve_failed: ['reason'],
  skin_retry_started: ['location'],
  skin_viewer_handoff_clicked: ['location'],
  skin_viewer_upload: ['mimeType', 'fileSize'],
  skin_viewer_validation_failed: ['reason'],
  skin_viewer_ready: ['format', 'width', 'height'],
  skin_viewer_model_selected: ['model'],
  skin_generator_handoff_clicked: ['location'],
};

function sanitizePayload(event: SkinAnalyticsEvent) {
  const allowed = EVENT_FIELDS[event.name];
  return Object.fromEntries(
    allowed.flatMap((key) => {
      const value = event.payload[key];
      if (
        typeof value === 'string' ||
        (typeof value === 'number' && Number.isFinite(value))
      ) {
        return [[key, value]];
      }
      return [];
    })
  );
}

export function trackSkinEvent(event: SkinAnalyticsEvent) {
  if (typeof window === 'undefined') return;

  const payload = sanitizePayload(event);
  if (typeof window.gtag === 'function') {
    window.gtag('event', event.name, payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: event.name, ...payload });
  }

  if (typeof window.plausible === 'function') {
    window.plausible(event.name, { props: payload });
  }

  if (typeof window.umami?.track === 'function') {
    window.umami.track(event.name, payload);
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, unknown> }
    ) => void;
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}
