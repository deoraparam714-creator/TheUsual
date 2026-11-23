import { describe, expect, it } from 'vitest';
import { formatHours, getLocation, locationHoursLabel } from '@/lib/site';
import { isValidSlot, istDayKey, planSlots } from '@/lib/slots';

const takeaway = getLocation('rj-twin')!; // Mon–Sat 08:00–18:00
const cafe = getLocation('cafe')!; // daily 08:00–22:00
const mesa = getLocation('mesa')!; // pre-order only, Mon–Sat 08:00–18:00

// Helper: an instant given as IST wall-clock time.
const ist = (s: string) => new Date(`${s}+05:30`);

describe('pickup slots (IST)', () => {
  it('is closed at 2 am and opens at 8', () => {
    const p = planSlots(cafe, ist('2026-11-23T02:00:00'), 6);
    expect(p.openNow).toBe(false);
    expect(p.asapAvailable).toBe(false);
    expect(p.opensAt).toBe(ist('2026-11-23T08:00:00').toISOString());
    expect(p.slots[0]).toEqual({ at: ist('2026-11-23T08:15:00').toISOString(), dayLabel: 'Today' });
  });

  it('offers ASAP when open, ready after the prep time', () => {
    const now = ist('2026-11-23T10:30:00'); // Monday
    const p = planSlots(takeaway, now, 6);
    expect(p.openNow).toBe(true);
    expect(p.asapReadyAt).toBe(ist('2026-11-23T10:36:00').toISOString());
    // First scheduled slot leaves room for prep + 5 min, rounded to 15.
    expect(p.slots[0].at).toBe(ist('2026-11-23T10:45:00').toISOString());
    expect(p.slots.at(-1)?.dayLabel).toBe('Tomorrow');
  });

  it('never offers ASAP at a pre-order-only location, but still has slots', () => {
    const p = planSlots(mesa, ist('2026-11-23T10:30:00'), 6);
    expect(p.openNow).toBe(true);
    expect(p.asapAvailable).toBe(false);
    expect(p.slots[0].at).toBe(ist('2026-11-23T10:45:00').toISOString());
  });

  it('stops ASAP when there is no time to make it before close', () => {
    const p = planSlots(takeaway, ist('2026-11-23T17:57:00'), 6);
    expect(p.openNow).toBe(true);
    expect(p.asapAvailable).toBe(false);
  });

  it('skips closed days', () => {
    const p = planSlots(takeaway, ist('2026-11-22T12:00:00'), 6); // Sunday
    expect(p.openNow).toBe(false);
    expect(p.slots[0].dayLabel).toBe('Tomorrow');
    expect(p.opensAt).toBe(ist('2026-11-23T08:00:00').toISOString());
  });

  it('validates requested slots', () => {
    const now = ist('2026-11-23T10:30:00');
    expect(isValidSlot(takeaway, ist('2026-11-23T12:00:00').toISOString(), now, 6)).toBe(true);
    expect(isValidSlot(takeaway, ist('2026-11-23T12:07:00').toISOString(), now, 6)).toBe(false); // off-grid
    expect(isValidSlot(takeaway, ist('2026-11-23T10:31:00').toISOString(), now, 6)).toBe(false); // too soon
    expect(isValidSlot(takeaway, ist('2026-11-23T19:00:00').toISOString(), now, 6)).toBe(false); // after close
    expect(isValidSlot(takeaway, 'not a date', now, 6)).toBe(false);
  });

  it('keys order numbers by IST calendar day', () => {
    expect(istDayKey(new Date('2026-11-22T19:00:00Z'))).toBe('2026-11-23'); // 00:30 IST
    expect(istDayKey(new Date('2026-11-22T18:00:00Z'))).toBe('2026-11-22'); // 23:30 IST
  });

  it('formats opening hours', () => {
    expect(formatHours(takeaway.hours)).toBe('Mon–Sat · 8am–6pm');
    expect(formatHours(cafe.hours)).toBe('Every day · 8am–10pm');
    expect(locationHoursLabel(cafe)).toBe('Opening soon');
    expect(locationHoursLabel(takeaway)).toBe('Mon–Sat · 8am–6pm');
  });
});
