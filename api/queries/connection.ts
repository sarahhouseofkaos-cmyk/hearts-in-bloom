import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { env } from "../lib/env";
import { parseDatabaseUrl } from "../lib/dbconfig";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    // Pool connections are opened lazily, so the server can start before the
    // database is reachable. TLS settings come from the URL (ssl-mode) and the
    // optional DATABASE_CA_CERT; see lib/dbconfig.ts.
    const pool = createPool(parseDatabaseUrl(env.databaseUrl, process.env.DATABASE_CA_CERT));
    instance = drizzle(pool, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}
