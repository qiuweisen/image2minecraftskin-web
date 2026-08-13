import { createFileRoute } from '@tanstack/react-router';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/auth/auth';
import { getDb } from '@/db';
import { userIndicatorProfiles } from '@/db/app.schema';
import {
  SHARED_INDICATOR_SCOPE,
  hashIndicatorTemplate,
  hasUserIndicators,
  normalizeIndicatorTemplate,
  serializeIndicatorTemplate,
  type ChartIndicatorTemplate,
} from '@/lib/chartIndicators';

const MAX_TEMPLATE_BYTES = 256 * 1024;
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
};

function getScope(request: Request) {
  const scope = new URL(request.url).searchParams.get('scope');
  return scope === SHARED_INDICATOR_SCOPE ? scope : null;
}

function asIso(value: Date | number | null | undefined) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number') return new Date(value).toISOString();
  return null;
}

function profilePayload(
  authenticated: boolean,
  profile: typeof userIndicatorProfiles.$inferSelect | null,
  extra: Record<string, unknown> = {}
) {
  let template: ChartIndicatorTemplate | null = null;
  if (profile) {
    try {
      template = normalizeIndicatorTemplate(JSON.parse(profile.templateJson));
    } catch {
      template = null;
    }
  }

  return {
    authenticated,
    scope: SHARED_INDICATOR_SCOPE,
    template,
    templateHash: profile?.templateHash || null,
    version: profile?.version ?? 1,
    updatedAt: asIso(profile?.updatedAt),
    ...extra,
  };
}

async function getSessionUserId() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  return session?.user?.id ?? null;
}

export const Route = createFileRoute('/api/chart-settings')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const scope = getScope(request);
        if (!scope) {
          return Response.json(
            { authenticated: false, template: null, templateHash: null },
            { status: 400, headers: NO_STORE_HEADERS }
          );
        }

        const userId = await getSessionUserId();
        if (!userId) {
          return Response.json(profilePayload(false, null), {
            headers: NO_STORE_HEADERS,
          });
        }

        const db = getDb();
        const [profile] = await db
          .select()
          .from(userIndicatorProfiles)
          .where(
            and(
              eq(userIndicatorProfiles.userId, userId),
              eq(userIndicatorProfiles.scope, scope)
            )
          )
          .limit(1);

        return Response.json(profilePayload(true, profile ?? null), {
          headers: NO_STORE_HEADERS,
        });
      },

      PUT: async ({ request }) => {
        const scope = getScope(request);
        if (!scope) {
          return Response.json(
            { error: 'Invalid indicator scope.' },
            { status: 400, headers: NO_STORE_HEADERS }
          );
        }

        const userId = await getSessionUserId();
        if (!userId) {
          return Response.json(
            { error: 'Unauthorized' },
            { status: 401, headers: NO_STORE_HEADERS }
          );
        }

        const contentLength = Number(request.headers.get('content-length'));
        if (
          Number.isFinite(contentLength) &&
          contentLength > MAX_TEMPLATE_BYTES
        ) {
          return Response.json(
            { error: 'Indicator template is too large.' },
            { status: 413, headers: NO_STORE_HEADERS }
          );
        }

        const bodyText = await request.text();
        if (bodyText.length > MAX_TEMPLATE_BYTES) {
          return Response.json(
            { error: 'Indicator template is too large.' },
            { status: 413, headers: NO_STORE_HEADERS }
          );
        }

        let body: unknown;
        try {
          body = JSON.parse(bodyText);
        } catch {
          return Response.json(
            { error: 'Invalid JSON.' },
            { status: 400, headers: NO_STORE_HEADERS }
          );
        }

        const rawTemplate =
          typeof body === 'object' && body !== null && 'template' in body
            ? (body as { template?: unknown }).template
            : null;
        const template = normalizeIndicatorTemplate(rawTemplate) ?? {
          version: 1,
          panes: [],
        };
        const templateJson = serializeIndicatorTemplate(template);
        if (!templateJson) {
          return Response.json(
            { error: 'Invalid indicator template.' },
            { status: 400, headers: NO_STORE_HEADERS }
          );
        }

        const db = getDb();
        const [current] = await db
          .select()
          .from(userIndicatorProfiles)
          .where(
            and(
              eq(userIndicatorProfiles.userId, userId),
              eq(userIndicatorProfiles.scope, scope)
            )
          )
          .limit(1);

        // Do not create rows for users who have never used an indicator. An
        // existing empty profile is retained as a deletion tombstone so an
        // older device cannot resurrect removed indicators.
        if (!current && !hasUserIndicators(template)) {
          return Response.json(profilePayload(true, null, { saved: false }), {
            headers: NO_STORE_HEADERS,
          });
        }

        const templateHash = await hashIndicatorTemplate(template);
        if (current?.templateHash === templateHash) {
          return Response.json(
            profilePayload(true, current, { saved: false }),
            {
              headers: NO_STORE_HEADERS,
            }
          );
        }

        const updatedAt = new Date();
        await db
          .insert(userIndicatorProfiles)
          .values({
            userId,
            scope,
            templateJson,
            templateHash,
            version: template.version,
            updatedAt,
          })
          .onConflictDoUpdate({
            target: [userIndicatorProfiles.userId, userIndicatorProfiles.scope],
            set: {
              templateJson,
              templateHash,
              version: template.version,
              updatedAt,
            },
          });

        const [saved] = await db
          .select()
          .from(userIndicatorProfiles)
          .where(
            and(
              eq(userIndicatorProfiles.userId, userId),
              eq(userIndicatorProfiles.scope, scope)
            )
          )
          .limit(1);

        return Response.json(
          profilePayload(true, saved ?? null, { saved: true }),
          {
            headers: NO_STORE_HEADERS,
          }
        );
      },
    },
  },
});
