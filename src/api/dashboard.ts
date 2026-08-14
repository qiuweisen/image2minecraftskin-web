import { getDb } from '@/db';
import { dailyCheckins, trainingRecords, userPoints } from '@/db/app.schema';
import { authApiMiddleware } from '@/middlewares/auth-middleware';
import { createServerFn } from '@tanstack/react-start';
import { and, count, desc, eq, gte, lt, sql } from 'drizzle-orm';
import { z } from 'zod';

const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_DAYS = 90;
const DAILY_POINTS = 5;
const MILESTONE_DAYS = [8, 15, 21, 28] as const;

const timezoneSchema = z.string().min(1).max(64).optional().catch(undefined);

const dashboardInputSchema = z.object({
  timezone: timezoneSchema,
});

const trainingModeSchema = z.enum(['play', 'day-trading-simulator']);

const recordTrainingSchema = z.object({
  id: z.string().min(1).max(128),
  mode: trainingModeSchema,
  symbol: z.string().min(1).max(32),
  interval: z.string().min(1).max(16),
  bars: z.number().int().min(0).max(100_000),
  tradeCount: z.number().int().min(0).max(100_000),
  pnlBps: z.number().int().min(-10_000_000).max(10_000_000),
  durationSeconds: z.number().int().min(0).max(86_400),
  startedAt: z.string().datetime().optional(),
  timezone: timezoneSchema,
});

type CalendarKeys = {
  dayKey: string;
  monthKey: string;
};

function getCalendarKeys(date: Date, timezone?: string): CalendarKeys {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );
  const year = values.year ?? date.getUTCFullYear().toString();
  const month = values.month ?? String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = values.day ?? String(date.getUTCDate()).padStart(2, '0');

  return {
    dayKey: `${year}-${month}-${day}`,
    monthKey: `${year}-${month}`,
  };
}

function safeCalendarKeys(date: Date, timezone?: string): CalendarKeys {
  try {
    return getCalendarKeys(date, timezone);
  } catch {
    return getCalendarKeys(date, 'UTC');
  }
}

function getCurrentStreak(dayKeys: string[], todayKey: string): number {
  const signedDays = new Set(dayKeys);
  let cursor = Date.parse(`${todayKey}T00:00:00.000Z`);
  let streak = 0;

  while (signedDays.has(new Date(cursor).toISOString().slice(0, 10))) {
    streak += 1;
    cursor -= DAY_MS;
  }

  return streak;
}

export const getDashboardSnapshot = createServerFn({ method: 'GET' })
  .validator(dashboardInputSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const db = getDb();
    const now = new Date();
    const nowMs = now.getTime();
    const retentionStart = new Date(nowMs - RETENTION_DAYS * DAY_MS);
    const { dayKey, monthKey } = safeCalendarKeys(now, data.timezone);
    const trainingWhere = and(
      eq(trainingRecords.userId, context.userId),
      gte(trainingRecords.completedAt, retentionStart)
    );
    const activityDay = sql<string>`strftime('%Y-%m-%d', ${trainingRecords.completedAt} / 1000, 'unixepoch')`;

    const [
      summaryRows,
      activityRows,
      recentRows,
      monthCheckinRows,
      pointsRows,
      streakRows,
    ] = await db.batch([
      db
        .select({
          totalSessions: count(),
          practiceSeconds: sql<number>`coalesce(sum(${trainingRecords.durationSeconds}), 0)`,
        })
        .from(trainingRecords)
        .where(trainingWhere),
      db
        .select({
          day: activityDay,
          sessions: count(),
        })
        .from(trainingRecords)
        .where(trainingWhere)
        .groupBy(activityDay)
        .orderBy(activityDay),
      db
        .select({
          id: trainingRecords.id,
          mode: trainingRecords.mode,
          symbol: trainingRecords.symbol,
          interval: trainingRecords.interval,
          bars: trainingRecords.bars,
          tradeCount: trainingRecords.tradeCount,
          pnlBps: trainingRecords.pnlBps,
          durationSeconds: trainingRecords.durationSeconds,
          completedAt: trainingRecords.completedAt,
        })
        .from(trainingRecords)
        .where(trainingWhere)
        .orderBy(desc(trainingRecords.completedAt))
        .limit(5),
      db
        .select({ dayKey: dailyCheckins.dayKey })
        .from(dailyCheckins)
        .where(
          and(
            eq(dailyCheckins.userId, context.userId),
            eq(dailyCheckins.monthKey, monthKey)
          )
        )
        .orderBy(dailyCheckins.dayKey),
      db
        .select({
          balance: userPoints.balance,
          lifetimeEarned: userPoints.lifetimeEarned,
        })
        .from(userPoints)
        .where(eq(userPoints.userId, context.userId))
        .limit(1),
      db
        .select({ dayKey: dailyCheckins.dayKey })
        .from(dailyCheckins)
        .where(
          and(
            eq(dailyCheckins.userId, context.userId),
            gte(
              dailyCheckins.createdAt,
              new Date(nowMs - RETENTION_DAYS * DAY_MS)
            )
          )
        )
        .orderBy(desc(dailyCheckins.dayKey)),
    ]);

    const summary = summaryRows[0];
    const points = pointsRows[0];
    const monthDays = monthCheckinRows.map((row) => row.dayKey);
    const streakDays = streakRows.map((row) => row.dayKey);

    return {
      summary: {
        totalSessions: Number(summary?.totalSessions ?? 0),
        practiceSeconds: Number(summary?.practiceSeconds ?? 0),
        currentStreak: getCurrentStreak(streakDays, dayKey),
        pointsBalance: points?.balance ?? 0,
      },
      activity: activityRows.map((row) => ({
        date: row.day,
        sessions: Number(row.sessions),
      })),
      checkIn: {
        monthKey,
        todayKey: dayKey,
        signedDays: monthDays,
        signedCount: monthDays.length,
        milestones: MILESTONE_DAYS,
        dailyPoints: DAILY_POINTS,
        milestonePoints: DAILY_POINTS,
      },
      points: {
        balance: points?.balance ?? 0,
        lifetimeEarned: points?.lifetimeEarned ?? 0,
      },
      recentRecords: recentRows.map((row) => ({
        ...row,
        pnlPct: row.pnlBps / 10_000,
        completedAt: row.completedAt.toISOString(),
      })),
    };
  });

