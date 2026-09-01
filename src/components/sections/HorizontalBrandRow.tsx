'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Brand } from '../../types';

interface HorizontalBrandRowProps {
  category: string;
  title: string;
  brands: Brand[];
}

const HorizontalBrandRow = ({ category, title, brands }: HorizontalBrandRowProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, [brands]);

  return (
    <section className="w-full py-20 pl-6 md:pl-12 lg:pl-20 bg-white">
      
      <div className="pr-6 md:pr-12 lg:pr-20 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold mb-2 block">
            {category}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-black">
            {title}
          </h2>
        </div>
      </div>

      <motion.div 
        ref={carouselRef} 
        className="overflow-hidden cursor-grab active:cursor-grabbing pr-6 md:pr-20"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -dragConstraints }}
          dragElastic={0.15}
          className="flex gap-6 pb-8"
        >
          {brands.map((brand) => (
            <motion.div 
              key={brand.id}
              className="shrink-0 w-[85vw] md:w-[500px] aspect-[16/9] relative rounded-[2rem] overflow-hidden group bg-black isolate translate-z-0"
              whileHover={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* عکس پس‌زمینه با افکت تاریک‌شدن هنگام هاور */}
              <img 
                src={brand.image} 
                alt={brand.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40 pointer-events-none"
                draggable={false}
              />
              
              {/* گرادیانت برای خوانایی متن */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* محتوای متنی کارت */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-tight">
                    {brand.name}
                  </h3>
                  <p className="text-white/70 text-sm font-light mb-6">
                    {brand.tagline}
                  </p>
                  <button className="text-xs text-white uppercase tracking-widest flex items-center gap-2 pointer-events-auto w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Enter Boutique <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HorizontalBrandRow;