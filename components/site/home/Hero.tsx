import Image from 'next/image';
import { Lines } from '@/components/motion/Lines';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Dot, Eyebrow } from '../Section';

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-36" aria-labelledby="hero-title">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <Reveal fade>
            <Eyebrow>Coffee, rolls &amp; bowls · Bengaluru</Eyebrow>
          </Reveal>
          <Reveal fade delay={150} className="hidden md:block">
            <p className="t-label text-grind">Menu No. 01 · 100% vegetarian</p>
          </Reveal>
        </div>

        <Lines
          as="h1"
          id="hero-title"
          className="t-display mt-5 md:mt-8"
          delay={120}
          stagger={110}
          lines={[
            'Everyone',
            <>
              has a <span className="accent">usual</span>
              <Dot />
            </>,
          ]}
        />

        <div className="mt-8 grid grid-cols-1 items-end gap-6 md:mt-12 md:grid-cols-12">
          <Reveal delay={350} className="md:col-span-5">
            <p className="t-body-lg max-w-[34ch] text-grind">Coffee, rolls &amp; bowls in Bengaluru. Pre-order by 11, lunch by 1, your name on the cup.</p>
          </Reveal>
          <Reveal delay={450} className="flex gap-3 md:col-span-7 md:justify-end">
            <ButtonLink href="/menu" variant="espresso" arrow>
              See the menu
            </ButtonLink>
            <ButtonLink href="/find-us" variant="outline">
              Find us
            </ButtonLink>
          </Reveal>
        </div>
      </Container>

      <Container className="mt-10 md:mt-16">
        <figure>
          <div className="img-reveal relative aspect-square overflow-hidden rounded-[18px] bg-toast sm:aspect-[16/10] lg:aspect-[16/8]" style={{ ['--delay' as string]: '200ms' }}>
            <div className="img-reveal-inner absolute inset-0">
              <Parallax className="absolute inset-0" amount={36}>
                <Image
                  src="/images/storefront.jpg"
                  alt="the usual storefront at golden hour: espresso fascia, ‘regulars welcome.’ on the window, people at the long table"
                  fill
                  preload
                  quality={85}
                  sizes="(min-width: 1440px) 1344px, (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
                  className="object-cover object-[22%_50%]"
                />
              </Parallax>
            </div>
          </div>
          <figcaption className="mt-3 text-xs text-grind">The street, golden hour.</figcaption>
        </figure>
      </Container>
    </section>
  );
}

export function Facts() {
  const facts = [
    { big: 'by 11', title: 'Pre-order', body: 'Order from your phone and skip the queue.' },
    { big: 'by 1', title: 'Lunch', body: 'Your usual, made and waiting with your name on it.' },
    { big: '6 min', title: 'Ready in', body: 'Hot rolls, cold coffee, no guesswork.' },
  ];
  return (
    <section aria-label="How ordering works" className="py-10 md:py-24">
      <Container>
        <ul className="grid grid-cols-3 divide-x divide-line border-y border-line">
          {facts.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 120} className="px-3 py-5 first:pl-0 last:pr-0 md:px-8 md:py-10">
              <p className="t-label text-grind">{f.title}</p>
              <p className="mt-2 font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] xs:text-3xl md:mt-8 md:text-7xl">{f.big}</p>
              <p className="mt-3 hidden max-w-[26ch] text-[0.9375rem] text-grind md:block">{f.body}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function Idea() {
  return (
    <section className="on-dark relative overflow-hidden bg-espresso py-20 text-milk md:py-36" aria-labelledby="idea-title">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 md:pt-8">
          <Reveal fade>
            <Eyebrow n="01" className="!text-milk/50">
              The idea
            </Eyebrow>
          </Reveal>
          <Lines
            id="idea-title"
            className="t-display mt-6"
            lines={[
              'A café for',
              <>
                <span className="accent">regulars</span>
                <Dot />
              </>,
            ]}
          />
          <Reveal delay={200}>
            <p className="t-body-lg mt-8 max-w-[38ch] text-milk/75">
              Everyone has a usual: the seat, the song, the order. the usual is the neighbourhood café where yours is remembered, made the same every time, and handed over with your name on it.
            </p>
          </Reveal>
        </div>
        <figure className="md:col-span-5 md:col-start-8">
          <div className="img-reveal relative aspect-[4/5] overflow-hidden rounded-[18px]">
            <div className="img-reveal-inner absolute inset-0">
              <Image src="/images/hand-off.jpg" alt="A barista hands a cup with a lime name sticker to a laughing regular at the counter" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[30%_50%]" />
            </div>
          </div>
          <figcaption className="mt-3 text-xs text-milk/50">The hand-off. Two hands, one name.</figcaption>
        </figure>
      </Container>
    </section>
  );
}
