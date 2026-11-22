import type { Hours, Location } from './site';

// India has no daylight saving: IST is a fixed UTC+05:30.
const IST_OFFSET_MIN = 330;
const SLOT_STEP_MIN = 15;

type IstParts = { y: number; mo: number; d: number; dow: number; minutes: number };

function istParts(date: Date): IstParts {
  const shifted = new Date(date.getTime() + IST_OFFSET_MIN * 60_000);
  return {
    y: shifted.getUTCFullYear(),
    mo: shifted.getUTCMonth(),
    d: shifted.getUTCDate(),
    dow: shifted.getUTCDay(),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

/** A Date for a given IST calendar day + minutes after midnight. */
function istDate(y: number, mo: number, d: number, minutes: number): Date {
  return new Date(Date.UTC(y, mo, d, 0, minutes) - IST_OFFSET_MIN * 60_000);
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export type Slot = { at: string; dayLabel: string };
export type SlotPlan = {
  openNow: boolean;
  /** ASAP is possible right now. */
  asapAvailable: boolean;
  /** When an ASAP order would be ready (ISO), if available. */
  asapReadyAt: string | null;
  /** Next opening time (ISO) when closed. */
  opensAt: string | null;
  slots: Slot[];
};

function isOpenDay(hours: Hours, dow: number) {
  return hours.days.includes(dow);
}

/**
 * Pickup plan for a location: ASAP if open (and there's time to make it before close),
 * plus 15-minute slots for the rest of today and the next open day.
 */
export function planSlots(location: Location, now: Date = new Date(), prepMin = 6): SlotPlan {
  const { hours } = location;
  const open = toMin(hours.open);
  const close = toMin(hours.close);
  const p = istParts(now);

  const openNow = isOpenDay(hours, p.dow) && p.minutes >= open && p.minutes < close;
  const asapAvailable = openNow && p.minutes + prepMin <= close;
  const asapReadyAt = asapAvailable ? new Date(Math.ceil((now.getTime() + prepMin * 60_000) / 60_000) * 60_000).toISOString() : null;

  const slots: Slot[] = [];
  let opensAt: string | null = null;
  let daysWithSlots = 0;
  for (let offset = 0; offset < 8 && daysWithSlots < 2; offset++) {
    const day = istParts(istDate(p.y, p.mo, p.d + offset, 12 * 60));
    if (!isOpenDay(hours, day.dow)) continue;
    // Earliest slot: opening + 15 min (time to set up), or now + prep rounded up to the next step.
    let start = open + SLOT_STEP_MIN;
    if (offset === 0) {
      const earliest = p.minutes + prepMin + 5;
      start = Math.max(start, Math.ceil(earliest / SLOT_STEP_MIN) * SLOT_STEP_MIN);
    }
    const dayLabel = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : new Intl.DateTimeFormat('en-IN', { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(day.y, day.mo, day.d)));
    let added = 0;
    for (let m = start; m <= close - SLOT_STEP_MIN; m += SLOT_STEP_MIN) {
      slots.push({ at: istDate(day.y, day.mo, day.d, m).toISOString(), dayLabel });
      added++;
    }
    if (!openNow && !opensAt) {
      const openTime = istDate(day.y, day.mo, day.d, open);
      if (openTime.getTime() > now.getTime()) opensAt = openTime.toISOString();
    }
    if (added) daysWithSlots++;
  }
  return { openNow, asapAvailable, asapReadyAt, opensAt, slots };
}

/** Server-side check that a requested pickup time is a real slot. */
export function isValidSlot(location: Location, at: string, now: Date = new Date(), prepMin = 6): boolean {
  const t = new Date(at).getTime();
  if (!Number.isFinite(t) || t < now.getTime() + 2 * 60_000) return false;
  // Plan from 10 minutes ago so a slot picked just before a slow checkout still counts.
  const plan = planSlots(location, new Date(now.getTime() - 10 * 60_000), prepMin);
  return plan.slots.some((s) => new Date(s.at).getTime() === t);
}

/** IST calendar day key, e.g. "2026-11-22", used for daily order numbers. */
export function istDayKey(date: Date = new Date()): string {
  const p = istParts(date);
  return `${p.y}-${String(p.mo + 1).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}
