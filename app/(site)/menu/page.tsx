import type { Metadata } from 'next';
import Link from 'next/link';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { MenuBoard } from '@/components/site/MenuBoard';
import { Container, Dot, Eyebrow } from '@/components/site/Section';
import { SignOff } from '@/components/site/SignOff';
import { ButtonLink } from '@/components/ui/Button';
import { categories as allCategories, itemsIn, menu } from '@/lib/menu';

const categories = allCategories.filter((c) => c.id !== 'merch');
const foodCount = menu.filter((m) => m.category !== 'merch').length;
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Rolls, fries, bowls and drinks at the usual, Bengaluru. 100% vegetarian, prices in ₹. Order ahead for pickup.',
  alternates: { canonical: '/menu' },
};

export default function MenuPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'the usual — Menu No. 01',
    url: `${site.url}/menu`,
    hasMenuSection: categories.map((c) => ({
      '@type': 'MenuSection',
      name: c.title,
      hasMenuItem: itemsIn(c.id).map((i) => ({
        '@type': 'MenuItem',
        name: i.name,
        description: i.description,
        suitableForDiet: 'https://schema.org/VegetarianDiet',
        offers: { '@type': 'Offer', price: i.price, priceCurrency: 'INR' },
      })),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-24 md:pt-36">
        <Container>
          <div className="flex items-center justify-between">
            <Reveal fade>
              <Eyebrow>Menu No. 01</Eyebrow>
            </Reveal>
            <Reveal fade delay={120}>
              <p className="t-label text-grind">{foodCount} things, made properly</p>
            </Reveal>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:items-end">
            <Lines
              as="h1"
              className="t-display md:col-span-8"
              delay={100}
              lines={[
                'Short menu.',
                <>
                  Made <span className="accent">properly</span>
                  <Dot />
                </>,
              ]}
            />
            <Reveal delay={300} className="md:col-span-4">
              <p className="t-body-lg text-grind">100% vegetarian. All prices in ₹. Ask for your name on the cup — or skip the asking and order ahead.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/order" variant="espresso" arrow>
                  Order ahead
                </ButtonLink>
                <a href="/images/menu-no-01.jpg" download className="inline-flex min-h-12 items-center px-2 text-[0.9375rem] font-semibold underline decoration-line-strong underline-offset-4 hover:decoration-espresso">
                  Download menu
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <nav aria-label="Menu sections" className="sticky top-[var(--header-h,0px)] z-30 mt-14 transition-[top] duration-500 ease-[var(--ease-out-expo)] border-y border-line bg-milk/90 backdrop-blur-md md:mt-20">
        <Container>
          <ul className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`#${c.id}`} className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors hover:bg-foam">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <Container className="pb-20 md:pb-32">
        {categories.map((c, i) => (
          <MenuBoard key={c.id} category={c} items={itemsIn(c.id)} index={i} />
        ))}
        <p className="border-t border-line pt-8 text-sm text-grind">
          Looking for caps, tees and mugs?{' '}
          <Link href="/merch" className="font-semibold text-espresso underline decoration-line-strong underline-offset-4">
            Shop merch
          </Link>
          .{' '}
          Something on your mind? Allergies, spice, a birthday — add a note when you order, or tell us at the counter.
        </p>
      </Container>

      <SignOff />
    </>
  );
}
