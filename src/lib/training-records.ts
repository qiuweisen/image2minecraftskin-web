import { recordTrainingCompletion } from '@/api/dashboard';
import type { SessionResult } from '@/store/useSessionStore';

export type TrainingMode = 'play' | 'day-trading-simulator';

function getClientTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Sends only the compact summary required by the dashboard.
 * The full chart and trade list remain in the existing local history.
 * Guests simply continue using local history when the authenticated API call
 * is rejected.
 */
export async function saveCompletedTraining(
  result: SessionResult,
  mode: TrainingMode,
  startedAtMs: number | null
): Promise<Awaited<ReturnType<typeof recordTrainingCompletion>> | null> {
  const startedAt = startedAtMs
    ? new Date(startedAtMs).toISOString()
    : undefined;

  try {
    return await recordTrainingCompletion({
      data: {
        id: result.id,
        mode,
        symbol: result.symbol,
        interval: result.interval,
        bars: result.bars,
        tradeCount: result.trades.length,
        pnlBps: Math.round(result.pnlPct * 10_000),
        durationSeconds: startedAtMs
          ? Math.max(0, Math.round((Date.now() - startedAtMs) / 1000))
          : 0,
        ...(startedAt ? { startedAt } : {}),
        timezone: getClientTimezone(),
      },
    });
  } catch (error) {
    // Local history is still written for guests or during a transient outage.
    // Keep the failure visible while we diagnose auth/network issues.
    console.error(
      '[training-record] Failed to sync completed training:',
      error
    );
    return null;
  }
}
