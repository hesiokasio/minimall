'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import Container from '../layout/Container'; // اطمینان از استفاده فایل کانتینر پروژه

interface DiscoveryRowProps {
  title: string;
  products: Product[];
}

const DiscoveryRow = ({ title, products }: DiscoveryRowProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);
  const displayProducts = products.slice(0, 10);

  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, [products]);

  return (
    <section className="w-full py-6 md:py-8 relative z-20">
      {/* 🔴 کل محتوا درون کانتینرِ ثابتِ پروژه قرار گرفت */}
      <Container>
        
        {/* هدر */}
        <div className="mb-4">
          <h2 className="text-[22px] md:text-[24px] font-semibold tracking-tight text-[#222222] flex items-center gap-2 group cursor-pointer w-fit">
            {title}
            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h2>
        </div>

        {/* ناحیه اسکرول دقیقاً در عرض کانتینر */}
        <div ref={carouselRef} className="w-full overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -dragConstraints }}
            dragElastic={0.15}
            className="flex gap-4 pb-4 cursor-grab active:cursor-grabbing w-fit"
          >
            {/* کارت‌های محصول با ابعاد دقیق Airbnb */}
            {displayProducts.map((product) => (
              <motion.div key={product.id} className="shrink-0 w-[160px] md:w-[170px] flex flex-col group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#e9e9e5] mb-2 isolate">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    draggable={false}
                  />
                  <button 
  suppressHydrationWarning 
  className="absolute top-2 right-2 p-1.5 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:scale-110 active:scale-95 transition-all z-10 pointer-events-auto drop-shadow-md"
>
  <Heart size={18} strokeWidth={2} />
</button>
                </div>
                <div className="flex flex-col px-0.5 pointer-events-none gap-[2px]">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[15px] text-[#222222] truncate pr-2 leading-tight">
                      {product.name}
                    </h3>
                    <span className="flex items-center gap-1 text-[13px] font-normal text-[#222222] shrink-0">
                      ★ 4.9
                    </span>
                  </div>
                  <p className="text-[#717171] text-[14px] truncate leading-tight">Explore Collection</p>
                  <div className="mt-[2px]">
                    <span className="font-semibold text-[14px] text-[#222222]">{product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* کارت See all */}
            <motion.div className="shrink-0 w-[160px] md:w-[170px] flex flex-col items-center justify-start group cursor-pointer">
              <div className="w-full aspect-square rounded-xl bg-white border border-black/5 flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <ChevronRight size={20} />
                </div>
                <span className="font-semibold text-[15px] text-[#222222] underline-offset-4 group-hover:underline">See all</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
        
      </Container>
    </section>
  );
};

export default DiscoveryRow;