'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils } from 'lucide-react';

export interface FloorItem {
  id: string;
  code: string; 
  level: number;
  title: string;
  category: string;
}

interface ElevatorPanelProps {
  activeFloor: number;
  onFloorClick: (level: number) => void;
}

const defaultFloors: FloorItem[] = [
  { id: 'fc', code: 'FC', level: 4, title: 'Food Court & Sky Lounge', category: 'Fine Dining & Cafes' },
  { id: 'f3', code: '3', level: 3, title: 'Spatial & Tech', category: 'Audio & Architecture' },
  { id: 'f2', code: '2', level: 2, title: 'Haute Couture', category: 'Runway & Tailoring' },
  { id: 'f1', code: '1', level: 1, title: 'Ready To Wear', category: 'Everyday Luxury' },
  { id: 'gf', code: 'GF', level: 0, title: 'Grand Hall & Atrium', category: 'Flagship Showcase' },
  { id: 'b1', code: '-1', level: -1, title: 'Basement Gallery', category: 'Vault & Archive' },
];

export default function ElevatorPanel({ activeFloor = 1, onFloorClick }: ElevatorPanelProps) {
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  return (
    <div className="fixed right-2 md:right-5 top-1/2 -translate-y-1/2 z-50 flex items-center select-none font-sans pointer-events-auto">
      
      {/* کپسول شیشه‌ای فوق‌باریک */}
      <div className="flex flex-col items-center bg-white/40 backdrop-blur-2xl border border-white/60 py-4 px-1.5 md:px-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        
        <div className="flex flex-col gap-1.5 relative">
          {defaultFloors.map((floor) => {
            const isActive = activeFloor === floor.level;
            const isHovered = hoveredFloor === floor.level;

            return (
              <div key={floor.id} className="relative flex items-center justify-center">
                
                <button
                  onClick={() => onFloorClick(floor.level)}
                  onMouseEnter={() => setHoveredFloor(floor.level)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  className="cursor-pointer relative w-7 h-8 md:w-8 md:h-10 rounded-full flex flex-col items-center justify-center focus:outline-none transition-transform active:scale-90"
                >
                  {/* دایره مشکی فعال (کوچک‌تر و ظریف‌تر شده) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-floor-indicator"
                      className="absolute w-7 h-7 md:w-8 md:h-8 bg-[#0a0a0a] rounded-full shadow-md"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}

                  {/* لیبل‌ها */}
                  <div className="relative z-10 flex flex-col items-center justify-center leading-none mt-0.5">
                    {floor.code === 'FC' ? (
                      <div className="flex flex-col items-center gap-[3px]">
                        <Utensils size={9} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-white' : 'text-black/50'} />
                        <span className={`text-[6px] font-bold tracking-tighter font-mono ${isActive ? 'text-white' : 'text-black/40'}`}>
                          FC
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className={`text-[9.5px] md:text-[11px] font-mono font-bold transition-colors ${isActive ? 'text-white' : 'text-black/60 hover:text-black'}`}>
                          {floor.code}
                        </span>
                        {/* نقطه ظریف زیر شماره */}
                        <span className={`w-[2px] h-[2px] rounded-full mt-1 transition-colors ${isActive ? 'bg-white' : 'bg-black/15'}`} />
                      </>
                    )}
                  </div>
                </button>

                {/* تابلوی راهنما (فقط در دسکتاپ و با طراحی دارک‌گلس) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-full mr-3 pointer-events-none hidden md:flex items-center gap-3 bg-black/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-xl whitespace-nowrap border border-white/10"
                    >
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/15 text-white font-bold tracking-widest">
                            {floor.code}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-tight">
                            {floor.title}
                          </span>
                        </div>
                        <span className="text-[9px] text-white/50 tracking-wider font-light mt-0.5">
                          {floor.category}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}