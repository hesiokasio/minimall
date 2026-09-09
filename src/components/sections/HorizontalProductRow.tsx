'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Product } from '../../types';
import Container from '../layout/Container';

interface HorizontalRowProps {
  category: string;
  title: string;
  products: Product[];
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20, duration: 0.8 }
  }
};

const HorizontalProductRow = ({ category, title, products }: HorizontalRowProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, [products]);

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={sectionVariants}
      // overflow-hidden در اینجا مانع از اسکرول افقی کل صفحه می‌شود
      className="w-full py-16 md:py-24 relative z-20 overflow-hidden"
    >
      
      {/* 🔴 کل محتوا (هم هدر و هم اسلایدر) را داخل Container می‌گذاریم */}
      <Container>
        
        {/* ۱. هدرِ ردیف */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold mb-3 block">
              {category}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black">
              {title}
            </h2>
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-black/40 hidden md:flex items-center gap-2 font-mono">
            Drag to explore <span className="text-lg leading-none">&rarr;</span>
          </div>
        </div>

        {/* 
          🔴 ۲. کانتینر درگ:
          - چون داخل Container است، لبه سمت چپ آن همیشه و در هر دستگاهی دقیقا با هدر تراز است.
          - عرض آن با فرمول محاسبه شده تا دقیقا مماس با لبه راست مانیتور شود.
          - تمام کلاس‌های pl و pr دستی حذف شدند چون دیگر نیازی به آنها نیست.
        */}
        <div 
          ref={carouselRef} 
          className="w-full overflow-hidden"
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -dragConstraints }}
            dragElastic={0.15}
            className="flex gap-4 md:gap-6 pb-12 cursor-grab active:cursor-grabbing w-fit pr-[10vw]"
          >
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                className="shrink-0 w-[240px] md:w-[280px] lg:w-[320px] aspect-[4/5] relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-white border border-black/[0.04] shadow-sm hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* شماره‌گذاری مینیمال */}
                <div className="absolute top-5 left-5 z-10 text-[9px] md:text-[10px] font-mono font-bold text-black/30 pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* عکس محصول */}
                <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center p-6">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                    draggable={false}
                  />
                </div>

                {/* فوترِ کارت (دکمه افزودن) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md rounded-[1.25rem] p-4 flex items-center justify-between shadow-lg pointer-events-auto border border-black/5">
                    <div className="flex-1 truncate pr-2">
                      <h3 className="font-bold text-xs md:text-sm text-black truncate">{product.name}</h3>
                      <p className="text-black/50 font-mono text-[10px] md:text-xs mt-1">{product.price}</p>
                    </div>
                    <button className="shrink-0 w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-105 transition-all shadow-md">
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </Container>
    </motion.section>
  );
};

export default HorizontalProductRow;