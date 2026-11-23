import 'server-only';
import crypto from 'node:crypto';
import type { SQLInputValue } from 'node:sqlite';
import { priceOrder, prepMinutes, type PricedLine, PricingError } from '@/lib/pricing';
import { type CreateOrderInput, createOrderSchema, type OrderStatus } from '@/lib/schemas';
import { getLocation, getOrderableLocation } from '@/lib/site';
import { isValidSlot, istDayKey, planSlots } from '@/lib/slots';
import { applyVisit } from '@/lib/tally';
import { db, tx } from './db';

export class OrderError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export type PublicOrder = {
  id: string;
  number: number;
  status: OrderStatus;
  nameOnCup: string;
  locationId: string;
  pickupAt: string;
  isAsap: boolean;
  lines: PricedLine[];
  subtotal: number;
  discount: number;
  total: number;
  rewardUsed: boolean;
  tally: { stamps: number; rewardAvailable: boolean };
  paymentMethod: 'pay_at_pickup';
  createdAt: string;
  updatedAt: string;
  times: { making: string | null; ready: string | null; collected: string | null; cancelled: string | null };
};

export type KitchenOrder = PublicOrder & { phoneLast4: string };

type Row = Record<string, SQLInputValue>;

function toPublic(r: Row): PublicOrder {
  return {
    id: String(r.id),
    number: Number(r.number),
    status: r.status as OrderStatus,
    nameOnCup: String(r.name_on_cup),
    locationId: String(r.location_id),
    pickupAt: String(r.pickup_at),
    isAsap: Boolean(r.is_asap),
    lines: JSON.parse(String(r.lines_json)) as PricedLine[],
    subtotal: Number(r.subtotal),
    discount: Number(r.discount),
    total: Number(r.total),
    rewardUsed: Boolean(r.reward_used),
    tally: { stamps: Number(r.tally_stamps), rewardAvailable: Boolean(r.tally_reward) },
    paymentMethod: 'pay_at_pickup',
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
    times: {
      making: (r.making_at as string | null) ?? null,
      ready: (r.ready_at as string | null) ?? null,
      collected: (r.collected_at as string | null) ?? null,
      cancelled: (r.cancelled_at as string | null) ?? null,
    },
  };
}

function toKitchen(r: Row): KitchenOrder {
  return { ...toPublic(r), phoneLast4: String(r.phone).slice(-4) };
}

