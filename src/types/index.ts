export interface HealthBenefit {
  title: string;
  percentage: number;
  icon: string;
  description: string;
}

export interface NutritionInfo {
  calories: string;
  protein: string;
  fiber: string;
  carbs: string;
  vitaminA: string;
  vitaminC: string;
  iron: string;
  storage: string;
  howToConsume: string;
  origin: string;
  bestBefore: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number; // base price for 1kg or base unit
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  badge: 'Organic' | 'Farm Fresh' | 'Exotic' | 'Best Seller' | 'Limited Deal';
  inStock: boolean;
  image: string;
  thumbnails: string[];
  description: string;
  weights: string[]; // e.g. ['250g', '500g', '1kg', '2kg']
  healthBenefits: HealthBenefit[];
  nutrition: NutritionInfo;
  reviews: Review[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isAdded?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  productCount: number;
  slug: string;
  description: string;
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  weightMultiplier: number;
  quantity: number;
  itemPrice: number; // calculated based on weight & base price
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  organicOnly: boolean;
  inStockOnly: boolean;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'discount' | 'newest';
  searchQuery: string;
}

export interface DeliveryAddress {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

export interface DeliverySlot {
  id?: string;
  date: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Express';
  slotTimeText: string;
  label?: string;
  isExpress?: boolean;
}

