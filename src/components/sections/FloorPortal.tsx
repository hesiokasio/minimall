'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Compass } from 'lucide-react';
import { Floor } from '../../types';

interface FloorPortalProps {
  floor: Floor;
  levelNumber: number;
}

export default function FloorPortal({ floor, levelNumber }: FloorPortalProps) {
  const brandNames = floor.stores ? floor.stores.map((s) => s.name) : [];

  return (
    <div className="relative w-full py-4 md:py-6 pl-4 md:pl-12 lg:pl-20 pr-4 md:pr-20 my-2 select-none overflow-hidden">
      {/* خط راهنمای فوق‌باریک */}
      <div className="w-full flex items-center gap-4 mb-3 opacity-40">
        <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-mono uppercase tracking-[0.25em] text-black">
          <Compass size={10} className="animate-spin" style={{ animationDuration: '14s' }} />
          <span>ZONE_TRANSIT // 0{levelNumber}</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
      </div>

      {/* پلاک نام طبقه و برندها */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-black/80 pl-4 py-1">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-black/20 leading-none">
              0{levelNumber}F
            </span>
            <motion.h2 
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-lg md:text-2xl font-bold uppercase tracking-tight text-black leading-none"
            >
              {floor.title}
            </motion.h2>
          </div>
          <p className="text-black/50 text-[8px] md:text-[10px] tracking-[0.15em] uppercase mt-1">
            Curated Directory & Department Showcase
          </p>
        </div>

        {brandNames.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-black/40 flex items-center gap-1">
              <ArrowDownRight size={10} /> Brands:
            </span>
            {brandNames.map((brand, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-full bg-black/[0.04] border border-black/5 text-black/80 text-[8px] md:text-[9px] font-medium"
              >
                {brand}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}