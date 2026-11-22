# the usual.

**Everyone has a usual.** Brand website and ordering app for *the usual*, a neighbourhood café for coffee, rolls and bowls in Bengaluru.

One Next.js codebase, two products:

| | What it is | Where |
|---|---|---|
| **Website** | Editorial, mobile-first brand site: story, menu, regulars, locations | `/`, `/menu`, `/regulars`, `/find-us` |
| **Ordering app** | Order ahead for pickup: customise, name on the cup, pickup slot, live tracking, tally loyalty, one-tap “Order my usual” | `/order`, `/order/checkout`, `/order/track/[id]` |
| **Kitchen display** | PIN-locked live board for staff: New → Making → Ready → Collected | `/kitchen` |

---

## Quick start

```bash
nvm use            # Node 22.13+ (uses the built-in node:sqlite driver)
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

The kitchen display works in development with the PIN `2468`. In production it stays locked until you set `KITCHEN_PIN` and `SESSION_SECRET`.

| Script | Does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build / server |
| `npm test` | Unit tests: pricing, pickup slots, tally, orders DB (Vitest) |
| `npm run typecheck` | TypeScript |

### Environment

| Variable | Required in prod | Purpose |
|---|---|---|
| `KITCHEN_PIN` | yes | PIN for `/kitchen` |
| `SESSION_SECRET` | yes | Signs the kitchen session cookie. Use a long random string |
| `DATABASE_PATH` | no | SQLite file location (default `./data/the-usual.db`) |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for metadata, sitemap and Open Graph |

---

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4**, with brand tokens in `app/globals.css`
- **Lenis** smooth scroll (marketing site only) + **Motion** for sheets and transitions
- **Zustand** for cart and profile (persisted to `localStorage`)
- **Zod** validation shared by client and server
- **SQLite** through Node’s built-in `node:sqlite`: a real SQL database with no native dependencies

Marketing pages are prerendered static. Reveal animations are CSS, driven by one global `IntersectionObserver`. Content only hides once JS has loaded, and `prefers-reduced-motion` turns all motion off, Lenis included.

## Brand system

Everything follows *Brand Guidelines 1.0*:

- **Colour.** Milk `#F5F1EA`, Espresso `#1C1A17`, Toast `#E8D7BD`, Usual Lime `#C5DC00`, plus Foam, Grind and Canvas. Lime is only ever a dot, a sticker or the one primary action on a screen. It is never used as text on milk.
- **Type.** Bricolage Grotesque (display), Instrument Serif Italic (one accent word per layout), Inter (UI and body), Caveat (handwritten names). All are loaded with `next/font`.
- **Logo.** `components/brand/Logo.tsx` renders stacked, one-line and `u.` mark variants from vectors **traced from the supplied logo master**. The logo is never retyped. The icons, favicon and Open Graph image are generated from the same paths.
- **Graphic language.** `Tally` (four strokes and a lime slash), `NameSticker` (“the usual for ___”), `TallyPattern` and `Cup`.
- **Voice.** Copy follows the voice table: “Got it. Your usual’s on the way.”, “That didn’t go through. Not you, us. Try again?”, “Same time tomorrow?”.

## How ordering works

1. **Menu** (`lib/menu.ts`) holds items and option groups (spice, extras, sizes, dips, milk). Prices are always recomputed on the server (`lib/pricing.ts`), and client prices are ignored.
2. **Pickup.** Each location has opening hours (`lib/site.ts`). `lib/slots.ts` builds ASAP plus 15-minute slots in **IST** for today and the next open day. Late at night it offers pre-orders for the morning.
3. **Checkout** asks for a name for the cup (“No name, no cup.”), a pickup time and a mobile number for the tally. Payment is taken at pickup.
4. **Tally.** Every order adds one stroke. Five strokes unlock a free usual: the priciest item on the next order is free. Cancelling an order gives the stroke back.
5. **Order my usual.** Saving an order as your usual turns the next visit into one tap.
6. **Tracking** polls every 4 seconds. The kitchen board polls every 5 seconds.

### API

| Method | Route | Notes |
|---|---|---|
| GET | `/api/menu` | Menu, categories and locations |
| GET | `/api/slots?location=&prep=` | Pickup plan |
| POST | `/api/orders` | Create an order (rate-limited) |
| GET | `/api/orders/:id` | Public order status (unguessable id) |
| GET | `/api/regulars?phone=` | Tally counts only, never names or orders |
| GET/POST/DELETE | `/api/kitchen/session` | Kitchen PIN sign-in and sign-out (HttpOnly signed cookie) |
| GET | `/api/kitchen/orders` | Active orders (kitchen only) |
| PATCH | `/api/kitchen/orders/:id` | Change status (kitchen only) |
| GET | `/api/health` | Health check |

## Project layout

```
app/
  (site)/            marketing pages: home, menu, regulars, find-us
  order/             ordering app: menu, checkout, track/[id]
  kitchen/           kitchen display
  api/               route handlers
components/
  brand/             Logo, Tally, NameSticker, TallyPattern, Cup
  site/              header, footer, home sections, menu board, tally card
  order/             sheet, item sheet, cart, checkout, tracker
  kitchen/           kitchen board
  motion/            reveal observer, smooth scroll, lines, parallax
lib/                 menu, pricing, slots, tally, schemas, site config
lib/server/          SQLite, orders repository, auth, rate limiting
store/               cart, profile and UI state
tests/               Vitest suites
public/images/       photography (optimised JPGs)
```

## Deploying

The app is a standard Node server (`npm run build && npm start`). SQLite needs a **persistent disk**:

- **Railway / Render / Fly.io / a VPS:** mount a volume and point `DATABASE_PATH` at it, e.g. `/data/the-usual.db`.
- **Vercel / serverless:** the filesystem is ephemeral, so swap `lib/server/db.ts` and `lib/server/orders.ts` to a hosted Postgres (Neon, Supabase). The repository functions are the only place that touches the database.

The rate limiter is in-memory, which is fine for one instance. Use Redis if you run more than one.

## Before launch: replace placeholders

- **Locations, addresses, hours, email and Instagram** in `lib/site.ts`. These are placeholders. Add `mapsUrl` to show a Directions button.
- **Option prices** (extras, sizes, dips, “make it lunch”) in `lib/menu.ts` are proposals. Item prices come from Menu No. 01.
- **Photography.** *Cold Coffee* and *Chipotle Salsa Bowl* use crops from the table shot as stand-ins. *Berry Cookie Smoothie* has no photo yet and shows a type-only tile. Shoot them per the launch shot list.
- **Usual of the week** copy (`components/site/home/More.tsx`).

## Roadmap ideas

- Online payment (Razorpay / UPI intent) instead of pay-at-pickup only
- Phone OTP sign-in, so a saved usual follows you across devices (it is per-device today)
- “Your usual is ready” via SMS or WhatsApp
- A small admin for menu, prices and sold-out toggles

---

Fonts: Bricolage Grotesque, Instrument Serif, Inter and Caveat, all under the SIL Open Font License.

*Same time tomorrow?*
