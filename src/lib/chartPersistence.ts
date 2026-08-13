import {
  SHARED_INDICATOR_SCOPE,
  hashIndicatorTemplate,
  normalizeIndicatorTemplate,
  type ChartIndicatorTemplate,
} from '@/lib/chartIndicators';

export type ChartLayoutState = Record<string, unknown>;
export type ChartUserSettings = Record<string, string>;

export type ChartPersistenceState = {
  /** Complete TradingView layout; localStorage only. */
  layout: ChartLayoutState | null;
  /** TradingView user settings; localStorage only. */
  userSettings: ChartUserSettings;
  updatedAt: string | null;
  /** Hash of the user-indicator template represented by the local layout. */
  indicatorTemplateHash: string | null;
  /** Hash of the last shared template successfully synced to D1. */
  indicatorLastSyncedHash: string | null;
  indicatorUpdatedAt: string | null;
};

export type RemoteIndicatorProfile = {
  authenticated: boolean;
  template: ChartIndicatorTemplate | null;
  templateHash: string | null;
  updatedAt: string | null;
  version: number;
};

export type LoadedChartPersistenceState = ChartPersistenceState & {
  remoteProfile: RemoteIndicatorProfile;
};

export type LocalIndicatorSyncOptions = {
  templateHash?: string | null;
  lastSyncedHash?: string | null;
  updatedAt?: string | null;
};

const STORAGE_KEY = 'cg-chart-persistence-v1';
const REMOTE_LOAD_CACHE_MS = 30_000;

const memoryStates = new Map<string, ChartPersistenceState>();
const remoteLoadPromises = new Map<string, Promise<RemoteIndicatorProfile>>();
const remoteLoadCache = new Map<
  string,
  {
    loadedAt: number;
    profile: RemoteIndicatorProfile;
  }
>();

function emptyState(): ChartPersistenceState {
  return {
    layout: null,
    userSettings: {},
    updatedAt: null,
    indicatorTemplateHash: null,
    indicatorLastSyncedHash: null,
    indicatorUpdatedAt: null,
  };
}

function emptyRemoteProfile(authenticated = false): RemoteIndicatorProfile {
  return {
    authenticated,
    template: null,
    templateHash: null,
    updatedAt: null,
    version: 1,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeUserSettings(value: unknown): ChartUserSettings {
  if (!isRecord(value)) return {};

  const out: ChartUserSettings = {};
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw === 'string') {
      out[key] = raw;
    } else if (typeof raw === 'number' || typeof raw === 'boolean') {
      out[key] = String(raw);
    }
  }
  return out;
}

function normalizeHash(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export function normalizeChartPersistence(
  value: unknown
): ChartPersistenceState {
  if (!isRecord(value)) return emptyState();

  return {
    layout:
      value.layout === null
        ? null
        : isRecord(value.layout)
          ? value.layout
          : null,
    userSettings: normalizeUserSettings(value.userSettings),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
    indicatorTemplateHash: normalizeHash(value.indicatorTemplateHash),
    indicatorLastSyncedHash: normalizeHash(value.indicatorLastSyncedHash),
    indicatorUpdatedAt:
      typeof value.indicatorUpdatedAt === 'string'
        ? value.indicatorUpdatedAt
        : null,
  };
}

function writeLocalState(
  next: ChartPersistenceState,
  storageKey = STORAGE_KEY
) {
  const normalized = normalizeChartPersistence(next);
  memoryStates.set(storageKey, normalized);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(normalized));
    } catch {}
  }

  return normalized;
}

export function readLocalChartPersistence(
  storageKey = STORAGE_KEY
): ChartPersistenceState {
  if (typeof window === 'undefined') return emptyState();
  const memoryState = memoryStates.get(storageKey);
  if (memoryState) return memoryState;

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      const empty = emptyState();
      memoryStates.set(storageKey, empty);
      return empty;
    }

    const normalized = normalizeChartPersistence(JSON.parse(raw));
    memoryStates.set(storageKey, normalized);
    return normalized;
  } catch {
    const empty = emptyState();
    memoryStates.set(storageKey, empty);
    return empty;
  }
}

export function saveChartLayoutLocal(
  layout: ChartLayoutState | null,
  storageKey = STORAGE_KEY,
  syncOptions: LocalIndicatorSyncOptions = {}
): ChartPersistenceState {
  const current = readLocalChartPersistence(storageKey);
  return writeLocalState(
    {
      ...current,
      layout,
      updatedAt: new Date().toISOString(),
      indicatorTemplateHash:
        syncOptions.templateHash === undefined
          ? current.indicatorTemplateHash
          : syncOptions.templateHash,
      indicatorLastSyncedHash:
        syncOptions.lastSyncedHash === undefined
          ? current.indicatorLastSyncedHash
          : syncOptions.lastSyncedHash,
      indicatorUpdatedAt:
        syncOptions.updatedAt === undefined
          ? current.indicatorUpdatedAt
          : syncOptions.updatedAt,
    },
    storageKey
  );
}

