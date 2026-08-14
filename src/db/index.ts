import { drizzle } from "drizzle-orm/d1";
import { schema } from "./schema";
import { env } from "cloudflare:workers";

/**
 * Create Drizzle instance for Cloudflare D1
 * https://orm.drizzle.team/docs/connect-cloudflare-d1
 */
export function getDb() {
  // Better Auth's Drizzle adapter needs the complete schema to resolve its
  // session, account, and verification models at runtime.
  return drizzle(env.DB, { schema });
}
