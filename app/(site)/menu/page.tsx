import type { Metadata } from 'next';
import Link from 'next/link';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { MenuBoard } from '@/components/site/MenuBoard';
import { MenuSectionsNav } from '@/components/site/MenuSectionsNav';
import { Container, Dot, Eyebrow } from '@/components/site/Section';
import { SignOff } from '@/components/site/SignOff';
import { ButtonLink } from '@/components/ui/Button';
import { categories as allCategories, itemsIn, menu } from '@/lib/menu';
import { menuJsonLd } from '@/lib/seo';

const categories = allCategories.filter((c) => c.id !== 'merch');
const foodCount = menu.filter((m) => m.category !== 'merch').length;

export const metadata: Metadata = {
  title: 'Menu: high-protein paneer rolls, fries, bowls & coffee',
  description: 'The usual menu: high-protein paneer rolls with 35g+ protein, fries, bowls, cold coffee and hot chocolate at Mesa, Bengaluru. 100% vegetarian, prices in ₹. Order ahead for pickup.',
  alternates: { canonical: '/menu' },
};

export default function MenuPage() {
  const jsonLd = menuJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-28 md:pt-40">
        <Container>
          <div className="flex items-center justify-between">
            <Reveal fade>
              <Eyebrow>Menu No. 01</Eyebrow>
            </Reveal>
            <Reveal fade delay={120}>
              <p className="t-label text-grind">{foodCount} items · 100% veg</p>
            </Reveal>
          </div>
          <Lines
            as="h1"
            className="t-display mt-5 md:mt-8"
            delay={100}
            lines={[
              'Short menu.',
              <>
                Made <span className="accent">properly</span>
                <Dot />
              </>,
            ]}
          />
          <div className="mt-8 grid grid-cols-1 items-end gap-6 md:mt-12 md:grid-cols-12">
            <Reveal delay={300} className="md:col-span-6">
              <p className="t-body-lg max-w-[40ch] text-grind">35g+ protein in every roll. 100% vegetarian, prices in ₹. Ask for your name on the cup, or skip the queue and order ahead.</p>
            </Reveal>
            <Reveal delay={400} className="flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end">
              <ButtonLink href="/order" variant="espresso" arrow>
                Order ahead
              </ButtonLink>
              <a href="/images/menu-no-01.jpg" download className="inline-flex min-h-12 items-center px-2 text-[0.9375rem] font-semibold underline decoration-line-strong underline-offset-4 hover:decoration-espresso">
                Download menu
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The category bar only sticks while you're inside the menu, never over the sign-off or footer. */}
      <div className="mt-14 md:mt-20">
        <MenuSectionsNav categories={categories.map(({ id, title }) => ({ id, title }))} />
        <Container>
          {categories.map((c, i) => (
            <MenuBoard key={c.id} category={c} items={itemsIn(c.id)} index={i} />
          ))}
        </Container>
      </div>

      <Container className="pb-20 md:pb-32">
        <p className="max-w-[60ch] border-t border-line pt-8 text-sm leading-relaxed text-grind">
          Allergies, spice, a birthday? Add a note when you order, or tell us at the counter. Caps, tees and mugs are in{' '}
          <Link href="/merch" className="font-semibold text-espresso underline decoration-line-strong underline-offset-4">
            merch
          </Link>
          .
        </p>
      </Container>

      <SignOff />
    </>
  );
}
