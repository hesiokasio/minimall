import { Mall, Product, Brand, MallInteriorData, Store } from '../types';

export const SPATIAL_MALLS: Mall[] = [
  { id: 1, title: 'Aura District', subtitle: 'Avant-Garde & High Fashion', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: 'The Monolith', subtitle: 'Minimalist Essentials', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop' },
  { id: 3, title: 'Lumina Space', subtitle: 'Future Wear & Tech', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2187&auto=format&fit=crop' },
  { id: 4, title: 'Echo Pavilion', subtitle: 'Sustainable Luxury', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' }
];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Obsidian Chronograph', price: '$1,200', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop' },
  { id: 2, name: 'Silk Cascade Scarf', price: '$350', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, name: 'Form Study Chair', price: '$680', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2069&auto=format&fit=crop' },
  { id: 4, name: 'Ceramic Vessel Set', price: '$140', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, name: 'Linen Lounge Pillow', price: '$85', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1974&auto=format&fit=crop' }
];

export const FEATURED_BRANDS: Brand[] = [
  { 
    id: 1, 
    name: 'Promer', 
    tagline: 'Industrial Grade Architecture & Materials', 
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    name: 'Lumina', 
    tagline: 'Minimalist Lighting Concepts', 
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5e8d?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    name: 'Aura', 
    tagline: 'Avant-Garde Apparel', 
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' 
  }
];


// گالری عکس‌های لباس برای محصولات (۸ عکس مینیمال و شیک)
const CLOTHING_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop', // T-shirt
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000&auto=format&fit=crop', // Denim Jacket
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2000&auto=format&fit=crop', // Minimal Dress
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop', // Fashion Look
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000&auto=format&fit=crop', // Menswear Suit
  'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=2000&auto=format&fit=crop', // Winter Coat
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2000&auto=format&fit=crop', // Leather Jacket
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2000&auto=format&fit=crop', // Silk Dress
];

// گالری عکس‌های کاور برای فروشگاه‌ها (۶ کاور جذاب)
const STORE_COVERS = [
  'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550614000-4b95d466f917?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop',
];

// تابع جادویی شماره ۱: تولید ۸ لباس برای هر فروشگاه
const generateClothingProducts = (storeId: string): Product[] => {
  return Array.from({ length: 8 }).map((_, index) => ({
    id: `prod-${storeId}-${index}`,
    name: `Editorial Piece ${String(index + 1).padStart(2, '0')}`,
    price: `$${Math.floor(Math.random() * 600) + 150}`, // قیمت تصادفی بین ۱۵۰ تا ۷۵۰ دلار
    image: CLOTHING_IMAGES[index],
  }));
};

// تابع جادویی شماره ۲: تولید ۶ فروشگاه برای هر طبقه
const generateStores = (floorPrefix: string, storeCount: number): Store[] => {
  const brandNames = ['Aura', 'Lumina', 'Maison', 'Kasej', 'Vanguard', 'Eclipse'];
  
  return Array.from({ length: storeCount }).map((_, index) => ({
    id: `store-${floorPrefix}-${index}`,
    name: brandNames[index % brandNames.length],
    tagline: 'Ready To Wear Collection',
    coverImage: STORE_COVERS[index % STORE_COVERS.length],
    products: generateClothingProducts(`store-${floorPrefix}-${index}`), // تخصیص ۸ لباس به این فروشگاه
  }));
};


// دیتای نهایی که به صفحه‌ی ما تزریق می‌شود
export const MALL_INTERIORS: MallInteriorData[] = [
  {
    mallId: 1,
    floors: [
      {
        id: 'L1',
        title: 'SARTORIAL DETAILS',
        // ساخت ۶ فروشگاه (هرکدام با ۸ لباس) با یک خط کد!
        stores: generateStores('L1', 6),
      },
      {
        id: 'L2',
        title: 'SPATIAL ARCHITECTURE',
        stores: [
          // فروشگاه اول را همان متریال‌های معماری نگه می‌داریم تا تنوع حفظ شود
          {
            id: 'store-promer-core',
            name: 'Promer',
            tagline: 'Industrial Grade Architecture & Materials',
            coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop',
            products: [
              { id: 'p4', name: 'Premium Tile Adhesive', price: '$45', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop' },
              { id: 'p5', name: 'Architectural Joint Filler', price: '$25', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop' },
              { id: 'p6', name: 'Form Study Chair', price: '$680', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2069&auto=format&fit=crop' }
            ]
          },
          // ۵ فروشگاه دیگر در این طبقه هم لباس خواهند بود
          ...generateStores('L2', 5),
        ]
      }
    ]
  }
];


// شبیه‌سازیِ یک API کال واقعی برای گرفتن اطلاعات پایه مال (کاور و اسم)
export const fetchMallInfo = async (id: string | number): Promise<Mall> => {
  return new Promise((resolve, reject) => {
    // شبیه‌سازی 800 میلی‌ثانیه تاخیر اینترنت
    setTimeout(() => {
      const mall = SPATIAL_MALLS.find((m) => String(m.id) === String(id));
      if (mall) {
        resolve(mall);
      } else {
        // بازگشتِ مال پیش‌فرض در صورت پیدا نشدن (برای جلوگیری از خطای سرور)
        resolve(SPATIAL_MALLS[0]); 
      }
    }, 800);
  });
};

// شبیه‌سازیِ یک API کال واقعی برای گرفتن دیتای طبقات و فروشگاه‌ها
export const fetchMallInterior = async (id: string | number): Promise<MallInteriorData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const interior = MALL_INTERIORS.find((m) => String(m.mallId) === String(id));
      if (interior) {
        resolve(interior);
      } else {
        resolve(MALL_INTERIORS[0]);
      }
    }, 800);
  });
};