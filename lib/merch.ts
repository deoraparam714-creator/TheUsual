import { menuById } from './menu';

export type MerchCard = {
  id: string;
  name: string;
  line: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  /** Present for items you can add to an order. */
  price?: number;
  /** The tote is earned, never sold (Brand Guidelines p.20). */
  earned?: boolean;
};

const fromMenu = (id: string): MerchCard => {
  const m = menuById[id];
  return { id: m.id, name: m.name, line: m.description, image: m.image!, imageAlt: m.imageAlt ?? m.name, imagePosition: m.imagePosition, price: m.price };
};

export const merch: MerchCard[] = [
  {
    id: 'tote',
    name: 'The Tote',
    line: 'Earned, not bought. Free with your first full tally card.',
    image: '/images/tote.jpg',
    imageAlt: 'A natural canvas the usual tote hanging on a wooden peg',
    earned: true,
  },
  fromMenu('merch-cap'),
  fromMenu('merch-tee'),
  fromMenu('merch-mug'),
];
