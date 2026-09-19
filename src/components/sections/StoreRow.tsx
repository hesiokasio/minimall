'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import Image from 'next/image'; // 🔴 اضافه شد
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

  // محاسبه سیستم تخفیف
  const basePrice =
    typeof product.price === 'number'
      ? product.price
      : parseInt(product.price.replace('$', ''), 10);
  const isDiscounted = index === 1 || index === 4;
  const originalPriceNum = isDiscounted ? Math.floor(basePrice * 1.35) : basePrice;
  const originalPrice = isDiscounted ? `$${originalPriceNum}` : null;
  const discountPercent = isDiscounted
    ? Math.round(((originalPriceNum - basePrice) / originalPriceNum) * 100)
    : 0;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="shrink-0 w-[33vw] sm:w-[155px] md:w-[170px] flex flex-col group select-none cursor-pointer"
    >
      {/* قاب عکس با نسبت مربع فشرده و ارتفاع کنترل‌شده */}
      <div className="w-full aspect-square relative rounded-xl md:rounded-2xl overflow-hidden bg-[#EAE8E3] border border-black/[0.04] transition-all duration-500 ease-out group-hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.08)]">
        
        {/* لیبل اصالت / NEW */}
        {index === 0 && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-black/5 shadow-sm">
            <span className="w-1 h-1 rounded-full bg-[#c73b3b]" />
            <span className="text-[7px] font-semibold uppercase tracking-widest text-black/80">
              New
            </span>
          </div>
        )}

        {/* بج تخفیف */}
        {isDiscounted && (
          <div className="absolute top-2 right-2 z-20 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md bg-[#c73b3b] text-white text-[9px] md:text-[11px] font-black tracking-wider shadow-md leading-none">
            -{discountPercent}%
          </div>
        )}

        {/* 🔴 عکس محصول (تبدیل به Image هوشمند + انتقال انیمیشن به CSS) */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 33vw, 170px"
          className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none will-change-transform transform-gpu"
          draggable={false}
        />

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

      {/* اطلاعات فشرده محصول در حداقل ارتفاع */}
      <div className="mt-2 px-0.5 flex flex-col gap-0.5">
        <h4 className="text-black/90 text-[10px] md:text-[11px] font-medium tracking-tight truncate group-hover:text-black transition-colors">
          {product.name}
        </h4>

        <div className="flex items-baseline gap-1.5">
          {isDiscounted ? (
            <>
              <span className="text-[#c73b3b] font-bold text-[11px] md:text-[12px] leading-none">
                {product.price}
              </span>
              <span className="text-black/35 line-through text-[9px] md:text-[10px] font-normal leading-none">
                {originalPrice}
              </span>
            </>
          ) : (
            <span className="text-black/85 font-semibold text-[11px] md:text-[12px] leading-none">
              {product.price}
            </span>
          )}
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
      <div className="mb-2.5 pr-4 md:pr-20 flex justify-between items-end">
        <div>
          <h3 className="text-base md:text-xl font-bold uppercase tracking-tighter text-black leading-none">
            {store.name}
          </h3>
          <p className="text-black/45 text-[7.5px] md:text-[8.5px] tracking-[0.2em] uppercase mt-0.5">
            {store.tagline}
          </p>
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
          {/* ۱. کاور ورودی برند (تراز دقیق با ارتفاع کارت‌ها) */}
          <div className="shrink-0 w-[38vw] sm:w-[180px] md:w-[200px] aspect-square relative rounded-xl md:rounded-2xl overflow-hidden group isolate bg-black shadow-[0_8px_20px_-8px_rgba(0,0,0,0.18)]">
            {/* 🔴 تگ Image جایگزین شد */}
            <Image
              src={store.coverImage}
              alt={store.name}
              fill
              sizes="(max-width: 768px) 38vw, 200px"
              className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105 pointer-events-none will-change-transform transform-gpu"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute inset-0 p-3 md:p-3.5 flex flex-col justify-end pointer-events-none">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-white/60 mb-1 font-medium">
                Showcase
              </span>
              <button className="px-3 py-1.5 bg-white text-black text-[8px] md:text-[9px] tracking-widest uppercase rounded-full font-semibold flex items-center justify-center gap-1.5 transition-all hover:bg-white/90 pointer-events-auto w-fit shadow-sm">
                Enter
              </button>
            </div>
          </div>

          {/* ۲. کارت‌های محصولات با ارتفاع فشرده */}
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