import type { Metadata } from 'next';
import Image from 'next/image';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { OpenStatus } from '@/components/site/OpenStatus';
import { Container, Dot, Eyebrow } from '@/components/site/Section';
import { SignOff } from '@/components/site/SignOff';
import { ButtonLink } from '@/components/ui/Button';
import { formatHours, locations, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Find us',
  description: 'A cart on campus, a café in town and a kiosk at the airport. Hours and pickup for every the usual in Bengaluru.',
  alternates: { canonical: '/find-us' },
};

export default function FindUsPage() {
  return (
    <>
      <section className="pt-24 md:pt-36">
        <Container>
          <Reveal fade>
            <Eyebrow>Find us</Eyebrow>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:items-end">
            <Lines
              as="h1"
              className="t-display md:col-span-8"
              delay={100}
              lines={[
                'Same roll,',
                <>
                  <span className="accent">everywhere</span>
                  <Dot />
                </>,
              ]}
            />
            <Reveal delay={300} className="md:col-span-4">
              <p className="t-body-lg text-grind">A cart on campus, a café in town, a kiosk at the airport. Order ahead from any of them and your name’s on the cup when you arrive.</p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Container className="py-16 md:py-28">
        <ul className="space-y-20 md:space-y-32">
          {locations.map((l, i) => (
            <li key={l.id} id={l.id} className="grid grid-cols-1 scroll-mt-28 gap-8 md:grid-cols-12 md:items-center md:gap-8">
              <div className={['md:col-span-6', i % 2 ? 'md:order-2 md:col-start-7' : ''].join(' ')}>
                <div className="img-reveal relative aspect-[4/5] overflow-hidden rounded-[18px] bg-toast">
                  <div className="img-reveal-inner absolute inset-0">
                    <Image src={l.image} alt={l.imageAlt} fill sizes="(min-width: 768px) 48vw, 100vw" className="object-cover" />
                  </div>
                </div>
              </div>
              <div className={['md:col-span-5', i % 2 ? 'md:order-1' : 'md:col-start-8'].join(' ')}>
                <Reveal>
                  <p className="t-label text-grind">
                    {String(i + 1).padStart(2, '0')} — {l.kind}
                  </p>
                  <h2 className="t-headline mt-4">
                    {l.name}
                    <Dot />
                  </h2>
                  <p className="t-body-lg mt-5 max-w-[34ch] text-grind">{l.blurb}</p>
                  <dl className="mt-8 grid grid-cols-[6rem_1fr] gap-y-3 border-t border-line pt-6 text-[0.9375rem]">
                    <dt className="text-grind">Where</dt>
                    <dd>{l.area}</dd>
                    <dt className="text-grind">Hours</dt>
                    <dd>{formatHours(l.hours)}</dd>
                    <dt className="text-grind">Right now</dt>
                    <dd>
                      <OpenStatus locationId={l.id} />
                    </dd>
                  </dl>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href={`/order?location=${l.id}`} variant="espresso" arrow>
                      Order for pickup here
                    </ButtonLink>
                    {l.mapsUrl && (
                      <ButtonLink href={l.mapsUrl} variant="outline" target="_blank" rel="noreferrer">
                        Directions
                      </ButtonLink>
                    )}
                  </div>
                </Reveal>
              </div>
            </li>
          ))}
        </ul>
      </Container>

      <section className="border-t border-line py-20 md:py-28">
        <Container className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <Eyebrow>Bring us to you</Eyebrow>
            <h2 className="t-headline mt-5 max-w-[14ch]">
              A cart for your campus<Dot />
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="t-body-lg text-grind">Colleges, offices, co-working floors. If there are regulars waiting to happen, we’d like to hear about it.</p>
            <a href={`mailto:${site.email}?subject=A%20the%20usual%20cart%20for%20us`} className="mt-6 inline-flex min-h-12 items-center text-lg font-semibold underline decoration-line-strong underline-offset-[6px] hover:decoration-espresso">
              {site.email}
            </a>
          </div>
        </Container>
      </section>

      <SignOff />
    </>
  );
}
