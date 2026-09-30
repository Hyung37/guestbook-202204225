// Next 밖에서 실행되므로 .env.local을 직접 불러온다.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

nextEnv.loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL이 없습니다. .env.local을 확인하세요.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const dir = join(process.cwd(), "db", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

for (const file of files) {
  const statements = readFileSync(join(dir, file), "utf8")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`applied ${file}`);
}
