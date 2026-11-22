import type { Metadata } from 'next';
import Image from 'next/image';
import { Tally } from '@/components/brand/Tally';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { Merch, UsualOfTheWeek } from '@/components/site/home/More';
import { Container, Dot, Eyebrow } from '@/components/site/Section';
import { SignOff } from '@/components/site/SignOff';
import { TallyCard } from '@/components/site/TallyCard';
import { TallyCheck } from '@/components/site/TallyCheck';

export const metadata: Metadata = {
  title: 'Regulars',
  description: 'Five visits fills your tally. The next one’s on us. How the usual’s tally card works, and how to check yours.',
  alternates: { canonical: '/regulars' },
};

const RULES = [
  { t: 'Every order counts', d: 'Order ahead or at the counter with your number. One order, one stroke.' },
  { t: 'Five fills the card', d: 'Four strokes and a lime slash. That’s a regular.' },
  { t: 'The next one’s on us', d: 'Your next order’s priciest item comes off the bill. Roll, bowl, whatever your usual is.' },
  { t: 'No app, no maths', d: 'Your tally lives with your phone number. No points, no tiers, no expiry dates to remember.' },
];

export default function RegularsPage() {
  return (
    <>
      <section className="pt-24 md:pt-36">
        <Container>
          <Reveal fade>
            <Eyebrow>Regulars</Eyebrow>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:items-end">
            <Lines
              as="h1"
              className="t-display md:col-span-8"
              delay={100}
              lines={[
                'Regulars',
                <>
                  <span className="accent">welcome</span>
                  <Dot />
                </>,
              ]}
            />
            <Reveal delay={300} className="md:col-span-4">
              <p className="t-body-lg text-grind">We have regulars. Everyone else is a future regular. Here’s how the counting works.</p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-32" aria-labelledby="card-title">
        <Container className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Reveal fade>
              <Eyebrow n="01">The tally card</Eyebrow>
            </Reveal>
            <h2 id="card-title" className="t-headline reveal mt-5 max-w-[12ch]">
              Fill five. The next one’s on us<Dot />
            </h2>
            <ol className="mt-10">
              {RULES.map((r, i) => (
                <Reveal as="li" key={r.t} delay={i * 80} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-line py-5 last:border-b">
                  <Tally count={i === 3 ? 5 : i + 1} className="mt-1 w-7" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">{r.t}</h3>
                    <p className="mt-1 text-[0.9375rem] text-grind">{r.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-16">
            <Reveal>
              <TallyCard />
            </Reveal>
            <Reveal delay={150} className="mt-12">
              <h2 className="t-title">
                Check your tally<Dot />
              </h2>
              <p className="mt-2 text-grind">Use the number you order with.</p>
              <div className="mt-6">
                <TallyCheck />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="on-dark bg-espresso py-20 text-milk md:py-32" aria-labelledby="wall-title">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Reveal fade>
                <Eyebrow n="02" className="!text-milk/50">
                  The regulars’ wall
                </Eyebrow>
              </Reveal>
              <Lines
                id="wall-title"
                className="t-display mt-6"
                lines={[
                  'Your tally,',
                  <>
                    on the <span className="accent">wall</span>
                    <Dot />
                  </>,
                ]}
              />
            </div>
            <Reveal delay={150} className="md:col-span-4 md:col-start-9">
              <p className="t-body-lg text-milk/70">Every full card earns a stroke on the regulars’ wall. One lime slash a week goes to the usual of the week.</p>
            </Reveal>
          </div>
          <figure className="mt-14 md:mt-20">
            <div className="img-reveal relative aspect-[4/5] overflow-hidden rounded-[18px] sm:aspect-[16/9]">
              <div className="img-reveal-inner absolute inset-0">
                <Image src="/images/hand-off.jpg" alt="Regulars laughing at the counter in front of a wall of tally marks" fill sizes="(min-width: 1440px) 1344px, 100vw" className="object-cover object-[35%_50%]" />
              </div>
            </div>
            <figcaption className="mt-3 text-xs text-milk/50">The wall. Three or four people in front of it, most days.</figcaption>
          </figure>
        </Container>
      </section>

      <div className="pt-20 md:pt-32">
        <UsualOfTheWeek />
      </div>
      <Merch />
      <SignOff />
    </>
  );
}
