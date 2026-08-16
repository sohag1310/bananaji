export type Category = string;

export interface SiteConfig {
  siteName: string;
  brandPrefix: string;
  brandSuffix: string;
  logoUrl?: string;
  tagline: string;
  description: string;
  announcementText: string;
  showAnnouncement: boolean;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  workingHours: string;
  currencySymbol: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  bkashNumber: string;
  nagadNumber: string;
  footerCopyright: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface FilterConfig {
  categories: string[];
  ripenessLabel: string;
  ripenessFilters: string[];
}

export interface BannerItem {
  id: number | string;
  image: string;
  title: string;
  alt: string;
  subtitle?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string;
  tag: string;
  keyPoints?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified?: boolean;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  origin: string;
  sweetnessIndex: number; // 1 to 5
  ripeness: 'Green / Firm' | 'Perfect Yellow' | 'Sweet Spotted';
  organic: boolean;
  bestseller?: boolean;
  description: string;
  benefits: string[];
  nutrition: {
    calories: number;
    potassium: string;
    fiber: string;
    vitaminB6: string;
  };
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedRipeness?: string;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zone: string;
  zipCode?: string;
  deliveryMessage?: string; // Message field if unsure about address or instructions
}

export interface Order {
  id: string;
  date: string;
  createdAt?: string;
  items: CartItem[];
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  paymentMethod?: 'cash_on_delivery' | 'bkash' | 'nagad' | 'card';
  paymentStatus?: 'Pending' | 'Paid' | 'Pending Verification' | 'Verified';
  transactionId?: string;
  senderNumber?: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Harvesting' | 'Quality Check' | 'Eco Packaging' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  cancellationReason?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  adminNotes?: string;
  shippingAddress: ShippingDetails;
  estimatedDelivery: string;
  userId?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  providerId?: string;
  createdAt: string;
}
