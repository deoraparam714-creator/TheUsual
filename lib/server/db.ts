import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { DatabaseSync } from 'node:sqlite';

// SQLite through Node's built-in driver (Node ≥ 22.13): a real SQL database with
// zero native dependencies. Loaded at runtime so the bundler never tries to resolve it.

const g = globalThis as unknown as { __usualDb?: DatabaseSync };

const SCHEMA_VERSION = 1;

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      number INTEGER NOT NULL,
      day TEXT NOT NULL,
      status TEXT NOT NULL,
      name_on_cup TEXT NOT NULL,
      phone TEXT NOT NULL,
      location_id TEXT NOT NULL,
      pickup_at TEXT NOT NULL,
      is_asap INTEGER NOT NULL,
      lines_json TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      discount INTEGER NOT NULL,
      total INTEGER NOT NULL,
      reward_used INTEGER NOT NULL DEFAULT 0,
      tally_stamps INTEGER NOT NULL,
      tally_reward INTEGER NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'pay_at_pickup',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      making_at TEXT,
      ready_at TEXT,
      collected_at TEXT,
      cancelled_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status, created_at);
    CREATE INDEX IF NOT EXISTS idx_orders_day ON orders (day, number);
    CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders (phone);
    CREATE TABLE IF NOT EXISTS regulars (
      phone TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      stamps INTEGER NOT NULL DEFAULT 0,
      reward_available INTEGER NOT NULL DEFAULT 0,
      total_orders INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  db.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run('schema_version', String(SCHEMA_VERSION));
}

function loadSqlite(): typeof import('node:sqlite') {
  // Node prints an ExperimentalWarning the first time node:sqlite loads; keep logs clean.
  const original = process.emitWarning;
  process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
    const msg = typeof warning === 'string' ? warning : warning?.message;
    if (msg?.includes('SQLite is an experimental feature')) return;
    return (original as (...a: unknown[]) => void).call(process, warning, ...rest);
  }) as typeof process.emitWarning;
  try {
    return process.getBuiltinModule('node:sqlite') as typeof import('node:sqlite');
  } finally {
    process.emitWarning = original;
  }
}

export function db(): DatabaseSync {
  if (g.__usualDb) return g.__usualDb;
  const { DatabaseSync } = loadSqlite();
  const file = process.env.DATABASE_PATH === ':memory:' ? ':memory:' : path.resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH ?? './data/the-usual.db');
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const instance = new DatabaseSync(file);
  instance.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 4000; PRAGMA foreign_keys = ON;');
  migrate(instance);
  g.__usualDb = instance;
  return instance;
}

/** Run fn inside an IMMEDIATE transaction. */
export function tx<T>(fn: (d: DatabaseSync) => T): T {
  const d = db();
  d.exec('BEGIN IMMEDIATE');
  try {
    const out = fn(d);
    d.exec('COMMIT');
    return out;
  } catch (e) {
    d.exec('ROLLBACK');
    throw e;
  }
}
