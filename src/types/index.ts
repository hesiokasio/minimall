// src/types/index.ts

// ==========================================
// ۱. تایپ‌های مربوط به صفحه اصلی (هیرو و دایرکتوری)
// ==========================================
export interface DirectoryMall {
  id: string;
  title: string;
  category: string;
  city: string;
  neighborhood: string;
  stores: number;
  products: number;
  image: string;
}

// ==========================================
// ۲. تایپ‌های مربوط به صفحات داخلی (مال‌ها، طبقات، محصولات)
// ==========================================

export interface Mall {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
}

export interface HotspotData {
  x: string;
  y: string;
  title: string;
  price: string;
}

export interface Product {
  id: string | number;
  name: string;
  price: string | number;
  image: string;
  // هات‌اسپات به صورت آپشنال (?) تعریف شد تا اگر محصولی هات‌اسپات نداشت خطا نگیریم
  hotspots?: HotspotData[]; 
}

export interface Brand {
  id: string | number;
  name: string;
  tagline: string;
  image: string;
}

export interface Store {
  id: string | number;
  name: string;
  tagline: string;
  coverImage: string;
  products: Product[];
}

export interface Floor {
  id: string;
  level?: number;    // شماره طبقه (به صورت آپشنال اضافه شد تا دیتای موک قبلی ارور ندهد)
  title: string;     // نام طبقه (مثلاً "Men's Collection")
  stores: Store[];   // فروشگاه‌های داخل این طبقه
}

export interface MallInteriorData {
  mallId: string | number;
  floors: Floor[];
}