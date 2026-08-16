import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Minimal .env reader for CLI scripts — Next.js loads these itself at runtime,
 * but drizzle-kit and the seed script run outside of it.
 */
export function loadEnv(files = [".env.local", ".env"]) {
  for (const file of files) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;
      const [, key, rawValue = ""] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2").trim();
    }
  }
}
