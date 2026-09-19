import { DirectoryMall, Mall, Product, Brand, MallInteriorData, Store } from '../types';

// ============================================================================
// بخش اول: دیتاهای صفحه اصلی (HOME PAGE - DIRECTORY)
// ============================================================================

export const CITIES = ['ALL', 'Tehran', 'Dubai', 'Milan', 'Berlin', 'Tokyo'];
export const NEIGHBORHOODS = ['ALL', 'Zone 1', 'Sector B', 'Core', 'West Wing', 'District 9'];
export const CATEGORIES = ['ALL', 'INDUSTRIAL', 'FASHION', 'TECH', 'LIFESTYLE'];

export const MALL_DIRECTORY: DirectoryMall[] = [
  { id: '1', title: 'AURA DISTRICT', category: 'FASHION', city: 'Tehran', neighborhood: 'Zone 1', stores: 12, products: 450, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop' },
  { id: '2', title: 'THE MONOLITH', category: 'INDUSTRIAL', city: 'Dubai', neighborhood: 'Sector B', stores: 8, products: 1200, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop' },
  { id: '3', title: 'LUMINA SPACE', category: 'TECH', city: 'Milan', neighborhood: 'Core', stores: 24, products: 890, image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop' },
  { id: '4', title: 'ECHO PAVILION', category: 'LIFESTYLE', city: 'Berlin', neighborhood: 'West Wing', stores: 5, products: 210, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop' },
  { id: '5', title: 'VELVET ROOM', category: 'FASHION', city: 'Tehran', neighborhood: 'Zone 1', stores: 15, products: 340, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop' },
  { id: '6', title: 'NEXUS HUB', category: 'TECH', city: 'Dubai', neighborhood: 'Sector B', stores: 19, products: 560, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop' },
  { id: '7', title: 'ECLIPSE PLAZA', category: 'LIFESTYLE', city: 'Milan', neighborhood: 'Core', stores: 32, products: 4000, image: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=600&auto=format&fit=crop' },
  { id: '8', title: 'KASEJ ATELIER', category: 'FASHION', city: 'Berlin', neighborhood: 'West Wing', stores: 3, products: 85, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=600&auto=format&fit=crop' },
  { id: '9', title: 'CEMENTO CORE', category: 'INDUSTRIAL', city: 'Dubai', neighborhood: 'Sector B', stores: 7, products: 310, image: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=600&auto=format&fit=crop' },
  { id: '10', title: 'SILICON WING', category: 'TECH', city: 'Tehran', neighborhood: 'Zone 1', stores: 14, products: 920, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop' },
];

// ============================================================================
// بخش دوم: دیتاهای صفحات داخلی مال (INTERIOR PAGES)
// ============================================================================

export const SPATIAL_MALLS: Mall[] = [
  { id: 1, title: 'Aura District', subtitle: 'Avant-Garde & High Fashion', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'The Monolith', subtitle: 'Minimalist Essentials', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'Lumina Space', subtitle: 'Future Wear & Tech', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop' },
  { id: 4, title: 'Echo Pavilion', subtitle: 'Sustainable Luxury', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop' }
];

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Obsidian Chronograph', price: '$1,200', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop' },
  { id: '2', name: 'Silk Cascade Scarf', price: '$350', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop' },
  { id: '3', name: 'Form Study Chair', price: '$680', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop' },
  { id: '4', name: 'Ceramic Vessel Set', price: '$140', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop' },
  { id: '5', name: 'Linen Lounge Pillow', price: '$85', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop' }
];

export const FEATURED_BRANDS: Brand[] = [
  { id: 1, name: 'Promer', tagline: 'Industrial Grade Architecture & Materials', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Lumina', tagline: 'Minimalist Lighting Concepts', image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5e8d?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Aura', tagline: 'Avant-Garde Apparel', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop' }
];

// گالری عکس‌های لباس برای محصولات
const CLOTHING_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
];

// گالری عکس‌های کاور برای فروشگاه‌ها
const STORE_COVERS = [
  'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550614000-4b95d466f917?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop',
];

const generateClothingProducts = (storeId: string): Product[] => {
  return Array.from({ length: 8 }).map((_, index) => ({
    id: `prod-${storeId}-${index}`,
    name: `Editorial Piece ${String(index + 1).padStart(2, '0')}`,
    price: `$${Math.floor(Math.random() * 600) + 150}`,
    image: CLOTHING_IMAGES[index],
  }));
};

const generateStores = (floorPrefix: string, storeCount: number): Store[] => {
  const brandNames = ['Aura', 'Lumina', 'Maison', 'Kasej', 'Vanguard', 'Eclipse'];
  return Array.from({ length: storeCount }).map((_, index) => ({
    id: `store-${floorPrefix}-${index}`,
    name: brandNames[index % brandNames.length],
    tagline: 'Ready To Wear Collection',
    coverImage: STORE_COVERS[index % STORE_COVERS.length],
    products: generateClothingProducts(`store-${floorPrefix}-${index}`),
  }));
};

export const MALL_INTERIORS: MallInteriorData[] = [
  {
    mallId: 1,
    floors: [
      {
        id: 'L1',
        title: 'SARTORIAL DETAILS',
        stores: generateStores('L1', 6),
      },
      {
        id: 'L2',
        title: 'SPATIAL ARCHITECTURE',
        stores: [
          {
            id: 'store-promer-core',
            name: 'Promer',
            tagline: 'Industrial Grade Architecture & Materials',
            coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
            products: [
              { id: 'p4', name: 'Premium Tile Adhesive', price: '$45', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop' },
              { id: 'p5', name: 'Architectural Joint Filler', price: '$25', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&auto=format&fit=crop' },
              { id: 'p6', name: 'Form Study Chair', price: '$680', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop' }
            ]
          },
          ...generateStores('L2', 5),
        ]
      }
    ]
  }
];

// ============================================================================
// بخش سوم: شبیه‌سازی فراخوانی‌های API (API Calls Simulation)
// ============================================================================

export const fetchMallInfo = async (id: string | number): Promise<Mall> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mall = SPATIAL_MALLS.find((m) => String(m.id) === String(id));
      resolve(mall || SPATIAL_MALLS[0]);
    }, 800);
  });
};

export const fetchMallInterior = async (id: string | number): Promise<MallInteriorData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const interior = MALL_INTERIORS.find((m) => String(m.mallId) === String(id));
      resolve(interior || MALL_INTERIORS[0]);
    }, 800);
  });
};

// دیتای ردیف اول: ترندها
export const TRENDING_PRODUCTS: Product[] = [
  { id: 't1', name: 'Obsidian Chronograph', price: '$1,200', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', category: 'Watches' },
  { id: 't2', name: 'Silk Cascade Scarf', price: '$350', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600', category: 'Fashion' },
  { id: 't3', name: 'Form Study Chair', price: '$680', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=600', category: 'Furniture' },
  { id: 't4', name: 'Ceramic Vessel Set', price: '$140', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600', category: 'Home' },
  { id: 't5', name: 'Linen Lounge Set', price: '$285', image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=600', category: 'Fashion' },
];

// دیتای ردیف دوم: تازه‌ها
export const NEW_ARRIVALS: Product[] = [
  { id: 'n1', name: 'Minimalist Desk Lamp', price: '$180', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', category: 'Home' },
  { id: 'n2', name: 'Matte Black Headphones', price: '$450', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', category: 'Tech' },
  { id: 'n3', name: 'Leather Tote Bag', price: '$520', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600', category: 'Accessories' },
  { id: 'n4', name: 'Analog Wall Clock', price: '$95', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=600', category: 'Home' },
  { id: 'n5', name: 'Geometric Sunglasses', price: '$210', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600', category: 'Accessories' },
];

// دیتای ردیف سوم: پیشنهادهای خاص
export const CURATED_EDIT: Product[] = [
  { id: 'c1', name: 'Mechanical Keyboard', price: '$320', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600', category: 'Tech' },
  { id: 'c2', name: 'Concrete Planter', price: '$65', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600', category: 'Home' },
  { id: 'c3', name: 'Oversized Wool Coat', price: '$890', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=600', category: 'Fashion' },
  { id: 'c4', name: 'Acoustic Speaker', price: '$750', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600', category: 'Tech' },
  { id: 'c5', name: 'Silver Signet Ring', price: '$190', image: 'https://images.unsplash.com/photo-1605100804763-247f66129482?auto=format&fit=crop&q=80&w=600', category: 'Jewelry' },
];

// ==========================================
// دیتای کامل برای صفحه جزئیات محصول (PDP)
// ==========================================
export const DETAILED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Obsidian Chronograph',
    price: '$1,200',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    description: 'A minimalist timepiece crafted from brushed titanium and featuring a deep obsidian dial. Engineered for precision and designed for the modern aesthetic.',
    category: 'Watches',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 't1', 
    name: 'Obsidian Chronograph',
    price: '$1,200',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    description: 'Our signature trending timepiece. Perfect for any minimalist collection.',
    category: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

// یک تابع کمکی برای پیدا کردن محصول بر اساس ID
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // اول در دیتای کامل می‌گردد، اگر نبود در دیتای ترندینگ می‌گردد
      const product = DETAILED_PRODUCTS.find(p => String(p.id) === String(id)) 
                   || TRENDING_PRODUCTS.find(p => String(p.id) === String(id));
      resolve(product);
    }, 400); // شبیه‌سازی تاخیر اینترنت
  });
};