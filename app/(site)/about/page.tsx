import type { Metadata } from 'next';
import Image from 'next/image';
import { ProteinBadge } from '@/components/brand/ProteinBadge';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollTilt } from '@/components/motion/ScrollTilt';
import { Ritual } from '@/components/site/home/More';
import { Container, Dot, Eyebrow } from '@/components/site/Section';
import { SignOff } from '@/components/site/SignOff';
import { ButtonLink } from '@/components/ui/Button';
import { FAQS, faqJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'About the usual — a café for regulars at Mesa, Bengaluru' },
  description:
    'the usual is a neighbourhood café at Mesa, Bengaluru: coffee, paneer rolls with 35g+ protein, fries and bowls, made the same every time with your name on the cup. Our story, what we stand for and how ordering works.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  { t: 'Regulars over reach', d: 'We’d rather know 500 people by name than be liked by 50,000 strangers.' },
  { t: 'Same, every time', d: 'Consistency is the luxury. The roll you loved on Monday is the roll you get on Friday.' },
  { t: 'Easy, not lazy', d: 'Relaxed room, sharp standards. Clean counters, hot food, fast hands.' },
  { t: 'Honest food', d: 'Home-style recipes, real protein, clear prices. Nothing we wouldn’t eat daily.' },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />

      <section className="pt-28 md:pt-40" aria-labelledby="about-title">
        <Container>
          <Reveal variant="fade">
            <Eyebrow>About the usual</Eyebrow>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:items-end">
            <Lines
              as="h1"
              id="about-title"
              className="t-display md:col-span-8"
              delay={100}
              lines={[
                'A café for',
                <>
                  <span className="accent">regulars</span>
                  <Dot />
                </>,
              ]}
            />
            <Reveal delay={300} className="md:col-span-4">
              <p className="t-body-lg text-grind">Everyone has a usual: the seat, the song, the order. Ours is the place where yours is remembered.</p>
            </Reveal>
          </div>
        </Container>
        <Container className="mt-12 md:mt-16">
          <ScrollTilt from={14}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-toast sm:aspect-[16/9]">
              <Image src="/images/hand-off.jpg" alt="A barista hands a regular her cup with her name on it" fill preload sizes="(min-width: 1440px) 1344px, 100vw" className="object-cover object-[35%_50%]" />
            </div>
          </ScrollTilt>
        </Container>
      </section>

      <section className="py-20 md:py-32" aria-labelledby="story-title">
        <Container className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Reveal variant="fade">
              <Eyebrow>Our story</Eyebrow>
            </Reveal>
            <h2 id="story-title" className="t-headline reveal-left mt-5 max-w-[12ch]">
              Somewhere to land<Dot />
            </h2>
          </div>
          <Reveal variant="right" className="space-y-5 md:col-span-6 md:col-start-7">
            <p className="t-body-lg">
              the usual is a neighbourhood café for coffee, rolls and bowls, made for students and young professionals at Mesa in Bengaluru who need somewhere to land between classes, calls and catch-ups.
            </p>
            <p className="t-body-lg text-grind">
              Chains serve everyone the same. We turn customers into regulars: your name on the cup, your order remembered, your tally on the wall. And because lunch should actually keep you going, every roll carries 35g+ protein from 80–100g of high-protein paneer.
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              <ButtonLink href="/menu" variant="espresso" arrow>
                See the menu
              </ButtonLink>
              <ButtonLink href="/find-us" variant="outline">
                Find us at Mesa
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-foam py-20 md:py-32" aria-labelledby="values-title">
        <Container className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Reveal variant="fade">
              <Eyebrow>What we stand for</Eyebrow>
            </Reveal>
            <Lines id="values-title" className="t-headline mt-5 max-w-[10ch]" lines={['Four things', 'we don’t', <>bend on<Dot key="d" /></>]} />
            <Reveal variant="zoom" delay={200} className="mt-10 hidden md:block">
              <ProteinBadge className="w-40 text-[16px]" />
            </Reveal>
          </div>
          <ol className="md:col-span-8 md:col-start-5">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v.t} variant="tilt" delay={i * 90} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-line py-7 last:border-b md:grid-cols-[4rem_1fr_1fr] md:gap-x-8 md:py-9">
                <span className="t-label pt-2 text-grind">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-title">
                  {v.t}
                  <Dot />
                </h3>
                <p className="col-start-2 mt-3 max-w-[40ch] text-grind md:col-start-3 md:mt-1">{v.d}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <Ritual />

      <section className="py-20 md:py-32" aria-labelledby="faq-title">
        <Container className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Reveal variant="fade">
              <Eyebrow>Questions</Eyebrow>
            </Reveal>
            <h2 id="faq-title" className="t-headline reveal-left mt-5">
              Good to know<Dot />
            </h2>
          </div>
          <div className="md:col-span-8">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} variant="fade" delay={i * 60}>
                <details className="group border-t border-line py-5 last:border-b [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-semibold tracking-[-0.01em] md:text-2xl">
                    {f.q}
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45">
                      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[60ch] text-grind">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SignOff />
    </>
  );
}
