import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'veggies',
    name: 'Fresh Vegetables',
    slug: 'fresh-vegetables',
    icon: 'Leaf',
    image: '/images/carrots.png',
    productCount: 30,
    description: 'Crisp, nutrient-rich vegetables harvested fresh daily from certified organic farms.'
  },
  {
    id: 'fruits',
    name: 'Fresh Fruits',
    slug: 'fresh-fruits',
    icon: 'Apple',
    image: '/images/apple.png',
    productCount: 25,
    description: 'Naturally sweet, juicy, sun-ripened organic fruits packed with vital vitamins.'
  },
  {
    id: 'greens',
    name: 'Leafy Greens',
    slug: 'leafy-greens',
    icon: 'Sprout',
    image: '/images/spinach.png',
    productCount: 15,
    description: 'Farm-fresh spinach, kale, lettuce, and microgreens harvested at peak vitality.'
  },
  {
    id: 'herbs',
    name: 'Herbs & Spices',
    slug: 'herbs-spices',
    icon: 'Sparkles',
    image: '/images/tomatoes.png',
    productCount: 20,
    description: 'Aromatic basil, coriander, mint, ginger, and fresh cooking herbs.'
  },
  {
    id: 'organic',
    name: 'Organic Picks',
    slug: 'organic-picks',
    icon: 'ShieldCheck',
    image: '/images/broccoli.png',
    productCount: 20,
    description: '100% pesticide-free, chemical-free organic produce grown with clean soil care.'
  },
  {
    id: 'exotic',
    name: 'Exotic Vegetables',
    slug: 'exotic-vegetables',
    icon: 'Sparkles',
    image: '/images/c4.png',
    productCount: 25,
    description: 'Premium imported red capsicum, zucchini, asparagus, and specialty produce.'
  },
  {
    id: 'salads',
    name: 'Salad & Microgreens',
    slug: 'salad-microgreens',
    icon: 'Leaf',
    image: '/images/c5.png',
    productCount: 15,
    description: 'Nutrient-packed microgreens, cherry tomatoes, and salad bowl essentials.'
  },
  {
    id: 'essentials',
    name: 'Daily Essentials',
    slug: 'daily-essentials',
    icon: 'Tag',
    image: '/images/banana.png',
    productCount: 40,
    description: 'Everyday staple potatoes, onions, garlic, and fresh kitchen necessities.'
  }
];
