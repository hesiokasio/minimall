'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SPATIAL_MALLS } from '../../data/mockData';
import { Mall } from '../../types';

const Hero = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);

  // محاسبه‌ی طولِ مجاز برای اسکرول (Drag) با موس
  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center">
      {/* تایپوگرافیِ غول‌پیکرِ پس‌زمینه */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[15vw] leading-none font-bold text-black/5 whitespace-nowrap select-none">
          SPATIAL COMMERCE
        </h1>
      </div>

      <div className="z-10 w-full pl-6 md:pl-20 mt-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-[1px] bg-black"></div>
          <span className="uppercase text-xs tracking-widest font-medium text-black/60">
            Select a Destination
          </span>
        </div>

        {/* کانتینر اصلی اسکرول با Framer Motion */}
        <motion.div ref={carouselRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -dragConstraints }}
            dragElastic={0.1}
            className="flex gap-6 md:gap-10 pb-10"
          >
            {SPATIAL_MALLS.map((mall) => (
              <motion.div
                key={mall.id}
                className="relative min-w-[85vw] md:min-w-[45vw] lg:min-w-[35vw] h-[55vh] md:h-[65vh] rounded-[2rem] overflow-hidden group"
                whileHover={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* عکس پس‌زمینه */}
                <img
                  src={mall.image}
                  alt={mall.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  draggable={false}
                />
                
                {/* لایه‌ی گرادیانتِ تاریک برای خوانایی متن‌ها */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* افکت شیشه‌ای (Glassmorphism) هنگام هاور */}
                <motion.div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center pointer-events-none"
                >
                  <motion.button 
                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center gap-3 font-medium pointer-events-auto hover:bg-white hover:text-black transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ENTER MALL <ArrowRight size={18} />
                  </motion.button>
                </motion.div>

                {/* محتوای کارت (تیتر و زیرتیتر) */}
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full transition-opacity duration-500 group-hover:opacity-0 pointer-events-none">
                  <p className="text-white/80 text-sm mb-2 font-light">
                    {mall.subtitle}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                    {mall.title}
                  </h2>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;