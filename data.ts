import { Product, Category, SiteConfig, FilterConfig } from './types';

// High resolution locally generated retail packaging & packaged snack photography
import imgPkgRockSaltKolar from './assets/images/pkg_rock_salt_kolar_1786832542152.jpg';
import imgPkgMasalaKolar from './assets/images/pkg_masala_kolar_1786832557842.jpg';
import imgPkgJaggeryKolar from './assets/images/pkg_jaggery_kolar_1786832570453.jpg';
import imgPkgPineappleChips from './assets/images/pkg_pineapple_chips_1786832582454.jpg';
import imgPkgJackfruitChips from './assets/images/pkg_jackfruit_chips_1786832593274.jpg';
import imgPkgRootMedley from './assets/images/pkg_root_medley_1786832605947.jpg';
import imgPkgPepperPlantain from './assets/images/pkg_pepper_plantain_1786832619132.jpg';
import imgPkgGiftTinMedley from './assets/images/pkg_gift_tin_medley_1786832634256.jpg';
import imgCollarChipsKettle from './assets/images/banner_collar_chips_1786832190569.jpg';
import imgPineappleChipsSolar from './assets/images/banner_pineapple_chips_1786832203710.jpg';

export const PRODUCTS: Product[] = [
  // =========================================================================
  // 1. KOLAR CHIPS (COLAR / BANANA & PLANTAIN CHIPS)
  // =========================================================================
  {
    id: 'chip-01',
    name: 'Artisanal Rock Salt Kolar Chips (150g Pouch)',
    tagline: 'Nitrogen-sealed pouch of ultra-thin golden green banana crisps with Himalayan pink rock salt',
    category: 'Kolar Chips',
    price: 120,
    originalPrice: 150,
    rating: 5.0,
    reviewCount: 384,
    image: imgPkgRockSaltKolar,
    origin: 'Munshiganj Eco Banana Groves',
    sweetnessIndex: 1,
    ripeness: 'Green / Firm',
    organic: true,
    bestseller: true,
    description: 'Packed in a premium multi-layer matte stand-up pouch with foil barrier lining that seals in maximum crispness. Crafted from sunrise-harvested green cooking bananas, kettle-cooked in pure cold-pressed coconut oil, and dusted with crushed Himalayan rock salt flakes.',
    benefits: ['Airtight foil moisture-barrier pouch', 'Zero trans fats or palm oil', 'Cooked in pure cold-pressed coconut oil', 'High potassium & prebiotic resistant starch'],
    nutrition: {
      calories: 140,
      potassium: '460 mg',
      fiber: '3.8 g',
      vitaminB6: '25% DV',
    },
    reviews: []
  },
  {
    id: 'chip-02',
    name: 'Spiced Chili Masala Kolar Chips (150g Pouch)',
    tagline: 'Matte foil snack pouch of fiery roasted cumin, Kashmiri chili & tangy chaat masala dusted chips',
    category: 'Kolar Chips',
    price: 130,
    originalPrice: 160,
    rating: 4.9,
    reviewCount: 295,
    image: imgPkgMasalaKolar,
    origin: 'Artisan Spice Mill & Farm',
    sweetnessIndex: 1,
    ripeness: 'Green / Firm',
    organic: true,
    bestseller: true,
    description: 'Sealed in an eye-catching spice-toned stand-up snack pack. A zesty South Asian twist on classic kolar chips, generously dusted with stone-ground Kashmiri red chili, roasted cumin, black pepper, and dry mango amchur powder.',
    benefits: ['Resealable freshness lock', 'Bold spicy kick without artificial MSG', 'Stimulates digestive enzymes'],
    nutrition: {
      calories: 145,
      potassium: '450 mg',
      fiber: '3.9 g',
      vitaminB6: '28% DV',
    },
    reviews: []
  },
  {
    id: 'chip-03',
    name: 'Jaggery Glazed Sweet Kolar Chips (180g Pouch)',
    tagline: 'Artisanal craft paper pouch of thick-cut banana chips coated in organic date jaggery & cardamom',
    category: 'Kolar Chips',
    price: 160,
    originalPrice: 190,
    rating: 5.0,
    reviewCount: 212,
    image: imgPkgJaggeryKolar,
    origin: 'Heritage Kerala-Bengal Confection',
    sweetnessIndex: 4,
    ripeness: 'Green / Firm',
    organic: true,
    bestseller: true,
    description: 'Presented in an elegant amber craft paper stand-up pouch. Crispy thick-cut banana chunks caramelized in pure unrefined sugarcane and date-palm jaggery molasses, accented with toasted dry ginger (shukku) and fragrant cardamom.',
    benefits: ['Premium kraft zip pouch', 'Rich in natural plant iron', 'Refined sugar free festive treat'],
    nutrition: {
      calories: 170,
      potassium: '480 mg',
      fiber: '4.2 g',
      vitaminB6: '20% DV',
    },
    reviews: []
  },
  {
    id: 'chip-04',
    name: 'Black Pepper & Sea Salt Plantain Chips (150g Bag)',
    tagline: 'Matte black gourmet snack pack with thick ridged plantains & coarse Tellicherry peppercorn',
    category: 'Kolar Chips',
    price: 140,
    originalPrice: 170,
    rating: 4.8,
    reviewCount: 180,
    image: imgPkgPepperPlantain,
    origin: 'Coastal Plantain Basin',
    sweetnessIndex: 1,
    ripeness: 'Green / Firm',
    organic: true,
    description: 'Packaged in a sleek matte black foil pouch. Crafted from stout green horn plantains for an extra deep crunch, seasoned with cracked whole black peppercorns and coastal sea salt.',
    benefits: ['Heavy-gauge UV-blocking bag', 'Hearty crunch for dips & salsas', 'Piperine aids nutrient absorption'],
    nutrition: {
      calories: 150,
      potassium: '510 mg',
      fiber: '4.5 g',
      vitaminB6: '30% DV',
    },
    reviews: []
  },
  {
    id: 'chip-05',
    name: 'Traditional Kerala Style Kolar Chips (150g Pouch)',
    tagline: 'Brass-kettle cooked banana chips fried in 100% pure virgin coconut oil in sealed pouch',
    category: 'Kolar Chips',
    price: 150,
    rating: 4.9,
    reviewCount: 310,
    image: imgPkgRockSaltKolar,
    origin: 'Traditional Copper Kettle Batch',
    sweetnessIndex: 1,
    ripeness: 'Green / Firm',
    organic: true,
    description: 'The quintessential authentic banana chips experience packed in a nitrogen-flushed golden pouch. Cooked in pure cold-pressed coconut oil for irresistible aroma.',
    benefits: ['Nitrogen flushed for months of crispness', 'Naturally rich in healthy MCT fats', 'Crispy without being greasy'],
    nutrition: {
      calories: 145,
      potassium: '470 mg',
      fiber: '3.7 g',
      vitaminB6: '24% DV',
    },
    reviews: []
  },

  // =========================================================================
  // 2. PINEAPPLE CHIPS
  // =========================================================================
  {
    id: 'chip-06',
    name: 'Golden Sun-Dried Pineapple Crisps (120g Pouch)',
    tagline: 'Vibrant tropical snack pouch of dehydrated sweet honeycomb pineapple rings',
    category: 'Pineapple Chips',
    price: 180,
    originalPrice: 220,
    rating: 5.0,
    reviewCount: 264,
    image: imgPkgPineappleChips,
    origin: 'Madhupur Tropical Pineapple Farms',
    sweetnessIndex: 4,
    ripeness: 'Perfect Yellow',
    organic: true,
    bestseller: true,
    description: 'Packaged in a bright tropical stand-up snack pouch with freshness-preserving seal. Made from giant honey pineapples sliced into delicate rings and gently slow-dehydrated below 45°C to preserve live bromelain enzymes.',
    benefits: ['Resealable foil zipper pouch', 'Rich in digestive enzyme bromelain', '100% real fruit with 0g added sugar'],
    nutrition: {
      calories: 110,
      potassium: '320 mg',
      fiber: '3.5 g',
      vitaminB6: '18% DV',
    },
    reviews: []
  },
  {
    id: 'chip-07',
    name: 'Vacuum-Fried Sweet & Tangy Pineapple Rings (120g Bag)',
    tagline: 'Sealed crisp snack pouch of aerated pineapple chips with light caramelized edges',
    category: 'Pineapple Chips',
    price: 200,
    originalPrice: 240,
    rating: 4.9,
    reviewCount: 198,
    image: imgPkgPineappleChips,
    origin: 'Low-Temperature Vacuum Fry Lab',
    sweetnessIndex: 4,
    ripeness: 'Perfect Yellow',
    organic: true,
    bestseller: true,
    description: 'Sealed in an airtight protective snack pouch. Advanced low-temperature vacuum frying technology locks in the crisp air-bubble crunch while maintaining the vivid golden hue and genuine sweet-tart bite.',
    benefits: ['Airtight crunch shield bag', 'Retains 90%+ natural vitamins', 'Non-greasy dry finish'],
    nutrition: {
      calories: 130,
      potassium: '340 mg',
      fiber: '3.2 g',
      vitaminB6: '20% DV',
    },
    reviews: []
  },
  {
    id: 'chip-08',
    name: 'Chili Lime Infused Pineapple Crisps (120g Pouch)',
    tagline: 'Zesty tropical snack pack with pineapple rings, crushed chilies & Kaffir lime zest',
    category: 'Pineapple Chips',
    price: 190,
    rating: 4.8,
    reviewCount: 145,
    image: imgPkgPineappleChips,
    origin: 'Artisanal Spice Garden',
    sweetnessIndex: 3,
    ripeness: 'Perfect Yellow',
    organic: true,
    description: 'A thrilling balance of sweet golden pineapple, citrusy lime zest, and a fiery speckle of dried bird-eye chili flakes inside a moisture-proof snack pouch.',
    benefits: ['Resealable zipper pouch', 'Invigorating flavor contrast', 'Natural metabolism booster'],
    nutrition: {
      calories: 115,
      potassium: '330 mg',
      fiber: '3.4 g',
      vitaminB6: '19% DV',
    },
    reviews: []
  },

  // =========================================================================
  // 3. EXOTIC FRUIT CHIPS
  // =========================================================================
  {
    id: 'chip-09',
    name: 'Sun-Gold Jackfruit Crisps / Kathal Chips (120g Pouch)',
    tagline: 'Artisanal tropical stand-up pouch of crunchy freeze-crisped ripe golden jackfruit bulbs',
    category: 'Exotic Fruit Chips',
    price: 220,
    originalPrice: 260,
    rating: 5.0,
    reviewCount: 318,
    image: imgPkgJackfruitChips,
    origin: 'Sylhet & Hill Tracts Harvest',
    sweetnessIndex: 4,
    ripeness: 'Sweet Spotted',
    organic: true,
    bestseller: true,
    description: 'Packaged in a vibrant matte green & gold artisan snack pouch. Plump golden bulbs of national jackfruit freeze-crisped into aromatic, crunchy snacking wafers. Naturally sweet with notes of mango, banana, and pineapple.',
    benefits: ['Sealed foil stand-up bag', 'Rich in antioxidant carotenoids', 'Zero added sweeteners or oils'],
    nutrition: {
      calories: 125,
      potassium: '440 mg',
      fiber: '4.0 g',
      vitaminB6: '22% DV',
    },
    reviews: []
  },
  {
    id: 'chip-10',
    name: 'Tropical Mango & Coconut Fruit Wafers (120g Pouch)',
    tagline: 'Sealed snack pouch of dehydrated Alphonso mango ribbons and toasted coconut flakes',
    category: 'Exotic Fruit Chips',
    price: 210,
    rating: 4.9,
    reviewCount: 176,
    image: imgPkgJackfruitChips,
    origin: 'Rajshahi Heritage Orchards',
    sweetnessIndex: 5,
    ripeness: 'Perfect Yellow',
    organic: true,
    description: 'Sun-drenched ripe mango slices dried to a crisp chew paired with crispy toasted copra coconut chips in a sealed tropical snack bag.',
    benefits: ['High Vitamin A & C content', 'Creamy tropical aroma', 'Kids favorite natural snack pack'],
    nutrition: {
      calories: 135,
      potassium: '310 mg',
      fiber: '3.6 g',
      vitaminB6: '16% DV',
    },
    reviews: []
  },

  // =========================================================================
  // 4. ROOT & MEDLEY CHIPS
  // =========================================================================
  {
    id: 'chip-11',
    name: 'Purple Sweet Potato & Taro Chips (150g Pouch)',
    tagline: 'Chic violet & kraft matte snack pouch of antioxidant purple yams and sea-salted taro root',
    category: 'Root & Medley Chips',
    price: 170,
    originalPrice: 200,
    rating: 4.9,
    reviewCount: 230,
    image: imgPkgRootMedley,
    origin: 'Organic Highland Root Co-op',
    sweetnessIndex: 2,
    ripeness: 'Green / Firm',
    organic: true,
    bestseller: true,
    description: 'Packaged in a modern violet and natural kraft matte foil stand-up pouch. Thin crinkle-cut purple sweet potatoes paired with earthy white taro root crisps, lightly salted with Atlantic sea salt and rosemary.',
    benefits: ['High anthocyanin antioxidants', 'Lower glycemic impact than regular chips', 'Resealable moisture shield'],
    nutrition: {
      calories: 135,
      potassium: '420 mg',
      fiber: '4.1 g',
      vitaminB6: '21% DV',
    },
    reviews: []
  },
  {
    id: 'chip-12',
    name: 'Grand Tropical 5-Fruit Medley Chip Gift Box (350g Box)',
    tagline: 'Luxury gift box containing Kolar chips, pineapple, jackfruit, sweet potato & taro pouches',
    category: 'Root & Medley Chips',
    price: 320,
    originalPrice: 380,
    rating: 5.0,
    reviewCount: 420,
    image: imgPkgGiftTinMedley,
    origin: 'Master Blender Reserve Pack',
    sweetnessIndex: 3,
    ripeness: 'Perfect Yellow',
    organic: true,
    bestseller: true,
    description: 'Our pride and joy: an embossed luxury presentation box containing individually sealed foil pouches of crunchy salted Kolar chips, sweet dehydrated pineapple rings, golden jackfruit crisps, purple sweet potato, and taro chips.',
    benefits: ['Individual pouch packaging inside', 'Ideal for family gatherings and gifting', 'Diverse dietary fibers'],
    nutrition: {
      calories: 140,
      potassium: '460 mg',
      fiber: '4.4 g',
      vitaminB6: '26% DV',
    },
    reviews: []
  },

  // =========================================================================
  // 5. PARTY PACKS & TINS
  // =========================================================================
  {
    id: 'chip-13',
    name: 'Artisanal Triple Crunch Gift Tin (3x 200g Airtight Tin)',
    tagline: 'Embossed gold & emerald collector tin with Classic Kolar, Spicy Masala & Golden Pineapple',
    category: 'Party Packs & Tins',
    price: 550,
    originalPrice: 650,
    rating: 5.0,
    reviewCount: 165,
    image: imgPkgGiftTinMedley,
    origin: 'Gift Edition Packaging Guild',
    sweetnessIndex: 3,
    ripeness: 'Green / Firm',
    organic: true,
    bestseller: true,
    description: 'A handsome hermetically sealed vintage-inspired embossed metal collector tin keeping 3 distinct foil-sealed chip pouches ultra-fresh and shatteringly crisp for months.',
    benefits: ['Aesthetic reusable tin presentation', 'Maximum crunch protection', '3 best-selling varieties inside'],
    nutrition: {
      calories: 145,
      potassium: '450 mg',
      fiber: '3.9 g',
      vitaminB6: '25% DV',
    },
    reviews: []
  },
  {
    id: 'chip-14',
    name: 'Mega Snacker 1kg Kolar Chips Resealable Bulk Pouch',
    tagline: 'Heavy-duty zip-lock multi-layer barrier foil bulk pouch of classic salted banana chips',
    category: 'Party Packs & Tins',
    price: 750,
    originalPrice: 900,
    rating: 4.9,
    reviewCount: 189,
    image: imgPkgRockSaltKolar,
    origin: 'Eco Bulk Packing Station',
    sweetnessIndex: 1,
    ripeness: 'Green / Firm',
    organic: true,
    description: 'Designed for true chip lovers, parties, and family snacking. Premium nitrogen-flushed multi-layer barrier pouch with heavy-duty zipper keeps 1kg of chips fresh and crisp to the last bite.',
    benefits: ['Maximum value per gram', 'Resealable heavy zipper lock', 'Moisture and UV barrier'],
    nutrition: {
      calories: 140,
      potassium: '460 mg',
      fiber: '3.8 g',
      vitaminB6: '25% DV',
    },
    reviews: []
  },

  // =========================================================================
  // 6. FRESH COOKING BANANAS (FARM DIRECT)
  // =========================================================================
  {
    id: 'chip-15',
    name: 'Raw Green Cooking Banana Bunch (For Homemade Chips)',
    tagline: 'Freshly harvested starchy green banana cluster ready for home chip slicing',
    category: 'Fresh Bananas',
    price: 150,
    originalPrice: 180,
    rating: 4.9,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    origin: 'Eco Organic Volcanic Plantations',
    sweetnessIndex: 1,
    ripeness: 'Green / Firm',
    organic: true,
    description: 'Premium firm unripe green bananas harvested for home culinary cooks who want to slice and fry their own signature kolar chips or tostones.',
    benefits: ['100% fresh from plantation', 'Highest resistant starch content', 'Perfect culinary texture'],
    nutrition: {
      calories: 100,
      potassium: '422 mg',
      fiber: '4.1 g',
      vitaminB6: '25% DV',
    },
    reviews: []
  }
];

