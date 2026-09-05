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
      ref={containerRef}
      className="relative w-full bg-[#f4f3f0] pt-4 pb-16 overflow-hidden"
    >
      
      {/* تایپوگرافی محو در پس‌زمینه طبقه */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <motion.h2 
          style={{ y: yText }}
          className="text-[10rem] md:text-[18rem] font-bold text-black/[0.03] whitespace-nowrap tracking-tighter select-none"
        >
          {floor.title}
        </motion.h2>
      </div>

      {/* رندر کردن محصولات */}
      <div className="relative z-10 flex flex-col gap-6 md:gap-10">
        {floor.stores.map((store) => (
          <StoreRow key={store.id} store={store} />
        ))}
      </div>
      
    </section>
  );
}