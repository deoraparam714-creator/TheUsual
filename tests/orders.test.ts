import { beforeAll, describe, expect, it } from 'vitest';

process.env.DATABASE_PATH = ':memory:';

type Mod = typeof import('@/lib/server/orders');
let m: Mod;
beforeAll(async () => {
  m = await import('@/lib/server/orders');
});

const ist = (s: string) => new Date(`${s}+05:30`);
const NOW = ist('2026-11-23T10:30:00'); // Monday, campus open

const base = (over: Record<string, unknown> = {}) => ({
  locationId: 'campus',
  pickup: { type: 'asap' },
  nameOnCup: 'Riya',
  phone: '+91 98765 43210',
  lines: [{ itemId: 'ghee-roast-roll', qty: 1, options: { spice: ['hot'] } }],
  ...over,
});

describe('orders repository', () => {
  it('creates an order with server-side prices and a daily number', () => {
    const o = m.createOrder(base(), NOW);
    expect(o.number).toBe(1);
    expect(o.status).toBe('received');
    expect(o.total).toBe(179);
    expect(o.pickupAt).toBe(ist('2026-11-23T10:36:00').toISOString());
    expect(o.tally).toEqual({ stamps: 1, rewardAvailable: false });
    expect(m.createOrder(base(), NOW).number).toBe(2);
    expect(m.getOrder(o.id)?.nameOnCup).toBe('Riya');
  });

  it('ignores prices sent by the client', () => {
    const o = m.createOrder(base({ phone: '9000000001', lines: [{ itemId: 'salted-fries', qty: 1, options: {}, price: 1 }] }), NOW);
    expect(o.total).toBe(99);
  });

  it('rejects bad input with friendly messages', () => {
    expect(() => m.createOrder(base({ nameOnCup: '' }), NOW)).toThrow('No name, no cup');
    expect(() => m.createOrder(base({ phone: '12345' }), NOW)).toThrow('10-digit');
    expect(() => m.createOrder(base({ locationId: 'mars' }), NOW)).toThrow();
    expect(() => m.createOrder(base(), ist('2026-11-23T02:00:00'))).toThrow('closed');
  });

  it('unlocks a free usual after five orders and applies it once', () => {
    const phone = '9111111111';
    expect(() => m.createOrder(base({ phone, useReward: true }), NOW)).toThrow('no free usual');
    for (let i = 0; i < 5; i++) m.createOrder(base({ phone }), NOW);
    expect(m.getRegular(phone)).toEqual({ stamps: 0, rewardAvailable: true, totalOrders: 5 });
    const free = m.createOrder(base({ phone, useReward: true, lines: [{ itemId: 'ghee-roast-bowl', qty: 1, options: {} }, { itemId: 'cold-coffee', qty: 1, options: {} }] }), NOW);
    expect(free.discount).toBe(219);
    expect(free.total).toBe(99);
    expect(m.getRegular(phone).rewardAvailable).toBe(false);
  });

  it('moves orders through the kitchen and refunds the stroke on cancel', () => {
    const phone = '9222222222';
    const o = m.createOrder(base({ phone }), NOW);
    expect(m.updateOrderStatus(o.id, 'making', NOW).status).toBe('making');
    expect(m.updateOrderStatus(o.id, 'ready', NOW).times.ready).toBe(NOW.toISOString());
    expect(() => m.updateOrderStatus(o.id, 'received', NOW)).toThrow();
    const c = m.createOrder(base({ phone }), NOW);
    expect(m.getRegular(phone).stamps).toBe(2);
    m.updateOrderStatus(c.id, 'cancelled', NOW);
    expect(m.getRegular(phone)).toMatchObject({ stamps: 1, totalOrders: 1 });
    expect(() => m.updateOrderStatus(c.id, 'making', NOW)).toThrow();
    expect(m.listKitchenOrders(NOW).some((k) => k.id === o.id && k.phoneLast4 === '2222')).toBe(true);
  });
});
