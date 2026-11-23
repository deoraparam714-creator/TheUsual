import type { Metadata } from 'next';
import { Tally } from '@/components/brand/Tally';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { MerchTile } from '@/components/site/Merch';
import { Container, Dot, Eyebrow } from '@/components/site/Section';
import { SignOff } from '@/components/site/SignOff';
import { ButtonLink } from '@/components/ui/Button';
import { merch } from '@/lib/merch';

export const metadata: Metadata = {
  title: 'Merch',
  description: 'Caps, tees and mugs from the usual. Add them to your order and pick them up with your usual. The tote? You earn that.',
  alternates: { canonical: '/merch' },
};

export default function MerchPage() {
  return (
    <>
      <section className="pt-28 md:pt-40">
        <Container>
          <Reveal fade>
            <Eyebrow>Merch</Eyebrow>
          </Reveal>
          <Lines
            as="h1"
            className="t-display mt-5 md:mt-8"
            delay={100}
            lines={[
              'Take the usual',
              <>
                <span className="accent">home</span>
                <Dot />
              </>,
            ]}
          />
          <Reveal delay={300} className="mt-8 md:mt-12">
            <p className="t-body-lg max-w-[40ch] text-grind">Small runs, the same lime dot. Add something to your order and pick it up with your usual. Pay at the counter.</p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-14 md:py-24">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {merch.map((m, i) => (
            <Reveal as="li" key={m.id} delay={i * 80} className="flex flex-col">
              <div className="flex-1">
                <MerchTile item={m} sizes="(min-width: 768px) 23vw, 46vw" />
              </div>
              {m.earned ? (
                <ButtonLink href="/regulars" variant="outline" size="sm" className="mt-4 w-full">
                  How to earn it
                </ButtonLink>
              ) : (
                <ButtonLink href={`/order?item=${m.id}`} variant="espresso" size="sm" className="mt-4 w-full">
                  Add to order
                </ButtonLink>
              )}
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-16 flex flex-col gap-5 rounded-[18px] bg-foam p-6 sm:flex-row sm:items-center md:mt-24 md:p-8">
          <Tally count={5} className="w-12 shrink-0" />
          <p className="flex-1 text-[0.9375rem] text-grind">
            <span className="font-semibold text-espresso">The tote is never for sale.</span> Fill your first tally card and it’s yours, with your next usual on us.
          </p>
          <ButtonLink href="/regulars" variant="outline" size="sm" arrow>
            How the tally works
          </ButtonLink>
        </Reveal>
      </Container>

      <SignOff cta={{ href: '/order', label: 'Order my usual' }} />
    </>
  );
}
