/**
 * Shared TradingView indicator-template helpers.
 *
 * A chart layout contains much more than indicators. The shared profile must
 * therefore be built from TradingView's createStudyTemplate() result and must
 * never contain a symbol, interval, drawing, or application-owned study.
 */

export const SHARED_INDICATOR_SCOPE = 'shared' as const;
export const INDICATOR_TEMPLATE_VERSION = 1;
export const BAR_COUNT_STUDY_ID = 'Bar Count@tv-basicstudies-1';
export const BAR_COUNT_STUDY_NAME = 'Bar Count';

export type JsonRecord = Record<string, unknown>;

export type ChartIndicatorTemplate = JsonRecord & {
  version: number;
  panes: JsonRecord[];
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBarCountSource(source: JsonRecord) {
  const metaInfo = isRecord(source.metaInfo) ? source.metaInfo : null;
  const state = isRecord(source.state) ? source.state : null;
  const ids = [
    source.id,
    source.name,
    metaInfo?.id,
    metaInfo?.name,
    metaInfo?.description,
    state?.shortName,
  ];

  return ids.some(
    (value) => value === BAR_COUNT_STUDY_ID || value === BAR_COUNT_STUDY_NAME
  );
}

export function isUserIndicatorSource(value: unknown): value is JsonRecord {
  if (!isRecord(value)) return false;
  const type = typeof value.type === 'string' ? value.type : '';
  if (type !== 'Study' && !type.startsWith('study_')) return false;
  return !isBarCountSource(value);
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, sortJson(child)])
  );
}

/**
 * Removes symbol/interval and application-owned studies while preserving the
 * canonical pane/source structure produced by TradingView.
 */
export function normalizeIndicatorTemplate(
  value: unknown
): ChartIndicatorTemplate | null {
  if (!isRecord(value) || !Array.isArray(value.panes)) return null;

  const {
    symbol: _symbol,
    interval: _interval,
    ...templateWithoutChartContext
  } = value;

  const panes = value.panes
    .filter(isRecord)
    .map((pane) => {
      const sources = Array.isArray(pane.sources)
        ? pane.sources.filter(isUserIndicatorSource)
        : [];

      return {
        ...pane,
        sources,
      } satisfies JsonRecord;
    })
    .filter((pane) => Array.isArray(pane.sources) && pane.sources.length > 0);

  return {
    ...templateWithoutChartContext,
    version:
      typeof value.version === 'number'
        ? value.version
        : INDICATOR_TEMPLATE_VERSION,
    panes,
  } as ChartIndicatorTemplate;
}

export function serializeIndicatorTemplate(value: unknown): string | null {
  const normalized = normalizeIndicatorTemplate(value);
  if (!normalized) return null;

  // TradingView accepts JSON objects; stable key ordering gives us a reliable
  // content hash and prevents writes caused only by object insertion order.
  return JSON.stringify(sortJson(normalized));
}

export function parseIndicatorTemplate(value: unknown) {
  if (typeof value !== 'string' || value.length === 0) return null;
  try {
    return normalizeIndicatorTemplate(JSON.parse(value));
  } catch {
    return null;
  }
}

export function hasUserIndicators(value: unknown) {
  const normalized = normalizeIndicatorTemplate(value);
  return Boolean(
    normalized?.panes.some(
      (pane) => Array.isArray(pane.sources) && pane.sources.length > 0
    )
  );
}

export function hasUserIndicatorsInLayout(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.charts)) return false;

  return value.charts.some((chart) => {
    if (!isRecord(chart) || !Array.isArray(chart.panes)) return false;
    return chart.panes.some((pane) => {
      if (!isRecord(pane) || !Array.isArray(pane.sources)) return false;
      return pane.sources.some(isUserIndicatorSource);
    });
  });
}

export function templateHashInput(value: unknown) {
  return (
    serializeIndicatorTemplate(value) ??
    JSON.stringify({
      panes: [],
      version: INDICATOR_TEMPLATE_VERSION,
    })
  );
}

/**
 * A chart layout can be used as a page-local base while a newer shared
 * template is applied once after chartReady. Remove only user studies; keep
 * drawings, the main series, and page-owned studies such as Bar Count.
 */
export function removeUserIndicatorsFromLayout(
  value: unknown
): JsonRecord | null {
  if (!isRecord(value)) return null;

  const clone = JSON.parse(JSON.stringify(value)) as JsonRecord;
  const charts = Array.isArray(clone.charts) ? clone.charts : [];

  clone.charts = charts.filter(isRecord).map((chart) => {
    const panes = Array.isArray(chart.panes) ? chart.panes : [];
    return {
      ...chart,
      panes: panes.filter(isRecord).map((pane) => ({
        ...pane,
        sources: Array.isArray(pane.sources)
          ? pane.sources.filter((source) => !isUserIndicatorSource(source))
          : [],
      })),
    };
  });

  return clone;
}

export function extractBarCountInputs(value: unknown): JsonRecord | null {
  if (!isRecord(value) || !Array.isArray(value.charts)) return null;

  for (const chart of value.charts) {
    if (!isRecord(chart) || !Array.isArray(chart.panes)) continue;
    for (const pane of chart.panes) {
      if (!isRecord(pane) || !Array.isArray(pane.sources)) continue;
      for (const source of pane.sources) {
        if (!isRecord(source) || !isBarCountSource(source)) continue;
        const state = isRecord(source.state) ? source.state : null;
        const inputs = state && isRecord(state.inputs) ? state.inputs : null;
        return inputs;
      }
    }
  }

  return null;
}

function fallbackHash(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export async function hashIndicatorTemplate(value: unknown) {
  const input = templateHashInput(value);

  try {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return fallbackHash(input);
    const digest = await subtle.digest(
      'SHA-256',
      new TextEncoder().encode(input)
    );
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0')
    ).join('');
  } catch {
    return fallbackHash(input);
  }
}
