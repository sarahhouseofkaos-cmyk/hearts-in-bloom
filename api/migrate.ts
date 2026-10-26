// Applies the committed SQL migrations in db/migrations to the database named by
// DATABASE_URL. Safe to run on every deploy: already-applied migrations are
// skipped, and nothing here drops or rewrites existing tables or data.
// Bundled to dist/migrate.js; run with `node dist/migrate.js`.
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createPool } from "mysql2/promise";
import { resolve } from "node:path";
import { parseDatabaseUrl } from "./lib/dbconfig";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const pool = createPool(parseDatabaseUrl(url, process.env.DATABASE_CA_CERT));
try {
  await migrate(drizzle(pool), {
    migrationsFolder: resolve(import.meta.dirname, "../db/migrations"),
  });
  console.log("Database migrations applied");
} catch (error) {
  console.error("Database migration failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
} finally {
  await pool.end();
}
