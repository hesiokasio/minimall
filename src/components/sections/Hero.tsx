'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion'; 
import { ChevronDown, Search, MapPin, Grid2X2, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // 🔴 ایمپورت Image اضافه شد

import Container from '../layout/Container';
import { CITIES, NEIGHBORHOODS, CATEGORIES, MALL_DIRECTORY } from '../../data/mockData';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, 
      delayChildren: 0.1,    
    }
  }
};

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.85, 
    y: 30 
    // 🔴 بلورهای سنگین حذف شدند
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20,    
      mass: 0.8       
    }
  }
};

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
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
    <section className="w-full min-h-screen flex flex-col items-center pt-[8vh] pb-24">
      <Container className="flex flex-col gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }} // 🔴 بلور حذف شد
          animate={{ opacity: 1, y: 0 }} // 🔴 بلور حذف شد
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sticky top-6 z-50 w-full bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-full shadow-[0_4px_30px_rgb(0,0,0,0.06)] border border-black/[0.04] p-1.5 flex flex-col md:flex-row items-center gap-1 shrink-0"
        >
          {/* 1. Search Box */}
          <div className="relative flex-1 w-full min-w-[200px] group">
            <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors" />
            <input 
              suppressHydrationWarning
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..." 
              className="w-full bg-transparent hover:bg-black/[0.02] focus:bg-black/[0.02] text-sm font-medium rounded-full py-4 pl-14 pr-6 outline-none transition-all placeholder:text-black/30 text-black"
            />
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-black/5" />

          {/* 2. City Select */}
          <div className="relative w-full md:w-auto min-w-[160px]">
            <Building2 size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/40" />
            <select 
              suppressHydrationWarning
              value={activeCity}
              onChange={(e) => setActiveCity(e.target.value)}
              className="w-full appearance-none bg-transparent hover:bg-black/[0.02] cursor-pointer text-sm font-bold text-black py-4 pl-14 pr-10 rounded-full outline-none transition-colors border-transparent focus:ring-0"
            >
              {CITIES.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Cities' : c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-black/5" />

          {/* 3. Neighborhood Select */}
          <div className="relative w-full md:w-auto min-w-[160px]">
            <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/40" />
            <select 
              suppressHydrationWarning
              value={activeNeighborhood}
              onChange={(e) => setActiveNeighborhood(e.target.value)}
              className="w-full appearance-none bg-transparent hover:bg-black/[0.02] cursor-pointer text-sm font-bold text-black py-4 pl-14 pr-10 rounded-full outline-none transition-colors border-transparent focus:ring-0"
            >
              {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n === 'ALL' ? 'All Zones' : n}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-black/5" />

          {/* 4. Category Select */}
          <div className="relative w-full md:w-auto min-w-[160px]">
            <Grid2X2 size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/40" />
            <select 
              suppressHydrationWarning
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full appearance-none bg-transparent hover:bg-black/[0.02] cursor-pointer text-sm font-bold text-black py-4 pl-14 pr-10 rounded-full outline-none transition-colors border-transparent focus:ring-0"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'ALL' ? 'Categories' : cat}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full flex items-end justify-between mt-4 px-2"
        >
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-black">
            Directory
          </h2>
          <span className="text-[10px] md:text-xs font-mono tracking-widest text-black/40 uppercase">
            {filteredMalls.length} Results
          </span>
        </motion.div>

        <div className="w-full mt-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredMalls.map((mall) => (
                <motion.div
                  key={mall.id}
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="group flex flex-col items-center text-center"
                >
                  {/* 🔴 تگ Link اینجا اضافه شد */}
                  <Link href={`/mall/${mall.id}`} className="w-full flex flex-col items-center cursor-pointer">
                    
                    <div className="relative w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-[1.25rem] md:rounded-[1.75rem] bg-gray-100 shadow-sm border border-black/5 group-hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] group-hover:-translate-y-2 transition-all duration-400 overflow-hidden mb-3">
                      {/* 🔴 تگ Image جایگزین شد */}
                      <Image 
                        src={mall.image} 
                        alt={mall.title} 
                        fill
                        sizes="100px" 
                        className="object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform transform-gpu" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    <div className="flex flex-col items-center w-full px-1">
                      <h3 className="text-[10px] md:text-xs font-black text-black uppercase leading-tight truncate w-full group-hover:text-blue-600 transition-colors">
                        {mall.title}
                      </h3>
                      
                      <div className="mt-1 flex items-center justify-center gap-1.5 text-[8px] md:text-[9px] font-mono text-black/40 uppercase tracking-widest">
                        <span>{mall.stores} STS</span>
                        <span className="w-[3px] h-[3px] rounded-full bg-black/20" />
                        <span>{mall.products} ITM</span>
                      </div>
                    </div>

                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredMalls.length === 0 && (
              <div className="col-span-full pt-20 flex flex-col items-center justify-center text-black/30">
                <Search size={40} className="mb-4 opacity-20" />
                <p className="text-sm font-mono tracking-widest uppercase">No destinations found for your filter.</p>
              </div>
            )}
          </motion.div>
        </div>

      </Container>
    </section>
  );
}