export const CATEGORIES: readonly Category[] = [
  'All',
  'Kolar Chips',
  'Pineapple Chips',
  'Exotic Fruit Chips',
  'Root & Medley Chips',
  'Party Packs & Tins',
  'Fresh Bananas'
] as const;

export const RIPENESS_FILTERS = [
  'All Ripeness',
  'Green / Firm',
  'Perfect Yellow',
  'Sweet Spotted'
] as const;

export const DEFAULT_FILTER_CONFIG: FilterConfig = {
  categories: [
    'All',
    'Kolar Chips',
    'Pineapple Chips',
    'Exotic Fruit Chips',
    'Root & Medley Chips',
    'Party Packs & Tins',
    'Fresh Bananas'
  ],
  ripenessLabel: 'Ripeness:',
  ripenessFilters: [
    'All Ripeness',
    'Green / Firm',
    'Perfect Yellow',
    'Sweet Spotted'
  ]
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'BANANA JI',
  brandPrefix: 'BANANA',
  brandSuffix: 'JI',
  logoUrl: '',
  tagline: 'Boutique source for fresh cooking bananas, prebiotic resistant starch, and crispy packaged superfood snacks',
  description: 'Your premier boutique source for ethically harvested, firm unripened green bananas, resistant starch flour, and exotic highland fruit delicacies.',
  announcementText: '',
  showAnnouncement: false,
  contactPhone: '+1 (800) 555-BANANA',
  contactEmail: 'support@bananaji.com',
  contactAddress: 'Highland Estate, Organic Valley, CA',
  workingHours: '8:00 AM - 10:00 PM Daily',
  currencySymbol: '৳',
  deliveryFeeInsideDhaka: 60,
  deliveryFeeOutsideDhaka: 120,
  bkashNumber: '01712345678',
  nagadNumber: '01912345678',
  footerCopyright: '© 2026 Banana Ji Organic Emporium. All rights reserved.',
  socialLinks: {
    instagram: 'https://www.instagram.com',
    facebook: 'https://www.facebook.com',
    twitter: 'https://x.com',
    youtube: 'https://www.youtube.com'
  }
};
