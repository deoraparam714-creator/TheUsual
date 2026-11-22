// Business details used across the site and the ordering app.
// ⚠️ Addresses, hours and contact handles below are placeholders —
// replace them with the real details before launch.

export const site = {
  name: 'the usual',
  // Fixed at build time. On Railway the generated domain is used until you set NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'https://theusualcoffee.in'),
  tagline: 'Everyone has a usual.',
  descriptor: 'Coffee, rolls & bowls',
  signOff: 'Same time tomorrow?',
  city: 'Bengaluru',
  description:
    'the usual is a neighbourhood café in Bengaluru for coffee, rolls and bowls. Pre-order by 11, lunch by 1, your name on the cup.',
  email: 'hello@theusualcoffee.in',
  instagram: { handle: '@theusual.blr', url: 'https://www.instagram.com/' },
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
};

export const locations: Location[] = [
  {
    id: 'campus',
    name: 'Mesa campus',
    kind: 'The cart',
    area: 'Mesa campus, Bengaluru',
    blurb: 'Under the trees, between classes. Order ahead and skip the line.',
    hours: { days: [1, 2, 3, 4, 5, 6], open: '08:00', close: '18:00' },
    image: '/images/location-campus.jpg',
    imageAlt: 'Students queueing at the usual coffee cart under a tree on campus',
  },
  {
    id: 'cafe',
    name: 'The café',
    kind: 'The café',
    area: 'Indiranagar, Bengaluru',
    blurb: 'The long table, the window bench and the regulars’ wall.',
    hours: { days: [0, 1, 2, 3, 4, 5, 6], open: '08:00', close: '22:00' },
    image: '/images/location-cafe.jpg',
    imageAlt: 'Two regulars on the bench outside the usual café with cups in hand',
  },
  {
    id: 'airport',
    name: 'Airport kiosk',
    kind: 'The kiosk',
    area: 'Bengaluru airport, Terminal 2',
    blurb: 'Your usual before you fly. Same roll, same cup, same name.',
    hours: { days: [0, 1, 2, 3, 4, 5, 6], open: '05:00', close: '23:30' },
    image: '/images/location-airport.jpg',
    imageAlt: 'A traveller with a the usual cup walking past the airport kiosk',
  },
];

export const DEFAULT_LOCATION_ID = 'campus';

export function getLocation(id: string | undefined | null): Location | undefined {
  return locations.find((l) => l.id === id);
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
  { href: '/regulars', label: 'Regulars' },
  { href: '/find-us', label: 'Find us' },
] as const;
