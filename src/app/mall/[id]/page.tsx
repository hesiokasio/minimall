'use client';

import React, { use, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // 🔴 اضافه شد
import Image from 'next/image'; // 🔴 اضافه شد
import { ArrowLeft } from 'lucide-react'; // 🔴 اضافه شد

import FloorSection from '../../../components/sections/FloorSection';
import FloorPortal from '../../../components/sections/FloorPortal';
import ElevatorPanel from '../../../components/layout/ElevatorPanel';
import { fetchMallInfo, fetchMallInterior } from '../../../data/mockData';
import { Mall, MallInteriorData } from '../../../types';

export default function MallInterior({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [mallInfo, setMallInfo] = useState<Mall | null>(null);
  const [interiorData, setInteriorData] = useState<MallInteriorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeFloor, setActiveFloor] = useState<number>(1);
  const floorRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isManualScrolling = useRef(false);
  const FloorPortalComponent = FloorPortal as React.ComponentType<any>;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [infoResult, interiorResult] = await Promise.all([
          fetchMallInfo(id),
          fetchMallInterior(id)
        ]);
        
        setMallInfo(infoResult);
        setInteriorData(interiorResult);
        
        if (interiorResult.floors.length > 0) {
          setActiveFloor(1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!interiorData) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const triggerPoint = window.innerHeight * 0.3; 
      let detectedFloor = 1;

      interiorData.floors.forEach((floor, index) => {
        const safeLevel = index + 1;
        const element = floorRefs.current[safeLevel];
        
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
            detectedFloor = safeLevel;
          }
        }
      });

      setActiveFloor((prev) => (prev !== detectedFloor ? detectedFloor : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [interiorData]);

  const handleFloorClick = (level: number) => {
    isManualScrolling.current = true;
    setActiveFloor(level);
    
    const targetElement = floorRefs.current[level];
    
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: offsetTop - 40,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isManualScrolling.current = false;
      }, 900);
    }
  };

  if (isLoading || !mallInfo || !interiorData) {
    return (
      <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white tracking-[0.3em] text-xs uppercase font-mono"
        >
          Connecting to Space...
        </motion.div>
      </div>
    );
  }

  return (
    <main className="relative w-full bg-[#f4f3f0] text-[#1a1a1a] selection:bg-black selection:text-white">
      
      <ElevatorPanel 
        activeFloor={activeFloor} 
        onFloorClick={handleFloorClick} 
      />

      <section className="relative w-full h-[70vh] overflow-hidden flex flex-col justify-center items-center bg-black">
        
        {/* 🔴 دکمه بازگشت سریع به صفحه اصلی */}
        <div className="absolute top-8 left-6 md:left-12 z-50">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono tracking-widest uppercase mt-0.5">Directory</span>
          </Link>
        </div>

        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* 🔴 تگ Image هوشمند با اولویت لود (priority) */}
          <Image 
            src={mallInfo.image} 
            alt={mallInfo.title} 
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale opacity-80 will-change-transform transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-[#f4f3f0]" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 text-white">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-none"
          >
            {mallInfo.title}
          </motion.h1>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.4 }}
             className="mt-4 text-white/70 font-light tracking-widest uppercase text-xs"
          >
            Scroll to explore stores
          </motion.p>
        </div>
      </section>

      <div className="relative z-20 pb-32">
        {interiorData.floors.map((floor, index) => {
          const safeLevel = index + 1;
          
          return (
            <div 
              key={floor.id}
              id={`floor-${safeLevel}`}
              ref={(el) => { floorRefs.current[safeLevel] = el; }}
              className="scroll-mt-6"
            >
              <FloorPortalComponent floor={floor} levelNumber={safeLevel} />
              <FloorSection floor={floor} />
            </div>
          );
        })}
      </div>

    </main>
  );
}