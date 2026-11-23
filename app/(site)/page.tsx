import type { Metadata } from 'next';
import { MerchTeaser } from '@/components/site/Merch';
import { Hero, Idea } from '@/components/site/home/Hero';
import { MenuRail } from '@/components/site/home/MenuRail';
import { FindUs } from '@/components/site/home/More';
import { Protein } from '@/components/site/home/Protein';
import { SignOff } from '@/components/site/SignOff';
import { businessJsonLd } from '@/lib/seo';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd()) }} />
      <Hero />
      <Protein />
      <Idea />
      <MenuRail />
      <FindUs />
      <MerchTeaser />
      <SignOff />
    </>
  );
}
