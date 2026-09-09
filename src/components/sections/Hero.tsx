'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion'; 
import { ChevronDown, Search, MapPin, Grid2X2, Map, Building2, ArrowRight } from 'lucide-react';

const CITIES = ['ALL', 'Tehran', 'Dubai', 'Milan', 'Berlin', 'Tokyo'];
const NEIGHBORHOODS = ['ALL', 'Zone 1', 'Sector B', 'Core', 'West Wing', 'District 9'];
const CATEGORIES = ['ALL', 'INDUSTRIAL', 'FASHION', 'TECH', 'LIFESTYLE'];

const MALL_DIRECTORY = [
  { id: 'm1', title: 'PROMER ARCHIVE', category: 'INDUSTRIAL', city: 'Tehran', neighborhood: 'Zone 1', stores: 12, products: 450, image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=400&auto=format&fit=crop' },
  { id: 'm2', title: 'AURA SANCTUARY', category: 'FASHION', city: 'Dubai', neighborhood: 'Sector B', stores: 8, products: 1200, image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=400&auto=format&fit=crop' },
  { id: 'm3', title: 'LUMINA VOID', category: 'TECH', city: 'Milan', neighborhood: 'Core', stores: 24, products: 890, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop' },
  { id: 'm4', title: 'STEEL & STONE', category: 'INDUSTRIAL', city: 'Berlin', neighborhood: 'West Wing', stores: 5, products: 210, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop' },
  { id: 'm5', title: 'VELVET ROOM', category: 'FASHION', city: 'Tehran', neighborhood: 'Zone 1', stores: 15, products: 340, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=400&auto=format&fit=crop' },
  { id: 'm6', title: 'NEXUS HUB', category: 'TECH', city: 'Dubai', neighborhood: 'Sector B', stores: 19, products: 560, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop' },
  { id: 'm7', title: 'ECLIPSE PLAZA', category: 'LIFESTYLE', city: 'Milan', neighborhood: 'Core', stores: 32, products: 4000, image: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=400&auto=format&fit=crop' },
  { id: 'm8', title: 'KASEJ ATELIER', category: 'FASHION', city: 'Berlin', neighborhood: 'West Wing', stores: 3, products: 85, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop' },
  { id: 'm9', title: 'CEMENTO CORE', category: 'INDUSTRIAL', city: 'Dubai', neighborhood: 'Sector B', stores: 7, products: 310, image: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=400&auto=format&fit=crop' },
  { id: 'm10', title: 'SILICON WING', category: 'TECH', city: 'Tehran', neighborhood: 'Zone 1', stores: 14, products: 920, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop' },
  { id: 'm11', title: 'NOVA STUDIOS', category: 'FASHION', city: 'Milan', neighborhood: 'Core', stores: 9, products: 450, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' },
  { id: 'm12', title: 'URBAN LOFT', category: 'LIFESTYLE', city: 'Berlin', neighborhood: 'West Wing', stores: 21, products: 1100, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=400&auto=format&fit=crop' },
  { id: 'm13', title: 'THE FOUNDRY', category: 'INDUSTRIAL', city: 'Milan', neighborhood: 'Core', stores: 6, products: 150, image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=400&auto=format&fit=crop' },
  { id: 'm14', title: 'WIRE & GLASS', category: 'TECH', city: 'Berlin', neighborhood: 'West Wing', stores: 11, products: 670, image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&auto=format&fit=crop' },
  { id: 'm15', title: 'SILK AVENUE', category: 'FASHION', city: 'Dubai', neighborhood: 'Sector B', stores: 28, products: 2300, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=400&auto=format&fit=crop' },
  { id: 'm16', title: 'NEO TOKYO', category: 'TECH', city: 'Tokyo', neighborhood: 'District 9', stores: 40, products: 5000, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400&auto=format&fit=crop' },
  { id: 'm17', title: 'ZENITH MARKET', category: 'LIFESTYLE', city: 'Tokyo', neighborhood: 'District 9', stores: 15, products: 800, image: 'https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?q=80&w=400&auto=format&fit=crop' },
  { id: 'm18', title: 'ONYX GALLERY', category: 'FASHION', city: 'Tehran', neighborhood: 'Zone 1', stores: 5, products: 200, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop' },
  { id: 'm19', title: 'BRICK & MORTAR', category: 'INDUSTRIAL', city: 'Berlin', neighborhood: 'West Wing', stores: 8, products: 430, image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&auto=format&fit=crop' },
  { id: 'm20', title: 'CRYSTAL DOME', category: 'LIFESTYLE', city: 'Dubai', neighborhood: 'Sector B', stores: 12, products: 950, image: 'https://images.unsplash.com/photo-1512453979436-d87452d3a04e?q=80&w=400&auto=format&fit=crop' },
];

// ==========================================
// 🔴 انیمیشن‌های نرم، آهسته و ابریشمی (Silky Smooth)
// ==========================================
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // سرعت موج کمی آهسته‌تر شد تا ورود کارت‌ها قابل لمس‌تر باشد
      delayChildren: 0.1,    
    }
  }
};

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.85, 
    y: 30, // مسیر حرکت کمی بیشتر شد تا ورودش نرم‌تر حس شود
    filter: "blur(8px)" 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 100, // کاهش سفتی فنر برای حرکت آرام‌تر
      damping: 20,    // کنترل لرزش
      mass: 0.8       // افزایش وزن برای ایجاد حس شناوری و نرمی
    }
  }
};

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🔴 دیفالت روی تهران تنظیم شد
  const [activeCity, setActiveCity] = useState('Tehran');
  const [activeNeighborhood, setActiveNeighborhood] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  const filteredMalls = useMemo(() => {
    return MALL_DIRECTORY.filter(mall => {
      const matchSearch = mall.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mall.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = activeCity === 'ALL' || mall.city === activeCity;
      const matchNeighborhood = activeNeighborhood === 'ALL' || mall.neighborhood === activeNeighborhood;
      const matchCategory = activeCategory === 'ALL' || mall.category === activeCategory;
      return matchSearch && matchCity && matchNeighborhood && matchCategory;
    });
  }, [searchQuery, activeCity, activeNeighborhood, activeCategory]);

  return (
    // 🔴 حذف قفل ارتفاع (h-[100dvh]) تا صفحه به صورت طبیعی قابلیت اسکرول داشته باشد
    <section className="w-full min-h-screen bg-[#fafafa] flex flex-col items-center pt-[12vh] px-6 pb-24">
      
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* ========================================================= */}
        {/* نوار کنترل اصلی (Combo Bar) - چسبان شده (Sticky) در بالای صفحه */}
        {/* ========================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sticky top-6 z-50 w-full bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-full shadow-[0_4px_30px_rgb(0,0,0,0.06)] border border-black/[0.04] p-1.5 flex flex-col md:flex-row items-center gap-1 shrink-0"
        >
          {/* 1. Search Box */}
          <div className="relative flex-1 w-full min-w-[200px] group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors" />
            <input 
              suppressHydrationWarning
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..." 
              className="w-full bg-transparent hover:bg-black/[0.02] focus:bg-black/[0.02] text-xs font-medium rounded-full py-3.5 pl-10 pr-4 outline-none transition-all placeholder:text-black/30 text-black"
            />
          </div>

          <div className="hidden md:block w-[1px] h-6 bg-black/5" />

          {/* 2. City Select */}
          <div className="relative w-full md:w-auto min-w-[130px]">
            <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <select 
              suppressHydrationWarning
              value={activeCity}
              onChange={(e) => setActiveCity(e.target.value)}
              className="w-full appearance-none bg-transparent hover:bg-black/[0.02] cursor-pointer text-xs font-bold text-black py-3.5 pl-10 pr-8 rounded-full outline-none transition-colors border-transparent focus:ring-0"
            >
              {CITIES.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Cities' : c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
          </div>

          <div className="hidden md:block w-[1px] h-6 bg-black/5" />

          {/* 3. Neighborhood Select */}
          <div className="relative w-full md:w-auto min-w-[130px]">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <select 
              suppressHydrationWarning
              value={activeNeighborhood}
              onChange={(e) => setActiveNeighborhood(e.target.value)}
              className="w-full appearance-none bg-transparent hover:bg-black/[0.02] cursor-pointer text-xs font-bold text-black py-3.5 pl-10 pr-8 rounded-full outline-none transition-colors border-transparent focus:ring-0"
            >
              {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n === 'ALL' ? 'All Zones' : n}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
          </div>

          <div className="hidden md:block w-[1px] h-6 bg-black/5" />

          {/* 4. Category Select */}
          <div className="relative w-full md:w-auto min-w-[130px]">
            <Grid2X2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <select 
              suppressHydrationWarning
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full appearance-none bg-transparent hover:bg-black/[0.02] cursor-pointer text-xs font-bold text-black py-3.5 pl-10 pr-8 rounded-full outline-none transition-colors border-transparent focus:ring-0"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'ALL' ? 'Categories' : cat}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
          </div>
        </motion.div>

        {/* هدر بخش گرید */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full flex items-end justify-between mt-4 px-2"
        >
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">
            Directory
          </h2>
          <span className="text-[9px] font-mono tracking-widest text-black/30 uppercase">
            {filteredMalls.length} Results
          </span>
        </motion.div>

        {/* ========================================================= */}
        {/* THE APP ICON GRID (اسکرول طبیعی صفحه با انیمیشن فوق نرم) */}
        {/* ========================================================= */}
        <div className="w-full mt-2">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredMalls.map((mall) => (
                <motion.div
                  key={mall.id}
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)", transition: { duration: 0.2 } }}
                  className="group flex flex-col items-center text-center cursor-pointer"
                >
                  {/* آیکون مربعی */}
                  <div className="relative w-[70px] h-[70px] md:w-[86px] md:h-[86px] rounded-[1.25rem] md:rounded-[1.5rem] bg-gray-100 shadow-sm border border-black/5 group-hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.15)] group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden mb-3">
                    <img 
                      src={mall.image} 
                      alt={mall.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* اطلاعات متنی زیر آیکون */}
                  <div className="flex flex-col items-center w-full px-1">
                    <h3 className="text-[10px] md:text-xs font-black text-black uppercase leading-tight truncate w-full group-hover:text-blue-600 transition-colors">
                      {mall.title}
                    </h3>
                    
                    {/* آمار */}
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-[8px] md:text-[9px] font-mono text-black/40 uppercase tracking-widest">
                      <span>{mall.stores} STS</span>
                      <span className="w-[3px] h-[3px] rounded-full bg-black/20" />
                      <span>{mall.products} ITM</span>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>

            {/* حالت خالی */}
            {filteredMalls.length === 0 && (
              <div className="col-span-full pt-12 flex flex-col items-center justify-center text-black/30">
                <Search size={32} className="mb-3 opacity-20" />
                <p className="text-xs font-mono tracking-widest uppercase">No destinations found for Tehran.</p>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}