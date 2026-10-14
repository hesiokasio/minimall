'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Container from '../layout/Container';
import { createClient } from '../../utils/supabase/client'; // 🔴 آدرس کلاینت سوپابیس شما

// دیگر نیازی به پاس دادن دیتای فیک از بیرون نداریم
interface DiscoveryRowProps {
  title?: string;
  sectionId?: string;
}

const DiscoveryRow = ({ title = "محصولات جدید (Fresh Drops)" }: DiscoveryRowProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);
  
  // 🔴 استیت‌های جدید برای اتصال به سرور
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // 🔴 دریافت محصولات واقعی از دیتابیس
  useEffect(() => {
    async function fetchLatestProducts() {
      // فعلاً ۱۰ محصول آخر را از دیتابیس می‌گیریم
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (data) setProducts(data);
      setIsLoading(false);
    }
    fetchLatestProducts();
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, [products]);

  // نمایش حالت لودینگ در زمان دریافت دیتا
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <Loader2 className="animate-spin text-gray-300" size={32} />
      </div>
    );
  }

  // اگر محصولی در دیتابیس نبود، این بخش کلاً رندر نمی‌شود
  if (products.length === 0) return null; 

  return (
    <section className="w-full py-6 md:py-8 relative z-20">
      <Container>
        
        <div className="mb-4">
          <h2 className="text-[22px] md:text-[24px] font-semibold tracking-tight text-[#222222] flex items-center gap-2 group cursor-pointer w-fit">
            {title}
            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h2>
        </div>

        <div ref={carouselRef} className="w-full overflow-hidden" dir="ltr">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -dragConstraints }}
            dragElastic={0.15}
            className="flex gap-4 pb-4 cursor-grab active:cursor-grabbing w-fit"
          >
            {/* 🔴 رندر کردن محصولات واقعی دیتابیس */}
            {products.map((product) => (
              <Link 
                href={`/product/${product.id}`} 
                key={product.id}
                className="shrink-0 w-[160px] md:w-[170px] block cursor-pointer group"
              >
                <motion.div className="flex flex-col h-full">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#e9e9e5] mb-2 isolate">
                    <img 
                      // 🔴 اتصال به عکس واقعی، و یک عکس پیش‌فرض در صورت نداشتن عکس
                      src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500'} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                      draggable={false}
                    />
                    <button 
                      suppressHydrationWarning
                      onClick={(e) => {
                        e.preventDefault(); 
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:scale-110 active:scale-95 transition-all z-10 pointer-events-auto drop-shadow-md"
                    >
                      <Heart size={18} strokeWidth={2} />
                    </button>
                  </div>
                  
                  <div className="flex flex-col px-0.5 pointer-events-none gap-[2px] text-right" dir="rtl">
                    <div className="flex justify-between items-start flex-row-reverse">
                      <span className="flex items-center gap-1 text-[13px] font-normal text-[#222222] shrink-0">
                        ★ 5.0
                      </span>
                      <h3 className="font-semibold text-[15px] text-[#222222] truncate pl-2 leading-tight">
                        {product.name} {/* 🔴 نام واقعی محصول */}
                      </h3>
                    </div>
                    <p className="text-[#717171] text-[14px] truncate leading-tight">پرومر</p>
                    <div className="mt-[2px] flex justify-end">
                      <span className="font-semibold text-[14px] text-[#222222]">
                        {/* 🔴 قیمت واقعی با فرمت جداکننده هزارگان (تومان) */}
                        {Number(product.price).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}

            <motion.div className="shrink-0 w-[160px] md:w-[170px] flex flex-col items-center justify-start group cursor-pointer">
              <div className="w-full aspect-square rounded-xl bg-white border border-black/5 flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <ChevronRight size={20} />
                </div>
                <span className="font-semibold text-[15px] text-[#222222] underline-offset-4 group-hover:underline">مشاهده همه</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
        
      </Container>
    </section>
  );
};

export default DiscoveryRow;