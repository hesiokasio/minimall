'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Product } from '../../types';

interface HorizontalRowProps {
  category: string;
  title: string;
  products: Product[];
}

const HorizontalProductRow = ({ category, title, products }: HorizontalRowProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);

  // محاسبه‌ی عرضِ دقیق برای محدود کردن اسکرولِ موس
  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, [products]); // اضافه شدن products به dependency تا در صورت تغییر دیتا، محاسبه آپدیت شود

  return (
    <section className="w-full py-16 pl-6 md:pl-12 lg:pl-20 bg-[#fbfbf9]">
      
      {/* هدرِ ردیف */}
      <div className="pr-6 md:pr-12 lg:pr-20 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold mb-2 block">
            {category}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-black">
            {title}
          </h2>
        </div>
        <div className="text-[10px] uppercase tracking-[0.15em] text-black/50 hidden md:block pointer-events-none">
          Drag to explore &rarr;
        </div>
      </div>

      {/* کانتینر درگ با Framer Motion (جایگزین اسکرول ساده) */}
      <motion.div 
        ref={carouselRef} 
        className="overflow-hidden cursor-grab active:cursor-grabbing pr-6 md:pr-20"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -dragConstraints }}
          dragElastic={0.15}
          className="flex gap-4 md:gap-6 pb-8"
        >
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              // سایز کارت‌ها کوچک‌تر شد (md:w-[280px]) و گوشه‌ها دقیقاً مشابه سکشن‌های قبلی گرد شدند (rounded-[2rem])
              className="shrink-0 w-[60vw] md:w-[280px] aspect-[4/5] relative rounded-[2rem] overflow-hidden group bg-[#e9e9e5]"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* شماره‌گذاری مینیمالِ گوشه‌ی بالا */}
              <div className="absolute top-5 left-5 z-10 text-[10px] font-mono text-black/50 pointer-events-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* عکس محصول با افکت بلندینگ */}
              <img 
                src={product.image} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                draggable={false}
              />

              {/* فوترِ کارت (هاور افکت) */}
              <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-lg pointer-events-auto">
                  <div>
                    <h3 className="font-medium text-sm text-black">{product.name}</h3>
                    <p className="text-black/50 text-xs mt-1">{product.price}</p>
                  </div>
                  <button className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Plus size={16} strokeWidth={2.5} />
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

export default HorizontalProductRow;