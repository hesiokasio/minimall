'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';

const BentoGrid = () => {
  return (
    // حذف پس‌زمینه‌ی سفید و گوشه‌های گرد. حالا بخش کاملاً با بک‌گراند اصلی سایت ترکیب می‌شود
    <section className="w-full px-6 md:px-12 lg:px-20 py-24 relative z-20">
      
      {/* هدر دقیقاً مشابه طرح اصلی */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black uppercase leading-none">
            CURATED <br />
            <span className="text-black/30">EDITIONS</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-black/60 leading-relaxed font-light">
          Discover our meticulously selected editorial pieces. Interact with the canvas to explore hidden details and exclusive collections.
        </p>
      </div>

      {/* گرید نامتقارن هوشمند: ۳ ستون، با ارتفاع ردیف‌های ثابت */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[320px]">
        
        {/* ۱. کارت عمودی بلند (سمت چپ) - ۲ ردیف فضا می‌گیرد */}
        <motion.div 
          className="lg:col-span-1 lg:row-span-2 relative rounded-[2rem] overflow-hidden group"
          whileHover={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
            alt="Editorial Fashion" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
             <button className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] tracking-widest uppercase rounded-full flex items-center gap-2 hover:bg-white hover:text-black transition-colors">
               + Interactive Editorial
             </button>
          </div>
        </motion.div>

        {/* ۲. کارت محصول کوچک (بالا وسط) */}
        <motion.div 
          className="relative rounded-[2rem] overflow-hidden group bg-white p-5 flex flex-col shadow-sm"
          whileHover={{ y: -5 }}
        >
          <div className="flex-1 w-full relative rounded-2xl overflow-hidden bg-[#f4f3f0] mb-4 flex items-center justify-center p-4">
             <img src={PRODUCTS[0]?.image} alt={PRODUCTS[0]?.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="px-2">
            <p className="text-[9px] text-black/40 uppercase tracking-widest mb-1 font-semibold">New Arrival</p>
            <h3 className="font-semibold text-sm text-black">{PRODUCTS[0]?.name}</h3>
            <p className="text-black/60 text-xs mt-1">{PRODUCTS[0]?.price}</p>
          </div>
        </motion.div>

        {/* ۳. کارت محصول کوچک (بالا راست) */}
        <motion.div 
          className="relative rounded-[2rem] overflow-hidden group bg-white p-5 flex flex-col shadow-sm"
          whileHover={{ y: -5 }}
        >
          <div className="flex-1 w-full relative rounded-2xl overflow-hidden bg-[#f4f3f0] mb-4 flex items-center justify-center p-4">
             <img src={PRODUCTS[1]?.image} alt={PRODUCTS[1]?.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="px-2">
            <p className="text-[9px] text-black/40 uppercase tracking-widest mb-1 font-semibold">New Arrival</p>
            <h3 className="font-semibold text-sm text-black">{PRODUCTS[1]?.name}</h3>
            <p className="text-black/60 text-xs mt-1">{PRODUCTS[1]?.price}</p>
          </div>
        </motion.div>

        {/* ۴. بنر عریض تاریک (پایین راست) - ۲ ستون فضا می‌گیرد */}
        <motion.div 
          className="lg:col-span-2 relative rounded-[2rem] overflow-hidden group bg-[#111] p-10 flex flex-col justify-end"
          whileHover={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
           <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Autumn Symphony" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-40"
          />
          <div className="relative z-10">
            <span className="uppercase text-[10px] tracking-widest text-white/50 mb-3 block font-semibold">
              Limited Edition
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              AUTUMN <br/> SYMPHONY
            </h3>
            <button className="text-xs text-white uppercase tracking-widest flex items-center gap-2 hover:text-white/70 transition-colors border-b border-white/30 pb-1 w-fit font-medium">
              Explore Collection <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BentoGrid;