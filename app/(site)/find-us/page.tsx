import type { Metadata } from 'next';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { OpenStatus } from '@/components/site/OpenStatus';
import { Container, Dot, Eyebrow } from '@/components/site/Section';
import { SignOff } from '@/components/site/SignOff';
import { ButtonLink } from '@/components/ui/Button';
import { businessJsonLd } from '@/lib/seo';
import { locationHoursLabel, locations, openLocations, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Find us at Mesa',
  description: 'Find the usual at Mesa, Bengaluru: takeaway from our counter at RJ Twin Building, or pre-order and pick up at Mesa. Hours, pickup and how it works.',
  alternates: { canonical: '/find-us' },
};

export default function FindUsPage() {
  const soon = locations.filter((l) => l.status === 'soon');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd()) }} />
      <section className="pt-28 md:pt-40">
        <Container>
          <Reveal variant="fade">
            <Eyebrow>Find us</Eyebrow>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:items-end">
            <Lines
              as="h1"
              className="t-display md:col-span-8"
              delay={100}
              lines={[
                'Find us',
                <>
                  at <span className="accent">Mesa</span>
                  <Dot />
                </>,
              ]}
            />
            <Reveal delay={300} className="md:col-span-4">
              <p className="t-body-lg text-grind">Two ways to get your usual: take away from our counter at RJ Twin Building, or pre-order and pick up at Mesa.</p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-24">
        <ul className="border-t border-line">
          {openLocations.map((l, i) => (
            <Reveal as="li" key={l.id} variant={i % 2 ? 'right' : 'left'} delay={i * 100} className="grid grid-cols-1 gap-8 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-16">
              <div id={l.id} className="scroll-mt-28 md:col-span-6">
                <p className="t-label text-grind">
                  {String(i + 1).padStart(2, '0')} · {l.kind}
                </p>
                <h2 className="t-headline mt-4">
                  {l.kind === 'Takeaway' ? `Takeaway from ${l.name}` : `Pre-order at ${l.name}`}
                  <Dot />
                </h2>
                <p className="t-body-lg mt-5 max-w-[36ch] text-grind">{l.blurb}</p>
              </div>
              <div className="md:col-span-5 md:col-start-8">
                <dl className="grid grid-cols-[6.5rem_1fr] gap-y-3 text-[0.9375rem]">
                  <dt className="text-grind">Where</dt>
                  <dd>{l.area}</dd>
                  <dt className="text-grind">Hours</dt>
                  <dd>{locationHoursLabel(l)}</dd>
                  <dt className="text-grind">How</dt>
                  <dd>{l.how}</dd>
                  <dt className="text-grind">Right now</dt>
                  <dd>
                    <OpenStatus locationId={l.id} />
                  </dd>
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={`/order?location=${l.id}`} variant="espresso" arrow>
                    {l.preorderOnly ? 'Pre-order for Mesa' : 'Order ahead'}
                  </ButtonLink>
                  {l.mapsUrl && (
                    <ButtonLink href={l.mapsUrl} variant="outline" target="_blank" rel="noreferrer">
                      Directions
                    </ButtonLink>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        {soon.map((l) => (
          <Reveal key={l.id} variant="fade" className="mt-10 flex flex-col gap-3 rounded-[22px] bg-foam p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <p className="t-label text-grind">Coming soon</p>
              <p className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em]">{l.name}</p>
              <p className="mt-1 text-grind">{l.blurb}</p>
            </div>
            <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-toast px-5 text-sm font-semibold">
              <span className="size-1.5 rounded-full bg-grind" aria-hidden />
              {l.how}
            </span>
          </Reveal>
        ))}
      </Container>

      {site.email && (
        <section className="border-t border-line py-20 md:py-28">
          <Container className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <Eyebrow>Bring us to you</Eyebrow>
              <h2 className="t-headline mt-5 max-w-[14ch]">
                A counter for your campus<Dot />
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="t-body-lg text-grind">Colleges, offices, co-working floors. If there are regulars waiting to happen, we’d like to hear about it.</p>
              <a href={`mailto:${site.email}?subject=the%20usual%20for%20our%20campus`} className="mt-6 inline-flex min-h-12 items-center text-lg font-semibold underline decoration-line-strong underline-offset-[6px] hover:decoration-espresso">
                {site.email}
              </a>
            </div>
          </Container>
        </section>
      )}

      <SignOff />
    </>
  );
}
