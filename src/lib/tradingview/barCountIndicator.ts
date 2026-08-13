import type { Candle } from '@/lib/ohlcv/types';
import { chartResolutionBucketStart } from '@/lib/ohlcv/chartResolution';

export const BAR_COUNT_STUDY_NAME = 'Bar Count';
export const BAR_COUNT_STUDY_ID = 'Bar Count@tv-basicstudies-1';

export type BarCountStudySettings = {
  every: number;
  distancePx: number;
  labelSize: string;
  textColor: string;
};

export type BarCountLabel = {
  key: string;
  leftTimeSec: number;
  rightTimeSec: number;
  low: number;
  text: string;
};

const SIZE_TO_FONT: Record<string, number> = {
  Auto: 12,
  Huge: 18,
  Large: 14,
  Normal: 12,
  Small: 10,
  Tiny: 8,
};

const DEFAULT_BAR_COUNT_TEXT_COLOR = '#f59e0b';

function colorComponent(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 255
    ? parsed
    : null;
}

/**
 * TradingView's color input can return either a hex color or an rgba() value.
 * Keep the value in a CSS format accepted by drawing overrides, but canonicalize
 * opaque rgb/rgba colors to hex so equivalent values do not create duplicate keys.
 */
export function normalizeBarCountTextColor(value: unknown): string {
  const text = String(value ?? '').trim();
  if (/^#[0-9a-f]{6}$/i.test(text)) return text;

  const match = text.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  );
  if (!match) return DEFAULT_BAR_COUNT_TEXT_COLOR;

  const red = colorComponent(match[1]);
  const green = colorComponent(match[2]);
  const blue = colorComponent(match[3]);
  if (red === null || green === null || blue === null)
    return DEFAULT_BAR_COUNT_TEXT_COLOR;

  if (match[4] === undefined) {
    return `#${[red, green, blue].map((component) => component.toString(16).padStart(2, '0')).join('')}`;
  }

  const alpha = Number(match[4]);
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
    return DEFAULT_BAR_COUNT_TEXT_COLOR;
  if (alpha === 1) {
    return `#${[red, green, blue].map((component) => component.toString(16).padStart(2, '0')).join('')}`;
  }
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export const barCountFontSize = (size: string) =>
  SIZE_TO_FONT[size] ?? SIZE_TO_FONT.Normal;

export function createBarCountIndicator(): any {
  return {
    name: BAR_COUNT_STUDY_NAME,
    metainfo: {
      _metainfoVersion: 53,
      id: BAR_COUNT_STUDY_ID,
      description: BAR_COUNT_STUDY_NAME,
      shortDescription: BAR_COUNT_STUDY_NAME,
      isCustomIndicator: true,
      is_price_study: true,
      linkedToSeries: true,
      is_hidden_study: false,
      format: { type: 'inherit' },
      plots: [{ id: 'plot_0', type: 'line' }],
      styles: {
        plot_0: {
          title: 'Internal',
          isHidden: true,
          histogramBase: 0,
          joinPoints: false,
        },
      },
      inputs: [
        {
          id: 'every',
          name: 'Display at every X bars',
          type: 'integer',
          defval: 2,
          min: 1,
          max: 50,
          step: 1,
        },
        {
          id: 'distancePx',
          name: 'Distance from candle (px)',
          type: 'integer',
          defval: 25,
          min: 4,
          max: 40,
          step: 1,
        },
        {
          id: 'labelSize',
          name: 'Label Size',
          type: 'text',
          defval: 'Normal',
          options: ['Auto', 'Huge', 'Large', 'Normal', 'Small', 'Tiny'],
        },
        {
          id: 'textColor',
          name: 'Text Color',
          type: 'color',
          defval: '#f59e0b',
        },
      ],
      defaults: {
        inputs: {
          every: 2,
          distancePx: 25,
          labelSize: 'Normal',
          textColor: '#f59e0b',
        },
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 100,
            visible: false,
            color: '#000000',
          },
        },
      },
    },
    constructor: function (this: any) {
      this.main = function (
        context: any,
        inputCallback: (index: number) => unknown
      ) {
        this._context = context;
        this._input = inputCallback;
        // Register all inputs with the study engine. Rendering is handled by the
        // chart adapter because Pine label.new-style dynamic text is unavailable.
        this._input(0);
        this._input(1);
        this._input(2);
        this._input(3);
        return [NaN];
      };
    },
  };
}

export function readBarCountStudySettings(study: any): BarCountStudySettings {
  const values = new Map<string, unknown>();
  for (const item of study?.getInputValues?.() ?? []) {
    values.set(String(item.id), item.value);
  }

  const everyValue = Number(values.get('every'));
  const distanceValue = Number(values.get('distancePx'));
  const labelSize = String(values.get('labelSize') ?? 'Normal');
  const textColor = normalizeBarCountTextColor(values.get('textColor'));

  return {
    every: Number.isFinite(everyValue)
      ? Math.max(1, Math.min(50, Math.floor(everyValue)))
      : 2,
    distancePx: Number.isFinite(distanceValue)
      ? Math.max(4, Math.min(40, Math.floor(distanceValue)))
      : 25,
    labelSize: SIZE_TO_FONT[labelSize] ? labelSize : 'Normal',
    textColor,
  };
}

export function buildBarCountLabels(
  candles: Candle[],
  resolution: string,
  every: number,
  maxLabels = 500
): BarCountLabel[] {
  if (!/^\d+$/.test(resolution) || candles.length === 0) return [];

  const buckets = new Map<
    number,
    { time: number; high: number; low: number; close: number }
  >();
  for (const candle of candles) {
    const time = Date.parse(candle.time);
    if (!Number.isFinite(time)) continue;
    const bucket = chartResolutionBucketStart(time, resolution);
    const current = buckets.get(bucket);
    if (!current) {
      buckets.set(bucket, {
        time: bucket,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      });
      continue;
    }
    current.high = Math.max(current.high, candle.high);
    current.low = Math.min(current.low, candle.low);
    current.close = candle.close;
  }

  const bars = Array.from(buckets.values()).sort(
    (left, right) => left.time - right.time
  );
  const resolutionMs = Number(resolution) * 60_000;
  const safeEvery = Math.max(1, Math.min(50, Math.floor(every) || 1));
  const labels: BarCountLabel[] = [];
  let previousDay = '';
  let count = 0;

  for (let index = 0; index < bars.length; index += 1) {
    const bar = bars[index];
    const date = new Date(bar.time);
    const day = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
    if (day !== previousDay) {
      previousDay = day;
      count = 1;
    } else {
      count += 1;
    }

    if (count % safeEvery !== 0) continue;

    const previousTime = bars[index - 1]?.time ?? bar.time - resolutionMs;
    const nextTime = bars[index + 1]?.time ?? bar.time + resolutionMs;

    labels.push({
      key: `${bar.time}:${count}`,
      leftTimeSec: Math.floor(previousTime / 1000),
      rightTimeSec: Math.floor(nextTime / 1000),
      low: bar.low,
      text: String(count),
    });
  }

  return labels.slice(-Math.max(1, maxLabels));
}
