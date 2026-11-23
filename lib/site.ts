// Business details used across the site and the ordering app.
// ⚠️ Addresses, hours and contact handles below are placeholders —
// replace them with the real details before launch.

export const site = {
  name: 'the usual',
  // Fixed at build time. Set NEXT_PUBLIC_SITE_URL to your live address (e.g. your Railway URL, later your own domain).
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3000'),
  tagline: 'Everyone has a usual.',
  descriptor: 'Coffee, rolls & bowls',
  signOff: 'Same time tomorrow?',
  city: 'Bengaluru',
  description:
    'the usual is a neighbourhood café in Bengaluru for coffee, rolls and bowls. Pre-order by 11, lunch by 1, your name on the cup.',
  // Contact links only appear on the site once these are filled in.
  email: '' as string,
  instagram: { handle: '' as string, url: '' as string },
} as const;

export type Hours = {
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
  /** 24h "HH:MM", Asia/Kolkata */
  open: string;
  close: string;
};

export type Location = {
  id: string;
  name: string;
  kind: string;
  area: string;
  blurb: string;
  hours: Hours;
  image: string;
  imageAlt: string;
  /** Optional Google Maps link. Hidden when not set. */
  mapsUrl?: string;
  /** "soon" locations are listed but can't take orders yet. */
  status: 'open' | 'soon';
};

export const locations: Location[] = [
  {
    id: 'rj-twin',
    name: 'RJ Twin Building',
    kind: 'Takeaway',
    area: 'RJ Twin Building, Bengaluru',
    blurb: 'Our takeaway counter. Order ahead and your usual is waiting, name on the cup.',
    // ⚠️ Placeholder hours: set the real ones.
    hours: { days: [1, 2, 3, 4, 5, 6], open: '08:00', close: '18:00' },
    image: '/images/location-campus.jpg',
    imageAlt: 'People picking up orders at the usual takeaway counter',
    status: 'open',
  },
  {
    id: 'cafe',
    name: 'The café',
    kind: 'Café',
    area: 'Bengaluru',
    blurb: 'A room of our own: the long table, the window bench and the regulars’ wall.',
    hours: { days: [0, 1, 2, 3, 4, 5, 6], open: '08:00', close: '22:00' },
    image: '/images/location-cafe.jpg',
    imageAlt: 'Two regulars on the bench outside the usual café with cups in hand',
    status: 'soon',
  },
];

/** Locations that take orders today. */
export const openLocations = locations.filter((l) => l.status === 'open');

export const DEFAULT_LOCATION_ID = 'rj-twin';

export function getLocation(id: string | undefined | null): Location | undefined {
  return locations.find((l) => l.id === id);
}

/** A location you can order from right now, or undefined. */
export function getOrderableLocation(id: string | undefined | null): Location | undefined {
  const l = getLocation(id);
  return l?.status === 'open' ? l : undefined;
}

/** "Mon–Sat · 8am–6pm", or "Opening soon" for locations that aren't open yet. */
export function locationHoursLabel(l: Location): string {
  return l.status === 'soon' ? 'Opening soon' : formatHours(l.hours);
}

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, '0')}${suffix}`;
}

/** "Mon–Sat · 8am–6pm" / "Every day · 8am–10pm" */
export function formatHours(hours: Hours): string {
  const d = [...hours.days].sort((a, b) => a - b);
  let days: string;
  if (d.length === 7) days = 'Every day';
  else {
    const contiguous = d.every((v, i) => i === 0 || v === d[i - 1] + 1);
    days = contiguous ? `${DAY_SHORT[d[0]]}–${DAY_SHORT[d[d.length - 1]]}` : d.map((x) => DAY_SHORT[x]).join(', ');
  }
  return `${days} · ${fmt12(hours.open)}–${fmt12(hours.close)}`;
}

export const nav = [
  { href: '/menu', label: 'Menu' },
  { href: '/merch', label: 'Merch' },
  { href: '/regulars', label: 'Regulars' },
  { href: '/find-us', label: 'Find us' },
] as const;
