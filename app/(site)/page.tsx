import { Facts, Hero, Idea, Values } from '@/components/site/home/Hero';
import { MenuRail } from '@/components/site/home/MenuRail';
import { Gallery, Merch, Places, Ritual, UsualOfTheWeek } from '@/components/site/home/More';
import { NameLine } from '@/components/site/home/NameLine';
import { SignOff } from '@/components/site/SignOff';
import { site } from '@/lib/site';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'the usual',
    description: site.description,
    url: site.url,
    servesCuisine: ['Coffee', 'Indian', 'Vegetarian'],
    priceRange: '₹',
    slogan: site.tagline,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'IN' },
    hasMenu: `${site.url}/menu`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Facts />
      <Idea />
      <Values />
      <MenuRail />
      <NameLine />
      <Ritual />
      <Gallery />
      <Places />
      <UsualOfTheWeek />
      <Merch />
      <SignOff />
    </>
  );
}
