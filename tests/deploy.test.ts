import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectStorage, resolveDbFile } from '@/lib/server/db';

describe('database location', () => {
  it('prefers DATABASE_PATH, then a Railway volume, then ./data', () => {
    expect(resolveDbFile({ DATABASE_PATH: '/srv/usual.db', RAILWAY_VOLUME_MOUNT_PATH: '/vol' })).toBe('/srv/usual.db');
    expect(resolveDbFile({ DATABASE_PATH: ':memory:' })).toBe(':memory:');
    expect(resolveDbFile({ RAILWAY_VOLUME_MOUNT_PATH: '/vol' })).toBe('/vol/the-usual.db');
    expect(resolveDbFile({})).toBe(path.resolve('./data/the-usual.db'));
  });

  it('reports memory and same-device storage correctly', () => {
    expect(detectStorage(':memory:')).toBe('memory');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'usual-'));
    const sameDevice = fs.statSync(dir).dev === fs.statSync('/').dev;
    expect(detectStorage(path.join(dir, 'x.db'))).toBe(sameDevice ? 'local-disk' : 'volume');
  });
});

describe('kitchen settings in production', () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
    vi.resetModules();
  });

  async function load(env: Record<string, string | undefined>) {
    vi.resetModules();
    process.env = { ...saved, NODE_ENV: 'production', ...env } as NodeJS.ProcessEnv;
    for (const [k, v] of Object.entries(env)) if (v === undefined) delete process.env[k];
    return import('@/lib/server/auth');
  }

  it('stays locked without KITCHEN_PIN', async () => {
    const auth = await load({ KITCHEN_PIN: undefined, SESSION_SECRET: undefined });
    expect(auth.kitchenConfig()).toBeNull();
    expect(auth.checkPin('2468')).toBe(false);
  });

  it('works with only KITCHEN_PIN, using a random session secret', async () => {
    const auth = await load({ KITCHEN_PIN: '9182', SESSION_SECRET: undefined });
    const cfg = auth.kitchenConfig();
    expect(cfg?.pin).toBe('9182');
    expect(cfg?.secret).toMatch(/^[0-9a-f]{64}$/);
    expect(auth.checkPin('9182')).toBe(true);
    expect(auth.checkPin('2468')).toBe(false);
    const token = auth.createSessionToken();
    expect(auth.verifySessionToken(token)).toBe(true);
    expect(auth.verifySessionToken(token.slice(0, -2) + 'xx')).toBe(false);
  });
});
