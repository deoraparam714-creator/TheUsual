import Image from 'next/image';
import { ProteinBadge } from '@/components/brand/ProteinBadge';
import { Lines } from '@/components/motion/Lines';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollTilt } from '@/components/motion/ScrollTilt';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Dot, Eyebrow } from '../Section';

export function Hero() {
  return (
    <section className="relative pt-28 md:pt-40" aria-labelledby="hero-title">
      <Container>
        <Lines
          as="h1"
          id="hero-title"
          className="t-display"
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
          <Reveal delay={350} className="md:col-span-6">
            <p className="t-body-lg max-w-[36ch] text-grind">
              Coffee, high-protein paneer rolls &amp; bowls at Mesa, Bengaluru. Pre-order by 11, lunch by 1, your name on the cup.
            </p>
          </Reveal>
          <Reveal delay={450} className="flex gap-3 md:col-span-6 md:justify-end">
            <ButtonLink href="/menu" variant="espresso" arrow>
              See the menu
            </ButtonLink>
            <ButtonLink href="/find-us" variant="outline">
              Find us
            </ButtonLink>
          </Reveal>
        </div>
      </Container>

      <Container className="relative mt-12 md:mt-16">
        <ScrollTilt from={16}>
          <figure>
            <div className="img-reveal relative aspect-square overflow-hidden rounded-[18px] bg-toast sm:aspect-[16/10] lg:aspect-[16/8]" style={{ ['--delay' as string]: '200ms' }}>
              <div className="img-reveal-inner absolute inset-0">
                <Parallax className="absolute inset-0" amount={36}>
                  <Image
                    src="/images/storefront.jpg"
                    alt="the usual: espresso fascia with the logo and ‘regulars welcome.’ on the window, regulars at the long table"
                    fill
                    preload
                    quality={90}
                    sizes="(min-width: 1440px) 1344px, (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
                    className="object-cover object-[22%_50%]"
                  />
                </Parallax>
              </div>
            </div>
          </figure>
        </ScrollTilt>
        <Reveal variant="zoom" delay={700} className="absolute -top-8 right-3 z-10 md:-top-10 md:right-14">
          <ProteinBadge className="w-28 text-[12px] md:w-48 md:text-[19px]" />
        </Reveal>
      </Container>
    </section>
  );
}

export function Idea() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="idea-title">
      <Container className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6">
          <Reveal variant="fade">
            <Eyebrow>The idea</Eyebrow>
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
          <Reveal variant="left" delay={200}>
            <p className="t-body-lg mt-8 max-w-[38ch] text-grind">
              Everyone has a usual: the seat, the song, the order. the usual is where yours is remembered, made the same every time, and handed over with your name on it.
            </p>
            <ButtonLink href="/about" variant="outline" arrow className="mt-8">
              Our story
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal variant="right" delay={150} className="md:col-span-5 md:col-start-8">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
              <Image src="/images/hand-off.jpg" alt="A barista hands a cup with a lime name sticker to a laughing regular at the counter" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[30%_50%]" />
            </div>
            <figcaption className="mt-3 text-xs text-grind">The hand-off. Two hands, one name.</figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