export function markLocalIndicatorTemplate(
  templateHash: string,
  storageKey = STORAGE_KEY
): ChartPersistenceState {
  const current = readLocalChartPersistence(storageKey);
  return writeLocalState(
    {
      ...current,
      indicatorTemplateHash: templateHash,
      indicatorUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    storageKey
  );
}

export function markLocalIndicatorTemplateSynced(
  templateHash: string,
  storageKey = STORAGE_KEY,
  remoteUpdatedAt: string | null = null
): ChartPersistenceState {
  const current = readLocalChartPersistence(storageKey);
  return writeLocalState(
    {
      ...current,
      indicatorTemplateHash: templateHash,
      indicatorLastSyncedHash: templateHash,
      indicatorUpdatedAt: remoteUpdatedAt ?? current.indicatorUpdatedAt,
    },
    storageKey
  );
}

export function saveChartUserSettingLocal(
  key: string,
  value: string,
  storageKey = STORAGE_KEY
): ChartPersistenceState {
  const current = readLocalChartPersistence(storageKey);
  return writeLocalState(
    {
      ...current,
      userSettings: {
        ...current.userSettings,
        [key]: value,
      },
      updatedAt: new Date().toISOString(),
    },
    storageKey
  );
}

export function removeChartUserSettingLocal(
  key: string,
  storageKey = STORAGE_KEY
): ChartPersistenceState {
  const current = readLocalChartPersistence(storageKey);
  const nextSettings = { ...current.userSettings };
  delete nextSettings[key];

  return writeLocalState(
    {
      ...current,
      userSettings: nextSettings,
      updatedAt: new Date().toISOString(),
    },
    storageKey
  );
}

function profileFromResponse(
  raw: unknown,
  authenticated: boolean
): RemoteIndicatorProfile {
  if (!isRecord(raw)) return emptyRemoteProfile(authenticated);

  return {
    authenticated,
    template: normalizeIndicatorTemplate(raw.template),
    templateHash: normalizeHash(raw.templateHash),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : null,
    version: typeof raw.version === 'number' ? raw.version : 1,
  };
}

async function loadRemoteIndicatorProfile(
  scope = SHARED_INDICATOR_SCOPE
): Promise<RemoteIndicatorProfile> {
  if (typeof window === 'undefined') return emptyRemoteProfile();

  const cached = remoteLoadCache.get(scope);
  if (cached && Date.now() - cached.loadedAt < REMOTE_LOAD_CACHE_MS) {
    return cached.profile;
  }

  const existingPromise = remoteLoadPromises.get(scope);
  if (existingPromise) return existingPromise;

  const promise = fetch(
    `/api/chart-settings?scope=${encodeURIComponent(scope)}`,
    {
      method: 'GET',
      cache: 'no-store',
      credentials: 'same-origin',
    }
  )
    .then(async (response) => {
      if (!response.ok) return emptyRemoteProfile();
      const raw: unknown = await response.json();
      const authenticated = isRecord(raw) && raw.authenticated === true;
      return profileFromResponse(raw, authenticated);
    })
    .catch(() => emptyRemoteProfile())
    .then((profile) => {
      remoteLoadCache.set(scope, { loadedAt: Date.now(), profile });
      return profile;
    })
    .finally(() => {
      remoteLoadPromises.delete(scope);
    });

  remoteLoadPromises.set(scope, promise);
  return promise;
}

export async function persistChartIndicatorTemplateRemote(
  template: unknown,
  scope = SHARED_INDICATOR_SCOPE
): Promise<RemoteIndicatorProfile | null> {
  if (typeof window === 'undefined') return null;

  const normalized = normalizeIndicatorTemplate(template) ?? {
    version: 1,
    panes: [],
  };
  const templateHash = await hashIndicatorTemplate(normalized);

  try {
    const response = await fetch('/api/chart-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      keepalive: true,
      body: JSON.stringify({
        scope,
        template: normalized,
        templateHash,
      }),
    });

    if (!response.ok) return null;
    const raw: unknown = await response.json();
    const authenticated = isRecord(raw) && raw.authenticated === true;
    const profile = profileFromResponse(raw, authenticated);
    remoteLoadCache.set(scope, { loadedAt: Date.now(), profile });
    return profile;
  } catch {
    return null;
  }
}

export async function loadChartPersistence(
  storageKey = STORAGE_KEY,
  includeRemote = true,
  scope = SHARED_INDICATOR_SCOPE
): Promise<LoadedChartPersistenceState> {
  const localState = readLocalChartPersistence(storageKey);

  if (typeof window === 'undefined' || !includeRemote) {
    return {
      ...localState,
      remoteProfile: emptyRemoteProfile(),
    };
  }

  const remoteProfile = await loadRemoteIndicatorProfile(scope);
  return { ...readLocalChartPersistence(storageKey), remoteProfile };
}

export function preloadChartPersistence(
  storageKey = STORAGE_KEY,
  includeRemote = true,
  scope = SHARED_INDICATOR_SCOPE
): void {
  void loadChartPersistence(storageKey, includeRemote, scope);
}
