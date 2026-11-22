export const TIME_ZONE = 'Asia/Kolkata';

export function inr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

const timeFmt = new Intl.DateTimeFormat('en-IN', { timeZone: TIME_ZONE, hour: 'numeric', minute: '2-digit', hour12: true });

/** "1:05 pm" in IST, regardless of the viewer's device time zone. */
export function istTime(d: Date | string | number): string {
  return timeFmt.format(new Date(d)).replace(/\s?(AM|PM)$/i, (m) => ` ${m.trim().toLowerCase()}`);
}

const dayFmt = new Intl.DateTimeFormat('en-IN', { timeZone: TIME_ZONE, weekday: 'long' });
export function istWeekday(d: Date | string | number): string {
  return dayFmt.format(new Date(d));
}

export function padOrderNumber(n: number): string {
  return `#${String(n).padStart(3, '0')}`;
}

/** "Morning" / "Afternoon" / "Evening" based on IST. */
export function greeting(now: Date = new Date()): string {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', hour12: false }).format(now));
  if (h < 5) return 'Up late';
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

export function minutesAgo(iso: string, now = Date.now()): string {
  const m = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h} h ${m % 60} min ago`;
}

/** Normalise an Indian mobile number to 10 digits, or null. */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}
