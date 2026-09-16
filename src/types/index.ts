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
  id: string;
  name: string;
  price: string;
  image: string;          // عکس اصلی برای صفحه اول (همان قبلی)
  images?: string[];      // 🔴 جدید: آرایه عکس‌ها برای گالری صفحه محصول
  description?: string;   // 🔴 جدید: توضیحات محصول
  category?: string;      // 🔴 جدید: دسته‌بندی
  isNew?: boolean;
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