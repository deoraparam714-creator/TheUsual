import { Facts, Hero, Idea } from '@/components/site/home/Hero';
import { MenuRail } from '@/components/site/home/MenuRail';
import { Places, Ritual } from '@/components/site/home/More';
import { MerchTeaser } from '@/components/site/Merch';
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
      <MenuRail />
      <NameLine />
      <Ritual />
      <Places />
      <MerchTeaser n="06" />
      <SignOff />
    </>
  );
}
