import { describe, expect, it } from 'vitest';
import { type LineInput, lineKey, prepMinutes, priceLine, priceOrder, PricingError, sameLines } from '@/lib/pricing';

describe('pricing', () => {
  it('prices a roll with extras and fills in the default spice', () => {
    const l = priceLine({ itemId: 'ghee-roast-roll', qty: 2, options: { extras: ['extra-cheese'] } });
    expect(l.unitPrice).toBe(179 + 30);
    expect(l.lineTotal).toBe(418);
    expect(l.choices.find((c) => c.groupId === 'spice')?.choiceId).toBe('medium');
    expect(l.summary).toEqual(['Medium', 'Extra cheese']);
  });

  it('hides free default choices from the ticket summary', () => {
    const l = priceLine({ itemId: 'hot-chocolate', qty: 1, options: {} });
    expect(l.summary).toEqual([]);
    expect(priceLine({ itemId: 'hot-chocolate', qty: 1, options: { milk: ['oat'] } }).unitPrice).toBe(169);
  });

  it('rejects unknown items, groups and choices', () => {
    expect(() => priceLine({ itemId: 'nope', qty: 1, options: {} })).toThrow(PricingError);
    expect(() => priceLine({ itemId: 'ghee-roast-roll', qty: 1, options: { sauce: ['x'] } })).toThrow(PricingError);
    expect(() => priceLine({ itemId: 'ghee-roast-roll', qty: 1, options: { spice: ['nuclear'] } })).toThrow(PricingError);
  });

  it('rejects two picks in a single-choice group and silly quantities', () => {
    expect(() => priceLine({ itemId: 'ghee-roast-roll', qty: 1, options: { spice: ['mild', 'hot'] } })).toThrow(PricingError);
    expect(() => priceLine({ itemId: 'salted-fries', qty: 0, options: {} })).toThrow(PricingError);
    expect(() => priceLine({ itemId: 'salted-fries', qty: 21, options: {} })).toThrow(PricingError);
  });

  it('takes the priciest base item off when the free usual is used', () => {
    const lines: LineInput[] = [
      { itemId: 'chipotle-cheese-roll', qty: 1, options: { extras: ['extra-paneer'] } },
      { itemId: 'cold-coffee', qty: 2, options: {} },
    ];
    const o = priceOrder(lines, { useReward: true });
    expect(o.subtotal).toBe(199 + 40 + 99 * 2);
    expect(o.discount).toBe(199);
    expect(o.total).toBe(o.subtotal - 199);
    expect(o.rewardItemId).toBe('chipotle-cheese-roll');
    expect(priceOrder(lines).discount).toBe(0);
  });

  it('refuses an empty order', () => {
    expect(() => priceOrder([])).toThrow(PricingError);
  });

  it('builds stable line keys regardless of option order', () => {
    const a = lineKey({ itemId: 'ghee-roast-roll', options: { extras: ['extra-paneer', 'extra-cheese'], spice: ['hot'] } });
    const b = lineKey({ itemId: 'ghee-roast-roll', options: { spice: ['hot'], extras: ['extra-cheese', 'extra-paneer'] } });
    expect(a).toBe(b);
  });

  it('compares orders by customisation, not just names', () => {
    const hot = [{ itemId: 'ghee-roast-roll', qty: 1, options: { spice: ['hot'] } }];
    const mild = [{ itemId: 'ghee-roast-roll', qty: 1, options: { spice: ['mild'] } }];
    expect(sameLines(hot, hot)).toBe(true);
    expect(sameLines(hot, mild)).toBe(false);
  });

  it('estimates prep from the slowest item plus volume', () => {
    expect(prepMinutes([{ itemId: 'cold-coffee', qty: 1, options: {} }])).toBe(3);
    expect(prepMinutes([{ itemId: 'chipotle-cheese-roll', qty: 4, options: {} }])).toBe(9);
  });
});
