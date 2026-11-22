import { menuById, type MenuItem } from './menu';

/** What the client sends and what the cart stores. */
export type LineInput = {
  itemId: string;
  qty: number;
  /** groupId → selected choice ids */
  options: Record<string, string[]>;
  note?: string;
};

export type PricedChoice = { groupId: string; groupLabel: string; choiceId: string; label: string; price: number };

export type PricedLine = {
  itemId: string;
  name: string;
  qty: number;
  basePrice: number;
  unitPrice: number;
  lineTotal: number;
  choices: PricedChoice[];
  /** Human summary, e.g. ["Hot", "Extra cheese"] */
  summary: string[];
  note?: string;
};

export type PricedOrder = {
  lines: PricedLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  /** Item that the free usual was applied to. */
  rewardItemId: string | null;
};

export class PricingError extends Error {}

export const MAX_QTY_PER_LINE = 20;
export const MAX_LINES = 30;

/**
 * Validate the chosen options for an item and fill in defaults for single-choice groups.
 * Unknown groups/choices throw — never trust the client.
 */
export function normalizeOptions(item: MenuItem, options: Record<string, string[]> = {}): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const key of Object.keys(options)) {
    if (!item.options.some((g) => g.id === key)) throw new PricingError(`Unknown option “${key}” for ${item.name}.`);
  }
  for (const group of item.options) {
    const picked = Array.from(new Set(options[group.id] ?? []));
    for (const id of picked) {
      if (!group.choices.some((c) => c.id === id)) throw new PricingError(`Unknown choice “${id}” for ${item.name}.`);
    }
    if (group.type === 'single') {
      if (picked.length > 1) throw new PricingError(`Pick one ${group.label.toLowerCase()} for ${item.name}.`);
      const chosen = picked[0] ?? group.defaultChoice ?? group.choices[0]?.id;
      if (chosen) out[group.id] = [chosen];
    } else {
      const max = group.max ?? group.choices.length;
      if (picked.length > max) throw new PricingError(`Too many ${group.label.toLowerCase()} for ${item.name}.`);
      if (picked.length) out[group.id] = picked.sort();
    }
  }
  return out;
}

export function priceLine(input: LineInput): PricedLine {
  const item = menuById[input.itemId];
  if (!item) throw new PricingError('That item isn’t on the menu any more.');
  const qty = Math.floor(input.qty);
  if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) throw new PricingError(`Quantity for ${item.name} must be 1–${MAX_QTY_PER_LINE}.`);
  const options = normalizeOptions(item, input.options);
  const choices: PricedChoice[] = [];
  for (const group of item.options) {
    for (const id of options[group.id] ?? []) {
      const c = group.choices.find((x) => x.id === id)!;
      choices.push({ groupId: group.id, groupLabel: group.label, choiceId: c.id, label: c.label, price: c.price ?? 0 });
    }
  }
  const unitPrice = item.price + choices.reduce((s, c) => s + c.price, 0);
  // Summary hides default free choices that are the norm (e.g. "Dairy", "Regular") to keep tickets short.
  const summary = choices
    .filter((c) => {
      const g = item.options.find((x) => x.id === c.groupId)!;
      return !(g.type === 'single' && c.choiceId === g.defaultChoice && c.price === 0 && g.id !== 'spice' && g.id !== 'dip');
    })
    .map((c) => c.label);
  const note = input.note?.trim().slice(0, 140) || undefined;
  return { itemId: item.id, name: item.name, qty, basePrice: item.price, unitPrice, lineTotal: unitPrice * qty, choices, summary, note };
}

/**
 * Price a whole order. When `useReward` is true (a full tally), the most
 * expensive single item's base price comes off — "fill five, the next one's on us".
 */
export function priceOrder(lines: LineInput[], opts: { useReward?: boolean } = {}): PricedOrder {
  if (!lines.length) throw new PricingError('Your order is empty.');
  if (lines.length > MAX_LINES) throw new PricingError('That’s a big order. Call us and we’ll sort it.');
  const priced = lines.map(priceLine);
  const subtotal = priced.reduce((s, l) => s + l.lineTotal, 0);
  let discount = 0;
  let rewardItemId: string | null = null;
  if (opts.useReward) {
    const best = priced.reduce<PricedLine | null>((a, l) => (!a || l.basePrice > a.basePrice ? l : a), null);
    if (best) {
      discount = Math.min(best.basePrice, subtotal);
      rewardItemId = best.itemId;
    }
  }
  const itemCount = priced.reduce((s, l) => s + l.qty, 0);
  return { lines: priced, itemCount, subtotal, discount, total: subtotal - discount, rewardItemId };
}

/** Estimated minutes to make an order: the slowest item, plus a minute per extra item beyond two. */
export function prepMinutes(lines: LineInput[]): number {
  if (!lines.length) return 6;
  const slowest = Math.max(...lines.map((l) => menuById[l.itemId]?.prep ?? 6));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return Math.min(20, slowest + Math.max(0, count - 2));
}

/** Stable key so identical customisations merge in the cart. */
export function lineKey(input: Pick<LineInput, 'itemId' | 'options' | 'note'>): string {
  const opts = Object.keys(input.options)
    .sort()
    .map((k) => `${k}=${[...input.options[k]].sort().join('+')}`)
    .join('&');
  return `${input.itemId}?${opts}#${(input.note ?? '').trim().toLowerCase()}`;
}

/** "Ghee Roast Roll + Cold Coffee" style label. */
export function describeLines(lines: { itemId: string; qty: number }[]): string {
  return lines
    .map((l) => {
      const name = menuById[l.itemId]?.name ?? 'Something good';
      return l.qty > 1 ? `${l.qty} × ${name}` : name;
    })
    .join(' + ');
}

/** True when two orders contain exactly the same customised items and quantities. */
export function sameLines(a: LineInput[], b: LineInput[]): boolean {
  const k = (ls: LineInput[]) =>
    ls
      .map((l) => `${lineKey(l)}*${l.qty}`)
      .sort()
      .join('|');
  return k(a) === k(b);
}
