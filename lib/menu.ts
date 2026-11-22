// Menu No. 01 — from the current menu poster. 100% vegetarian, prices in ₹.
// Option prices (extras, sizes, dips) are proposals: adjust to your costing.

export type CategoryId = 'rolls' | 'fries' | 'bowls' | 'drinks';

export type OptionChoice = { id: string; label: string; price?: number };

export type OptionGroup = {
  id: string;
  label: string;
  /** single = pick exactly one; multi = pick any (up to max) */
  type: 'single' | 'multi';
  choices: OptionChoice[];
  /** Pre-selected choice for single groups. Single groups always have a selection. */
  defaultChoice?: string;
  max?: number;
};

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: string;
  /** Short line, as printed on the menu. */
  description: string;
  /** A sentence or two for the item sheet. */
  long: string;
  price: number;
  image?: string;
  imageAlt?: string;
  /** CSS object-position for crops. */
  imagePosition?: string;
  options: OptionGroup[];
  /** Base minutes to make one. */
  prep: number;
};

export type Category = { id: CategoryId; title: string; blurb: string };

export const categories: Category[] = [
  { id: 'rolls', title: 'Rolls', blurb: 'Grilled roti, real paneer, built to eat with one hand.' },
  { id: 'fries', title: 'Fries', blurb: 'Thick-cut, double-fried, salted right.' },
  { id: 'bowls', title: 'Bowls', blurb: 'The same fillings over rice. Lunch, sorted.' },
  { id: 'drinks', title: 'Drinks', blurb: 'Cold, hot, or somewhere sweet in between.' },
];

const spice: OptionGroup = {
  id: 'spice',
  label: 'Spice',
  type: 'single',
  defaultChoice: 'medium',
  choices: [
    { id: 'mild', label: 'Mild' },
    { id: 'medium', label: 'Medium' },
    { id: 'hot', label: 'Hot' },
  ],
};

const rollExtras: OptionGroup = {
  id: 'extras',
  label: 'Extras',
  type: 'multi',
  choices: [
    { id: 'extra-paneer', label: 'Extra paneer', price: 40 },
    { id: 'extra-cheese', label: 'Extra cheese', price: 30 },
  ],
};

const side: OptionGroup = {
  id: 'side',
  label: 'Make it lunch',
  type: 'multi',
  choices: [
    { id: 'salted-fries', label: 'Salted fries', price: 89 },
    { id: 'cold-coffee', label: 'Cold coffee', price: 89 },
  ],
};

const dip = (defaultChoice: string): OptionGroup => ({
  id: 'dip',
  label: 'Dip',
  type: 'single',
  defaultChoice,
  choices: [
    { id: 'ketchup', label: 'Ketchup' },
    { id: 'garlic-mayo', label: 'Garlic mayo', price: 20 },
    { id: 'cheese-dip', label: 'Cheese dip', price: 30 },
  ],
});

const bowlSize: OptionGroup = {
  id: 'size',
  label: 'Size',
  type: 'single',
  defaultChoice: 'regular',
  choices: [
    { id: 'regular', label: 'Regular · 500 ml' },
    { id: 'large', label: 'Large · 750 ml', price: 60 },
  ],
};

const bowlExtras: OptionGroup = {
  id: 'extras',
  label: 'Extras',
  type: 'multi',
  choices: [
    { id: 'extra-paneer', label: 'Extra paneer', price: 40 },
    { id: 'extra-onions', label: 'Extra pickled onions', price: 10 },
  ],
};

const cupSize: OptionGroup = {
  id: 'size',
  label: 'Cup',
  type: 'single',
  defaultChoice: '8oz',
  choices: [
    { id: '8oz', label: '8 oz' },
    { id: '12oz', label: '12 oz', price: 30 },
  ],
};

const milk: OptionGroup = {
  id: 'milk',
  label: 'Milk',
  type: 'single',
  defaultChoice: 'dairy',
  choices: [
    { id: 'dairy', label: 'Dairy' },
    { id: 'oat', label: 'Oat', price: 40 },
  ],
};

const sweetness: OptionGroup = {
  id: 'sweetness',
  label: 'Sweetness',
  type: 'single',
  defaultChoice: 'regular',
  choices: [
    { id: 'regular', label: 'Regular' },
    { id: 'less', label: 'Less sweet' },
    { id: 'none', label: 'No sugar' },
  ],
};

