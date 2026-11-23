import Image from 'next/image';
import Link from 'next/link';
import { CountUp } from '@/components/motion/CountUp';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollMarquee } from '@/components/motion/ScrollMarquee';
import { Tilt3D } from '@/components/motion/Tilt3D';
import { ButtonLink } from '@/components/ui/Button';
import { inr } from '@/lib/format';
import { itemsIn } from '@/lib/menu';
import { Container, Dot, Eyebrow } from '../Section';

/** The headline promise: 35g+ protein in every roll. */
export function Protein() {
  const rolls = itemsIn('rolls');
  return (
    <section className="on-dark relative overflow-hidden bg-espresso pt-20 text-milk md:pt-32" aria-labelledby="protein-title">
      <Container className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6">
          <Reveal variant="fade">
            <Eyebrow className="!text-milk/50">The protein</Eyebrow>
          </Reveal>
          <p className="mt-4 font-display font-extrabold leading-[0.8] tracking-[-0.06em] text-[clamp(7rem,34vw,15rem)]" aria-hidden>
            <CountUp to={35} />
            <span>g</span>
            <span className="text-lime">+</span>
          </p>
          <Lines
            id="protein-title"
            className="t-headline mt-5"
            lines={[
              <>
                <span className="sr-only">35g+ </span>protein in every <span className="accent">roll</span>
                <Dot />
              </>,
            ]}
          />
          <Reveal delay={150}>
            <p className="t-body-lg mt-6 max-w-[40ch] text-milk/75">80–100g of high-protein paneer in every roll, wrapped in a grilled roti. Lunch that keeps you going. 100% vegetarian.</p>
          </Reveal>
          <ul className="mt-8 divide-y divide-milk/12 border-y border-milk/12">
            {rolls.map((r, i) => (
              <Reveal as="li" key={r.id} variant="left" delay={200 + i * 90}>
                <Link href={`/order?item=${r.id}`} className="group flex min-h-14 items-center justify-between gap-4 py-3">
                  <span className="t-subhead transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">{r.name}</span>
                  <span className="flex shrink-0 items-center gap-3 text-sm">
                    <span className="rounded-full bg-milk/10 px-2.5 py-1 font-semibold">35g+</span>
                    <span className="font-semibold tabular-nums">{inr(r.price)}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={450} className="mt-8">
            <ButtonLink href="/order" variant="lime" size="lg" arrow>
              Order a roll
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal variant="tilt" delay={150} className="md:col-span-5 md:col-start-8">
          <Tilt3D max={10} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-toast">
              <Image src="/images/roll-chipotle-cheese.jpg" alt="Chipotle Cheese Roll cut in half, paneer and melted cheese stretching" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[55%_50%]" />
            </div>
            <div className="absolute -top-5 left-2 z-20 rounded-full bg-lime px-4 py-2.5 font-display text-lg font-extrabold text-espresso shadow-lg md:-left-8 md:-top-6 md:text-xl [transform:translateZ(60px)_rotate(-8deg)]">
              35g+ protein
            </div>
          </Tilt3D>
        </Reveal>
      </Container>

      <div className="mt-20 space-y-2 pb-6 text-milk md:mt-28">
        <ScrollMarquee items={['35g+ protein', 'every roll', '100% veg']} />
        <ScrollMarquee items={['pre-order by 11', 'lunch by 1', 'ready in 6 min']} reverse muted />
      </div>
    </section>
  );
}
