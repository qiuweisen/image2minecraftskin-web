import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  trackSkinEvent,
  type SkinAnalyticsEvent,
} from '@/lib/analytics-events';

const originalWindow = globalThis.window;

afterEach(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: originalWindow,
  });
});

describe('trackSkinEvent', () => {
  it('forwards only allowlisted generation fields to the data layer', () => {
    const dataLayer: unknown[] = [];
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { dataLayer },
    });

    const event: SkinAnalyticsEvent = {
      name: 'skin_generation_completed',
      payload: {
        format: 'java-64',
        model: 'classic',
        sourceWidth: 640,
        sourceHeight: 480,
        fileName: 'private-photo.png',
        imageData: 'private pixels',
      },
    };

    trackSkinEvent(event);

    expect(dataLayer).toEqual([
      {
        event: 'skin_generation_completed',
        format: 'java-64',
        model: 'classic',
        sourceWidth: 640,
        sourceHeight: 480,
      },
    ]);
  });

  it('no-ops when analytics is unavailable', () => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {},
    });

    expect(() =>
      trackSkinEvent({
        name: 'skin_generation_failed',
        payload: { reason: 'unsupported_type' },
      })
    ).not.toThrow();
  });

  it('does not duplicate GA events when gtag is available', () => {
    const dataLayer: unknown[] = [];
    const gtag = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { dataLayer, gtag },
    });

    trackSkinEvent({
      name: 'skin_downloaded',
      payload: { format: 'bedrock-128', model: 'slim' },
    });

    expect(gtag).toHaveBeenCalledWith('event', 'skin_downloaded', {
      format: 'bedrock-128',
      model: 'slim',
    });
    expect(dataLayer).toEqual([]);
  });

  it('forwards the same sanitized viewer event to Umami', () => {
    const track = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { umami: { track } },
    });

    trackSkinEvent({
      name: 'skin_viewer_ready',
      payload: {
        format: 'java-64',
        width: 64,
        height: 64,
        fileName: 'private-skin.png',
      },
    });

    expect(track).toHaveBeenCalledWith('skin_viewer_ready', {
      format: 'java-64',
      width: 64,
      height: 64,
    });
  });

  it('allows only bounded source adjustment fields', () => {
    const track = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { umami: { track } },
    });

    trackSkinEvent({
      name: 'skin_source_adjusted',
      payload: {
        axis: 'zoom',
        value: 1.4,
        fileName: 'private-photo.png',
      },
    });

    expect(track).toHaveBeenCalledWith('skin_source_adjusted', {
      axis: 'zoom',
      value: 1.4,
    });
  });
});
