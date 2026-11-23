import { categories, itemsIn } from './menu';
import { getLocation, site } from './site';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Business + website identity for Google: name, alternates, menu, hours, ordering. */
export function businessJsonLd() {
  const takeaway = getLocation('rj-twin');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: 'the usual',
        alternateName: ['The Usual', 'the usual café', 'The Usual Mesa', 'the usual Bengaluru'],
        inLanguage: 'en-IN',
      },
      {
        '@type': 'CafeOrCoffeeShop',
        '@id': `${site.url}/#business`,
        name: 'the usual',
        alternateName: ['The Usual', 'the usual café', 'The Usual Mesa'],
        description: site.description,
        slogan: site.tagline,
        url: site.url,
        logo: `${site.url}/icons/icon-512.png`,
        image: `${site.url}/opengraph-image.jpg`,
        servesCuisine: ['Coffee', 'Indian', 'Vegetarian', 'High protein'],
        priceRange: '₹99–₹219',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
        acceptsReservations: false,
        hasMenu: `${site.url}/menu`,
        address: { '@type': 'PostalAddress', streetAddress: 'RJ Twin Building', addressLocality: site.city, addressRegion: 'Karnataka', addressCountry: 'IN' },
        ...(takeaway && {
          openingHoursSpecification: [
            { '@type': 'OpeningHoursSpecification', dayOfWeek: takeaway.hours.days.map((d) => DAY_NAMES[d]), opens: takeaway.hours.open, closes: takeaway.hours.close },
          ],
        }),
        potentialAction: {
          '@type': 'OrderAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/order`, actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'] },
          deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModePickUp',
        },
        ...(site.instagram.url && { sameAs: [site.instagram.url] }),
      },
    ],
  };
}

/** The menu, with protein on the rolls, for rich results. */
export function menuJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'the usual — Menu No. 01',
    url: `${site.url}/menu`,
    inLanguage: 'en-IN',
    hasMenuSection: categories
      .filter((c) => c.id !== 'merch')
      .map((c) => ({
        '@type': 'MenuSection',
        name: c.title,
        description: c.blurb,
        hasMenuItem: itemsIn(c.id).map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          description: i.protein ? `${i.description}. ${i.protein}g+ protein.` : i.description,
          suitableForDiet: 'https://schema.org/VegetarianDiet',
          ...(i.protein && { nutrition: { '@type': 'NutritionInformation', proteinContent: `${i.protein} g` } }),
          offers: { '@type': 'Offer', price: i.price, priceCurrency: 'INR' },
        })),
      })),
  };
}

export type Faq = { q: string; a: string };

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export const FAQS: Faq[] = [
  { q: 'Where is the usual?', a: 'At Mesa in Bengaluru. Take away from our counter at RJ Twin Building, or pre-order in the app and pick up at Mesa.' },
  { q: 'How much protein is in a roll?', a: 'Every roll has 35g+ protein, from 80–100g of high-protein paneer wrapped in a grilled roti.' },
  { q: 'Is the usual vegetarian?', a: 'Yes. The whole menu is 100% vegetarian.' },
  { q: 'How do I pre-order?', a: 'Open the order page, pick your usual, choose a pickup time and add your name for the cup. Pre-order by 11 for lunch by 1. You pay at pickup by UPI, card or cash.' },
  { q: 'What does “your usual” mean?', a: 'Save any order as your usual and next time it’s one tap. We write your name on the cup, every time.' },
  { q: 'Do you have a loyalty card?', a: 'Yes, the tally. Every order adds a stroke; five strokes and the next one’s on us. It works with your phone number, no app to download.' },
];
