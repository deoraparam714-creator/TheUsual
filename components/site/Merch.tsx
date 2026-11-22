import Image from 'next/image';
import Link from 'next/link';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { inr } from '@/lib/format';
import { merch, type MerchCard } from '@/lib/merch';
import { Container, Dot, Eyebrow } from './Section';

export function MerchTile({ item, sizes, compact = false }: { item: MerchCard; sizes: string; compact?: boolean }) {
  const href = item.earned ? '/regulars' : `/order?item=${item.id}`;
  return (
    <Link href={href} className="group block" aria-label={item.earned ? `${item.name}. Earned with a full tally card. How it works` : `${item.name}, ${inr(item.price!)}. Add to order`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-toast">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.045]"
          style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
        />
        {item.earned && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-espresso px-3 py-1.5 text-xs font-semibold text-milk">
            <span className="size-1.5 rounded-full bg-lime" aria-hidden />
            Earned
          </span>
        )}
      </div>
      <div className={['flex items-baseline justify-between gap-3', compact ? 'mt-3' : 'mt-4'].join(' ')}>
        <h3 className={compact ? 'font-display text-base font-semibold md:text-lg' : 't-subhead'}>{item.name}</h3>
        {item.price ? <p className="shrink-0 font-display font-semibold tabular-nums">{inr(item.price)}</p> : null}
      </div>
      <p className={['text-grind', compact ? 'mt-0.5 line-clamp-2 text-sm' : 'mt-1 text-[0.9375rem]'].join(' ')}>{item.line}</p>
    </Link>
  );
}

/** Home page: a small strip, not a store. */
export function MerchTeaser({ n = '06' }: { n?: string }) {
  return (
    <section className="border-t border-line py-16 md:py-28" aria-labelledby="merch-teaser-title">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal fade>
              <Eyebrow n={n}>Merch</Eyebrow>
            </Reveal>
            <Lines
              id="merch-teaser-title"
              className="t-headline mt-4"
              lines={[
                <>
                  Take it <span className="accent">home</span>
                  <Dot />
                </>,
              ]}
            />
          </div>
          <Reveal delay={150} className="hidden shrink-0 sm:block">
            <ButtonLink href="/merch" variant="outline" arrow>
              Shop merch
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
      <ul className="no-scrollbar mx-auto mt-8 flex max-w-[1440px] snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 md:mt-12 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-8 xl:px-12" aria-label="Merch">
        {merch.map((m, i) => (
          <Reveal as="li" key={m.id} delay={i * 70} className="w-[42vw] max-w-[220px] shrink-0 snap-start md:w-auto md:max-w-none">
            <MerchTile item={m} compact sizes="(min-width: 768px) 23vw, 42vw" />
          </Reveal>
        ))}
      </ul>
      <Container className="mt-8 sm:hidden">
        <ButtonLink href="/merch" variant="outline" arrow className="w-full">
          Shop merch
        </ButtonLink>
      </Container>
    </section>
  );
}