const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
function newId(): string {
  const bytes = crypto.randomBytes(12);
  let out = '';
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

export function createOrder(raw: unknown, now: Date = new Date()): PublicOrder {
  const parsed = createOrderSchema.safeParse(raw);
  if (!parsed.success) throw new OrderError(parsed.error.issues[0]?.message ?? 'Something’s off with that order.', 422);
  const input = parsed.data;

  const location = getOrderableLocation(input.locationId);
  if (!location) throw new OrderError(getLocation(input.locationId) ? 'We’re not open there yet. Pick another pickup spot?' : 'We don’t have a counter there.', 422);

  const prep = prepMinutes(input.lines);
  let pickupAt: string;
  if (input.pickup.type === 'asap') {
    const plan = planSlots(location, now, prep);
    if (!plan.asapAvailable || !plan.asapReadyAt) throw new OrderError(`${location.name} is closed right now. Pick a later time?`, 409);
    pickupAt = plan.asapReadyAt;
  } else {
    if (!isValidSlot(location, input.pickup.at, now, prep)) throw new OrderError('That pickup time just went. Pick another?', 409);
    pickupAt = new Date(input.pickup.at).toISOString();
  }

  return tx((d) => {
    const regular = d.prepare('SELECT * FROM regulars WHERE phone = ?').get(input.phone) as Row | undefined;
    const current = { stamps: Number(regular?.stamps ?? 0), rewardAvailable: Boolean(regular?.reward_available) };
    if (input.useReward && !current.rewardAvailable) throw new OrderError('There’s no free usual on this number yet.', 409);

    let priced;
    try {
      priced = priceOrder(input.lines, { useReward: input.useReward });
    } catch (e) {
      if (e instanceof PricingError) throw new OrderError(e.message, 422);
      throw e;
    }

    const next = applyVisit(current, input.useReward);
    const ts = now.toISOString();
    if (regular) {
      d.prepare('UPDATE regulars SET name = ?, stamps = ?, reward_available = ?, total_orders = total_orders + 1, updated_at = ? WHERE phone = ?').run(
        input.nameOnCup,
        next.stamps,
        next.rewardAvailable ? 1 : 0,
        ts,
        input.phone,
      );
    } else {
      d.prepare('INSERT INTO regulars (phone, name, stamps, reward_available, total_orders, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?)').run(
        input.phone,
        input.nameOnCup,
        next.stamps,
        next.rewardAvailable ? 1 : 0,
        ts,
        ts,
      );
    }

    const day = istDayKey(now);
    const { n } = d.prepare('SELECT COALESCE(MAX(number), 0) + 1 AS n FROM orders WHERE day = ?').get(day) as { n: number };
    const id = newId();
    d.prepare(
      `INSERT INTO orders (id, number, day, status, name_on_cup, phone, location_id, pickup_at, is_asap, lines_json, subtotal, discount, total, reward_used, tally_stamps, tally_reward, created_at, updated_at)
       VALUES (?, ?, ?, 'received', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      n,
      day,
      input.nameOnCup,
      input.phone,
      location.id,
      pickupAt,
      input.pickup.type === 'asap' ? 1 : 0,
      JSON.stringify(priced.lines),
      priced.subtotal,
      priced.discount,
      priced.total,
      input.useReward ? 1 : 0,
      next.stamps,
      next.rewardAvailable ? 1 : 0,
      ts,
      ts,
    );
    return toPublic(d.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Row);
  });
}

export function getOrder(id: string): PublicOrder | null {
  if (!/^[a-z0-9]{8,24}$/.test(id)) return null;
  const row = db().prepare('SELECT * FROM orders WHERE id = ?').get(id) as Row | undefined;
  return row ? toPublic(row) : null;
}

export function getRegular(phone: string) {
  const row = db().prepare('SELECT stamps, reward_available, total_orders FROM regulars WHERE phone = ?').get(phone) as Row | undefined;
  return { stamps: Number(row?.stamps ?? 0), rewardAvailable: Boolean(row?.reward_available), totalOrders: Number(row?.total_orders ?? 0) };
}

/** Orders the kitchen should see: anything in progress, plus the last few hours of finished ones. */
export function listKitchenOrders(now: Date = new Date()): KitchenOrder[] {
  const since = new Date(now.getTime() - 36 * 3600_000).toISOString();
  const doneSince = new Date(now.getTime() - 3 * 3600_000).toISOString();
  const rows = db()
    .prepare(
      `SELECT * FROM orders
       WHERE (status IN ('received','making','ready') AND created_at >= ?)
          OR (status IN ('collected','cancelled') AND updated_at >= ?)
       ORDER BY pickup_at ASC, number ASC`,
    )
    .all(since, doneSince) as Row[];
  return rows.map(toKitchen);
}

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  received: ['making', 'ready', 'cancelled'],
  making: ['ready', 'received', 'cancelled'],
  ready: ['collected', 'making', 'cancelled'],
  collected: ['ready'],
  cancelled: [],
};

const TIME_COLUMN: Partial<Record<OrderStatus, string>> = {
  making: 'making_at',
  ready: 'ready_at',
  collected: 'collected_at',
  cancelled: 'cancelled_at',
};

export function updateOrderStatus(id: string, status: OrderStatus, now: Date = new Date()): KitchenOrder {
  return tx((d) => {
    const row = d.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Row | undefined;
    if (!row) throw new OrderError('No order with that number.', 404);
    const from = row.status as OrderStatus;
    if (from === status) return toKitchen(row);
    if (!TRANSITIONS[from].includes(status)) throw new OrderError(`Can’t move an order from ${from} to ${status}.`, 409);
    const ts = now.toISOString();
    const col = TIME_COLUMN[status];
    d.prepare(`UPDATE orders SET status = ?, updated_at = ?${col ? `, ${col} = ?` : ''} WHERE id = ?`).run(...([status, ts, ...(col ? [ts] : []), id] as SQLInputValue[]));

    if (status === 'cancelled') {
      // Give the stroke back (and the free usual, if one was used).
      const reg = d.prepare('SELECT * FROM regulars WHERE phone = ?').get(row.phone) as Row | undefined;
      if (reg) {
        let stamps = Number(reg.stamps);
        let reward = Boolean(reg.reward_available);
        if (stamps > 0) stamps -= 1;
        else if (reward) {
          reward = false;
          stamps = 4;
        }
        if (row.reward_used) reward = true;
        d.prepare('UPDATE regulars SET stamps = ?, reward_available = ?, total_orders = MAX(0, total_orders - 1), updated_at = ? WHERE phone = ?').run(stamps, reward ? 1 : 0, ts, row.phone);
      }
    }
    return toKitchen(d.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Row);
  });
}

export type { CreateOrderInput };
