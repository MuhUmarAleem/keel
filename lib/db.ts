import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { loadEnvFile } from "./load-env";

type SqlValue = string | number | null | bigint;
type SqlRow = Record<string, SqlValue>;

const globalForDb = globalThis as unknown as { keelDb?: DatabaseSync };

const RESET_TABLES = [
  "shares",
  "highlights",
  "action_items",
  "summaries",
  "transcripts",
  "meeting_attendees",
  "upcoming_events",
  "meetings",
  "people",
];

function bundledDatabase() {
  return path.join(process.cwd(), "data", "keel.db");
}

function databaseFile() {
  loadEnvFile();
  const bundled = bundledDatabase();
  if (process.env.VERCEL) {
    const runtime = path.join("/tmp", "keel.db");
    if (!fs.existsSync(runtime)) {
      if (!fs.existsSync(bundled)) {
        throw new Error("Seeded database was not included in this deployment.");
      }
      fs.copyFileSync(bundled, runtime);
    }
    return runtime;
  }
  const configured = (process.env["DATABASE_PATH"] || "").trim();
  if (!configured) return bundled;
  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured);
}

function schemaSql() {
  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Database schema not found at ${schemaPath}`);
  }
  return fs.readFileSync(schemaPath, "utf8");
}

export function migrate(db: DatabaseSync) {
  db.exec(schemaSql());
}

export function getDb() {
  if (!globalForDb.keelDb) {
    const file = databaseFile();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const db = new DatabaseSync(file);
    db.exec("PRAGMA foreign_keys = ON");
    db.exec("PRAGMA journal_mode = WAL");
    migrate(db);
    globalForDb.keelDb = db;
  }
  return globalForDb.keelDb;
}

export function resetDatabase() {
  const db = getDb();
  db.exec("PRAGMA foreign_keys = OFF");
  for (const table of RESET_TABLES) {
    db.exec(`DROP TABLE IF EXISTS ${table}`);
  }
  db.exec("PRAGMA foreign_keys = ON");
  migrate(db);
}

export function queryOne(sql: string, ...params: SqlValue[]) {
  return getDb().prepare(sql).get(...params) as SqlRow | undefined;
}

export function queryAll(sql: string, ...params: SqlValue[]) {
  return getDb().prepare(sql).all(...params) as SqlRow[];
}

export function execute(sql: string, ...params: SqlValue[]) {
  getDb().prepare(sql).run(...params);
}