export const recordTrainingCompletion = createServerFn({ method: 'POST' })
  .validator(recordTrainingSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const db = getDb();
    const completedAt = new Date();
    const retentionStart = new Date(
      completedAt.getTime() - RETENTION_DAYS * DAY_MS
    );
    const { dayKey, monthKey } = safeCalendarKeys(completedAt, data.timezone);
    const startedAt = data.startedAt ? new Date(data.startedAt) : null;

    // Cloudflare D1 does not support Drizzle's interactive transaction API
    // (`BEGIN`/`COMMIT`) in Workers. Keep the writes idempotent with the
    // primary keys and conflict clauses instead.
    const insertedTrainingRows = await db
      .insert(trainingRecords)
      .values({
        id: data.id,
        userId: context.userId,
        mode: data.mode,
        symbol: data.symbol,
        interval: data.interval,
        bars: data.bars,
        tradeCount: data.tradeCount,
        pnlBps: data.pnlBps,
        durationSeconds: data.durationSeconds,
        startedAt,
        completedAt,
      })
      .onConflictDoNothing()
      .returning({ id: trainingRecords.id });

    if (insertedTrainingRows.length === 0) {
      return {
        recorded: false,
        checkIn: { awarded: false, points: 0, dayKey },
      };
    }

    const monthCountRows = await db
      .select({ count: count() })
      .from(dailyCheckins)
      .where(
        and(
          eq(dailyCheckins.userId, context.userId),
          eq(dailyCheckins.monthKey, monthKey)
        )
      );
    const monthCount = Number(monthCountRows[0]?.count ?? 0);
    const bonusPoints = MILESTONE_DAYS.includes(
      (monthCount + 1) as (typeof MILESTONE_DAYS)[number]
    )
      ? DAILY_POINTS
      : 0;
    const totalAward = DAILY_POINTS + bonusPoints;
    const insertedCheckInRows = await db
      .insert(dailyCheckins)
      .values({
        userId: context.userId,
        dayKey,
        monthKey,
        basePoints: DAILY_POINTS,
        bonusPoints,
        createdAt: completedAt,
      })
      .onConflictDoNothing()
      .returning({ dayKey: dailyCheckins.dayKey });

    if (insertedCheckInRows.length > 0) {
      await db
        .insert(userPoints)
        .values({
          userId: context.userId,
          balance: totalAward,
          lifetimeEarned: totalAward,
          updatedAt: completedAt,
        })
        .onConflictDoUpdate({
          target: userPoints.userId,
          set: {
            balance: sql`${userPoints.balance} + ${totalAward}`,
            lifetimeEarned: sql`${userPoints.lifetimeEarned} + ${totalAward}`,
            updatedAt: completedAt,
          },
        })
        .run();
    }

    await db
      .delete(trainingRecords)
      .where(
        and(
          eq(trainingRecords.userId, context.userId),
          lt(trainingRecords.completedAt, retentionStart)
        )
      )
      .run();

    return {
      recorded: true,
      checkIn: {
        awarded: insertedCheckInRows.length > 0,
        points: insertedCheckInRows.length > 0 ? totalAward : 0,
        dayKey,
      },
    };
  });