export const menu: MenuItem[] = [
  // ── Rolls
  {
    id: 'ghee-roast-roll',
    category: 'rolls',
    name: 'Ghee Roast Roll',
    description: 'Paneer in Mangalorean ghee roast masala',
    long: 'Paneer tossed in Mangalorean ghee roast masala with red onion, peppers and crisp lettuce, wrapped in a grilled roti.',
    price: 179,
    image: '/images/roll-ghee-roast.jpg',
    imageAlt: 'Ghee Roast Roll cut in half, paneer and peppers facing the camera',
    imagePosition: '58% 50%',
    options: [spice, rollExtras, side],
    prep: 6,
  },
  {
    id: 'makhani-dunk',
    category: 'rolls',
    name: 'Makhani Dunk',
    description: 'Paneer roll with makhani gravy to dip',
    long: 'A paneer makhani roll with a pot of buttery makhani gravy on the side. Dunk, bite, repeat.',
    price: 189,
    image: '/images/roll-makhani-dunk.jpg',
    imageAlt: 'Makhani Dunk roll halves with a pot of makhani gravy',
    options: [spice, rollExtras, side],
    prep: 6,
  },
  {
    id: 'chipotle-cheese-roll',
    category: 'rolls',
    name: 'Chipotle Cheese Roll',
    description: 'Smoky chipotle, melted cheese, crunchy veg',
    long: 'Smoky chipotle paneer, black beans, sweetcorn and peppers under melted cheese, grilled until it stretches. Cheese dip on the side.',
    price: 199,
    image: '/images/roll-chipotle-cheese.jpg',
    imageAlt: 'Chipotle Cheese Roll with stretching cheese and a cheese dip',
    imagePosition: '52% 50%',
    options: [spice, rollExtras, side],
    prep: 7,
  },
  // ── Fries
  {
    id: 'salted-fries',
    category: 'fries',
    name: 'Salted',
    description: 'Crisp, golden, sea salt',
    long: 'Thick-cut, double-fried and finished with flaky sea salt. Ketchup on the side.',
    price: 99,
    image: '/images/fries-salted.jpg',
    imageAlt: 'Salted fries in a kraft box with ketchup',
    options: [dip('ketchup')],
    prep: 5,
  },
  {
    id: 'peri-peri-fries',
    category: 'fries',
    name: 'Peri-Peri',
    description: 'Tossed in peri-peri spice',
    long: 'Our fries tossed in house peri-peri spice, with garlic mayo to cool things down.',
    price: 119,
    image: '/images/fries-peri-peri.jpg',
    imageAlt: 'Peri-peri fries in a kraft box with garlic mayo',
    options: [dip('garlic-mayo')],
    prep: 5,
  },
  {
    id: 'loaded-fries',
    category: 'fries',
    name: 'Loaded',
    description: 'Cheese sauce, herbs, the works',
    long: 'Fries under cheese sauce, jalapeños, spring onion and chilli flakes. Fork included.',
    price: 149,
    image: '/images/fries-loaded.jpg',
    imageAlt: 'Loaded fries with cheese sauce and jalapeños, a fry lifted with stretching cheese',
    options: [],
    prep: 6,
  },
  // ── Bowls
  {
    id: 'ghee-roast-bowl',
    category: 'bowls',
    name: 'Ghee Roast Bowl',
    description: 'Paneer ghee roast, dal makhani, rice',
    long: 'Paneer ghee roast and slow-cooked dal makhani over jeera rice, with pickled onions.',
    price: 219,
    image: '/images/bowl-ghee-roast.jpg',
    imageAlt: 'Ghee Roast Bowl with paneer, dal makhani, rice and pickled onions',
    options: [bowlSize, bowlExtras],
    prep: 5,
  },
  {
    id: 'chipotle-salsa-bowl',
    category: 'bowls',
    name: 'Chipotle Salsa Bowl',
    description: 'Chipotle rice, beans, tomato salsa',
    long: 'Chipotle rice, smoky beans and fresh tomato salsa, finished with pickled onions.',
    price: 219,
    image: '/images/bowl-chipotle-salsa.jpg',
    imageAlt: 'A kraft bowl of beans and rice with pickled onions',
    options: [bowlSize, bowlExtras],
    prep: 5,
  },
  // ── Drinks
  {
    id: 'cold-coffee',
    category: 'drinks',
    name: 'Cold Coffee',
    description: 'Thick, chilled, not too sweet',
    long: 'Blended thick and cold with just enough sugar. Ask for it less sweet and we’ll remember.',
    price: 99,
    image: '/images/cold-coffee.jpg',
    imageAlt: 'Iced coffee in a clear the usual cup',
    options: [sweetness, milk],
    prep: 3,
  },
  {
    id: 'hot-chocolate',
    category: 'drinks',
    name: 'Hot Chocolate',
    description: 'Rich cocoa, steamed milk',
    long: 'Proper cocoa melted into steamed milk. Hands round the cup, name on the side.',
    price: 129,
    image: '/images/hot-chocolate.jpg',
    imageAlt: 'Hot chocolate in a the usual cup with a name sticker for Kabir',
    options: [cupSize, milk],
    prep: 3,
  },
  {
    id: 'berry-cookie-smoothie',
    category: 'drinks',
    name: 'Berry Cookie Smoothie',
    description: 'Mixed berries, cookie crumble',
    long: 'Mixed berries blended with yoghurt, topped with cookie crumble. Dessert you can drink at lunch.',
    price: 149,
    options: [milk],
    prep: 4,
  },
];

export const menuById: Record<string, MenuItem> = Object.fromEntries(menu.map((m) => [m.id, m]));

export function itemsIn(category: CategoryId): MenuItem[] {
  return menu.filter((m) => m.category === category);
}

/** Items shown on the home page rail. */
export const featuredIds = [
  'ghee-roast-roll',
  'makhani-dunk',
  'chipotle-cheese-roll',
  'ghee-roast-bowl',
  'loaded-fries',
  'hot-chocolate',
];
