import Link from 'next/link';
import { ItemImage } from '@/components/menu/ItemImage';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { inr } from '@/lib/format';
import { featuredIds, menuById } from '@/lib/menu';
import { Container, Dot, Eyebrow } from '../Section';
import { Rail } from './Rail';

export function MenuRail() {
  const items = featuredIds.map((id) => menuById[id]).filter(Boolean);
  return (
    <section className="overflow-hidden bg-foam py-24 md:py-36" aria-labelledby="menu-rail-title">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal fade>
              <Eyebrow n="03">The menu</Eyebrow>
            </Reveal>
            <Lines id="menu-rail-title" className="t-display mt-5" lines={[<>Lunch, sorted<Dot key="d" /></>]} />
            <Reveal delay={150}>
              <p className="t-body-lg mt-6 max-w-[40ch] text-grind">Rolls, fries, bowls and something to sip. Short menu, made properly, priced clearly.</p>
            </Reveal>
          </div>
          <Reveal delay={200} className="shrink-0">
            <ButtonLink href="/menu" variant="outline" arrow>
              Full menu
            </ButtonLink>
          </Reveal>
        </div>
      </Container>

      <Rail label="Featured menu items">
        {items.map((item, i) => (
          <li key={item.id} className="w-[76vw] shrink-0 snap-start xs:w-[60vw] sm:w-[44vw] md:w-[31vw] lg:w-[23.5vw] 2xl:w-[330px]">
            <Reveal delay={i * 80}>
              <Link href={`/order?item=${item.id}`} className="group block" aria-label={`${item.name}, ${inr(item.price)}. Order`}>
                <ItemImage
                  item={item}
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 76vw"
                  className="aspect-[4/5] rounded-[18px]"
                  imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.045]"
                />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="t-subhead">{item.name}</h3>
                  <p className="font-display text-lg font-semibold tabular-nums">{inr(item.price)}</p>
                </div>
                <p className="mt-1 text-[0.9375rem] text-grind">{item.description}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
                  Add to order <span aria-hidden>→</span>
                </p>
              </Link>
            </Reveal>
          </li>
        ))}
      </Rail>
    </section>
  );
}
