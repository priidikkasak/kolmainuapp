import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

/**
 * `db` is null until a database is provisioned. The content layer falls back to
 * the bundled seed content so the public site never depends on it.
 */
declare global {
  // eslint-disable-next-line no-var
  var __kolmainuSql: ReturnType<typeof postgres> | undefined;
}

function connect() {
  if (!url) return null;
  // Reuse across HMR reloads and warm lambdas; serverless wants a tiny pool.
  const sql =
    globalThis.__kolmainuSql ??
    postgres(url, { max: 1, prepare: false, idle_timeout: 20 });
  if (process.env.NODE_ENV !== "production") globalThis.__kolmainuSql = sql;
  return drizzle(sql, { schema });
}

export const db = connect();

export function requireDb() {
  if (!db) {
    throw new Error(
      "DATABASE_URL puudub. Lisa andmebaasi ühendus, et sisuhaldust kasutada."
    );
  }
  return db;
}

export const hasDb = Boolean(url);
