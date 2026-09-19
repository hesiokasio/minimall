'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';

// 🔴 فراخوانی کانتینر برای تراز شدن با کل پروژه
import Container from '../layout/Container';

// ==========================================
// انیمیشن‌های نرمِ ورود با اسکرول (Scroll Reveal)
// ==========================================
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // موج نرم بین ظاهر شدن کارت‌ها
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.95,
    filter: "blur(10px)" 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 20,
      mass: 1
    }
  }
};

const BentoGrid = () => {
  return (
    // بخش اصلی بدون پدینگ‌های اضافه
    <section className="w-full py-16 md:py-24 relative z-20 overflow-hidden">
      
      {/* 🔴 استفاده از Container برای هم‌ترازیِ بی‌نقص */}
      <Container>
        
        {/* این دیوِ انیمیشن، تمام محتوای داخلش را مدیریت می‌کند */}
        <motion.div
          initial="hidden"
          // انیمیشن فقط وقتی اجرا می‌شود که کاربر به این بخش اسکرول کند
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }} // ۱۰۰ پیکسل قبل از رسیدن به ویوپورت شروع می‌شود
          variants={containerVariants}
          className="flex flex-col gap-8 md:gap-12"
        >
          
          {/* هدر */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-black uppercase leading-none">
                CURATED <br />
                <span className="text-black/30">EDITIONS</span>
              </h2>
            </div>
            <p className="max-w-sm text-xs md:text-sm text-black/60 leading-relaxed font-medium">
              Discover our meticulously selected editorial pieces. Interact with the canvas to explore hidden details and exclusive collections.
            </p>
          </motion.div>

          {/* گرید نامتقارن */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]">
            
            {/* ۱. کارت عمودی بلند (سمت چپ) */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="lg:col-span-1 lg:row-span-2 relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
                alt="Editorial Fashion" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                 <button suppressHydrationWarning className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white...">
  + Interactive Editorial
</button>
              </div>
            </motion.div>

            {/* ۲. کارت محصول کوچک (بالا وسط) */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-white border border-black/[0.04] p-5 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer"
            >
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden bg-[#f4f3f0] mb-4 flex items-center justify-center p-4">
                 <img src={PRODUCTS[0]?.image} alt={PRODUCTS[0]?.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="px-2">
                <p className="text-[8px] md:text-[9px] text-black/40 uppercase tracking-widest mb-1 font-bold">New Arrival</p>
                <h3 className="font-bold text-xs md:text-sm text-black truncate">{PRODUCTS[0]?.name}</h3>
                <p className="text-black/60 font-mono text-[10px] md:text-xs mt-1">{PRODUCTS[0]?.price}</p>
              </div>
            </motion.div>

            {/* ۳. کارت محصول کوچک (بالا راست) */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-white border border-black/[0.04] p-5 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer"
            >
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden bg-[#f4f3f0] mb-4 flex items-center justify-center p-4">
                 <img src={PRODUCTS[1]?.image} alt={PRODUCTS[1]?.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="px-2">
                <p className="text-[8px] md:text-[9px] text-black/40 uppercase tracking-widest mb-1 font-bold">New Arrival</p>
                <h3 className="font-bold text-xs md:text-sm text-black truncate">{PRODUCTS[1]?.name}</h3>
                <p className="text-black/60 font-mono text-[10px] md:text-xs mt-1">{PRODUCTS[1]?.price}</p>
              </div>
            </motion.div>

            {/* ۴. بنر عریض تاریک (پایین راست) */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="lg:col-span-2 relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-[#111] p-8 md:p-10 flex flex-col justify-end cursor-pointer"
            >
               <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
                alt="Autumn Symphony" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
              
              <div className="relative z-10">
                <span className="uppercase text-[9px] md:text-[10px] tracking-widest text-white/60 mb-2 block font-bold">
                  Limited Edition
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                  AUTUMN <br/> SYMPHONY
                </h3>
               <button suppressHydrationWarning className="text-[10px] md:text-xs text-white uppercase tracking-widest flex items-center gap-2 hover:text-white/70 transition-colors border-b border-white/30 pb-1.5 w-fit font-bold">
                 Explore Collection <ArrowRight size={14} />
               </button>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default BentoGrid;