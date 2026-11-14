'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Image as ImageIcon, Store as StoreIcon } from 'lucide-react';
import { Store, Product } from '../../types';

interface StoreRowProps {
  store: Store;
}

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="shrink-0 w-[33vw] sm:w-[155px] md:w-[170px] flex flex-col group select-none cursor-pointer"
    >
      {/* قاب عکس با نسبت مربع فشرده */}
      <div className="w-full aspect-square relative rounded-xl md:rounded-2xl overflow-hidden bg-[#EAE8E3] border border-black/[0.04] transition-all duration-500 ease-out group-hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.08)]">
        
        {/* استفاده از تگ img استاندارد برای دور زدن محدودیت امنیتی Next.js */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none will-change-transform transform-gpu"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#EAE8E3] opacity-50 group-hover:opacity-80 transition-opacity duration-500">
            <ImageIcon size={28} strokeWidth={1.5} className="text-black/20" />
          </div>
        )}

        {/* دکمه اکشن سریع */}
        <div className="absolute bottom-2 right-2 z-20">
          <motion.button
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.85,
            }}
            transition={{ duration: 0.2 }}
            title="Quick Add"
            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-black/80 transition-colors pointer-events-auto"
          >
            <Plus size={12} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* اطلاعات فشرده محصول بدون تخفیف‌های فیک */}
      <div className="mt-2 px-0.5 flex flex-col gap-0.5">
        <h4 className="text-black/90 text-[10px] md:text-[11px] font-medium tracking-tight truncate group-hover:text-black transition-colors">
          {product.name}
        </h4>

        <div className="flex items-baseline gap-1.5">
          <span className="text-black/85 font-semibold text-[11px] md:text-[12px] leading-none">
            {product.price} تومان
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function StoreRow({ store }: StoreRowProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, [store]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full py-3.5 pl-4 md:py-4 md:pl-12 lg:pl-20 border-b border-black/[0.05] relative z-10"
    >
      {/* هدر فشرده و شیک فروشگاه */}
      <div className="mb-3 pr-4 md:pr-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          
          {/* شرط اصلی: آیا فروشگاه لوگو دارد؟ */}
          {store.logo ? (
            /* 🟢 حالت اول: لوگو دارد -> فقط لوگو نمایش داده می‌شود */
            <img 
              src={store.logo} 
              alt={store.name} 
              className="h-7 md:h-9 w-auto object-contain mix-blend-multiply shrink-0"
              draggable={false}
            />
          ) : (
            /* 🟠 حالت دوم: لوگو ندارد -> آیکون دیفالت + اسم + تگ‌لاین */
            <>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-black/5 flex items-center justify-center shrink-0">
                <StoreIcon className="w-4 h-4 text-black/40" />
              </div>
              
              <div className="flex flex-col justify-center">
                <h3 className="text-base md:text-xl font-bold uppercase tracking-tighter text-black leading-none mb-1.5">
                  {store.name}
                </h3>
                <p className="text-black/45 text-[7.5px] md:text-[8.5px] tracking-[0.2em] uppercase leading-none">
                  {store.tagline || 'Verified Store'}
                </p>
              </div>
            </>
          )}

        </div>
        
        <div className="hidden md:flex items-center gap-1.5 text-[9px] text-black/40 uppercase tracking-[0.18em]">
          <span>View All</span> <ArrowRight size={11} />
        </div>
      </div>

      {/* اسکرولر افقی */}
      <motion.div
        ref={carouselRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing pr-4 md:pr-20"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -dragConstraints }}
          dragElastic={0.12}
          className="flex gap-3 sm:gap-3.5 md:gap-4 pb-2 items-start"
        >
          {/* ۱. کاور ورودی برند */}
          <div className="shrink-0 w-[38vw] sm:w-[180px] md:w-[200px] aspect-square relative rounded-xl md:rounded-2xl overflow-hidden group isolate bg-black shadow-[0_8px_20px_-8px_rgba(0,0,0,0.18)] flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
            {/* چک می‌کنیم آیا عکس کاور وجود دارد یا نه */}
            {store.coverImage ? (
              <>
                {/* 🔴 اینجا هم از img استفاده شد تا ارور Next.js ندهد */}
                <img
                  src={store.coverImage}
                  alt={store.name}
                  className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105 pointer-events-none will-change-transform transform-gpu"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              </>
            ) : (
              // اگر عکس نداشت، این آیکون شیک نشان داده می‌شود
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                <StoreIcon size={32} strokeWidth={1} className="text-white mb-2" />
                <span className="text-[10px] text-white/70 font-mono uppercase tracking-widest">{store.name}</span>
              </div>
            )}

            <div className="absolute inset-0 p-3 md:p-3.5 flex flex-col justify-end pointer-events-none z-10">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-white/60 mb-1 font-medium">
                Showcase
              </span>
              <button className="px-3 py-1.5 bg-white text-black text-[8px] md:text-[9px] tracking-widest uppercase rounded-full font-semibold flex items-center justify-center gap-1.5 transition-all hover:bg-white/90 pointer-events-auto w-fit shadow-sm">
                Enter
              </button>
            </div>
          </div>

          {/* ۲. کارت‌های محصولات */}
          {store.products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}