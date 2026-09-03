'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Floor } from '../../types';
import StoreRow from './StoreRow';

interface FloorSectionProps {
  floor: Floor;
}

export default function FloorSection({ floor }: FloorSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      id={`floor-${floor.id}`} 
      ref={containerRef}
      // تغییر رنگ پس‌زمینه و کاهش پدینگ عمودی برای تراکم بیشتر
      className="relative w-full bg-[#f4f3f0] pt-16 pb-12 overflow-hidden border-t border-black/5"
    >
      
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <motion.h2 
          style={{ y: yText }}
          // تغییر رنگ تایپوگرافی پس‌زمینه به مشکی بسیار محو
          className="text-[10rem] md:text-[18rem] font-bold text-black/[0.03] whitespace-nowrap tracking-tighter select-none"
        >
          {floor.id} {floor.title}
        </motion.h2>
      </div>

      <div className="relative z-10 flex flex-col">
        {floor.stores.map((store) => (
          <StoreRow key={store.id} store={store} />
        ))}
      </div>
      
    </section>
  );
}