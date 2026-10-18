import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getDb } from '@/db';
import { aiWaitlist } from '@/db/app.schema';

export const joinAiWaitlist = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      email: z.email().max(254),
      honeypot: z.string().max(200).optional(),
      locale: z.string().max(12).optional(),
    })
  )
  .handler(async ({ data }) => {
    // Honeypot submissions are accepted silently and never persisted.
    if (data.honeypot?.trim()) return { success: true };
    const email = data.email.trim().toLowerCase();
    await getDb()
      .insert(aiWaitlist)
      .values({
        id: crypto.randomUUID(),
        email,
        createdAt: new Date(),
        locale: data.locale ?? null,
      })
      .onConflictDoNothing();
    return { success: true };
  });
