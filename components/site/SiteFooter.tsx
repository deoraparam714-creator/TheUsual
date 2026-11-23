import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { locationHoursLabel, locations, site } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-espresso text-milk">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-16 md:px-8 md:pt-24 xl:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="t-title max-w-[14ch]">
              Everyone has a <span className="accent">usual</span>
              <span className="dot" aria-hidden />
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-milk/60">{site.descriptor} in {site.city}. Pre-order by 11, lunch by 1, your name on the cup.</p>
          </div>

          <div className="md:col-span-4">
            <h2 className="t-label text-milk/50">Find us</h2>
            <ul className="mt-5 space-y-4">
              {locations.map((l) => (
                <li key={l.id}>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-sm text-milk/60">{locationHoursLabel(l)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-4">
            <div>
              <h2 className="t-label text-milk/50">Visit</h2>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                {[
                  ['/menu', 'Menu'],
                  ['/order', 'Order ahead'],
                  ['/merch', 'Merch'],
                  ['/regulars', 'Regulars'],
                  ['/find-us', 'Find us'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="link-underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {(site.email || site.instagram.url) && (
              <div>
                <h2 className="t-label text-milk/50">Say hi</h2>
                <ul className="mt-5 space-y-3 text-[0.9375rem]">
                  {site.email && (
                    <li>
                      <a href={`mailto:${site.email}`} className="link-underline break-all">
                        Email us
                      </a>
                    </li>
                  )}
                  {site.instagram.url && (
                    <li>
                      <a href={site.instagram.url} className="link-underline" target="_blank" rel="noreferrer">
                        Instagram
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="reveal-fade mt-20 md:mt-28" aria-hidden>
          <Logo variant="oneline" decorative className="h-auto w-full text-milk" />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-milk/15 pt-6 text-xs text-milk/45 md:flex-row md:items-center md:justify-between">
          <p>100% vegetarian · All prices in ₹ · Ask for your name on the cup</p>
          <p>© {year} the usual. Made in {site.city}.</p>
        </div>
      </div>
    </footer>
  );
}
