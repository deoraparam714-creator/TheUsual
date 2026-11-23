import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { locationHoursLabel, locations, site } from '@/lib/site';

const LINKS = [
  ['/menu', 'Menu'],
  ['/order', 'Order ahead'],
  ['/about', 'About'],
  ['/merch', 'Merch'],
  ['/regulars', 'Regulars'],
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-espresso text-milk">
      <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-14 md:px-8 md:pt-20 xl:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-8">
          <div className="col-span-2 md:col-span-5">
            <p className="t-title max-w-[16ch]">
              Everyone has a <span className="accent">usual</span>
              <span className="dot" aria-hidden />
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-milk/60">
              {site.descriptor} at {site.campus}, {site.city}. 35g+ protein in every roll. Pre-order by 11, lunch by 1.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <h2 className="t-label text-milk/50">Explore</h2>
            <ul className="mt-4 grid grid-cols-1 gap-y-2 text-[0.9375rem] sm:grid-cols-2 sm:gap-x-6 md:grid-cols-1">
              {LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link-underline inline-flex min-h-8 items-center">
                    {label}
                  </Link>
                </li>
              ))}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="link-underline inline-flex min-h-8 items-center">
                    Email us
                  </a>
                </li>
              )}
              {site.instagram.url && (
                <li>
                  <a href={site.instagram.url} className="link-underline inline-flex min-h-8 items-center" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <div className="md:col-span-3 md:col-start-10">
            <h2 className="t-label text-milk/50">Find us at {site.campus}</h2>
            <ul className="mt-4 space-y-3">
              {locations.map((l) => (
                <li key={l.id}>
                  <p className="text-[0.9375rem] font-medium leading-snug">{l.status === 'soon' ? l.name : l.kind === 'Takeaway' ? `Takeaway · ${l.name}` : `Pre-order · ${l.name}`}</p>
                  <p className="text-xs text-milk/55">{locationHoursLabel(l)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="reveal-fade mt-14 md:mt-20" aria-hidden>
          <Logo variant="oneline" decorative className="h-auto w-full text-milk" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-milk/15 pt-5 text-xs text-milk/45">
          <p>100% vegetarian · Prices in ₹ · Ask for your name on the cup</p>
          <p>© {year} the usual. Made in {site.city}.</p>
        </div>
      </div>
    </footer>
  );
}
