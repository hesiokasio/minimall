'use client';

import React, { use, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client'; // 🔴 اضافه شد

import FloorSection from '../../../../components/sections/FloorSection';
import FloorPortal from '../../../../components/sections/FloorPortal';
import ElevatorPanel from '../../../../components/layout/ElevatorPanel';

export default function MallInterior({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [mallInfo, setMallInfo] = useState<any>(null);
  const [interiorData, setInteriorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeFloor, setActiveFloor] = useState<number>(1);
  const floorRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isManualScrolling = useRef(false);
  const FloorPortalComponent = FloorPortal as React.ComponentType<any>;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const supabase = createClient();

      try {
        // 🔴 تغییر مهم: استفاده از maybeSingle به جای single
        const { data: mall, error: mallError } = await supabase
          .from('malls')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (mallError) {
          console.error("جزئیات خطای پاساژ:", mallError);
          setIsLoading(false);
          return; // خروج از تابع
        }

        // اگر پاساژی با این آیدی پیدا نشد
        if (!mall) {
          console.error("پاساژی با این آیدی در دیتابیس وجود ندارد!");
          setIsLoading(false);
          return;
        }

        // دریافت مغازه‌ها به همراه محصولاتشان
        const { data: stores, error: storesError } = await supabase
          .from('stores')
          .select('*, products(*)')
          .eq('mall_id', mall.id);

        if (storesError) throw storesError;

        setMallInfo({
          id: mall.id,
          title: mall.name,
          image: mall.cover_image || 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?q=80&w=2000&auto=format&fit=crop',
        });

        const floorsArray = [];
        const totalFloors = mall.total_floors || 1;

        for (let i = 1; i <= totalFloors; i++) {
          const floorStores = (stores || [])
            // 🔴 راز حل مشکل اینجاست: ستون floor_level را به عدد تبدیل می‌کنیم تا مقایسه درست انجام شود
            .filter(store => Number(store.floor_level) === i)
            .map(store => ({
              id: store.id,
              name: store.brand_name || 'بدون نام',
              tagline: store.tagline || '',
              logo: store.cover_image_url || null,
              products: (store.products || [])
                .filter((p: any) => p.is_published)
                .map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.image_url
                }))
            }));

          floorsArray.push({
            id: `floor-${i}`,
            level: i,
            title: `طبقه ${i}`,
            stores: floorStores
          });
        }

        setInteriorData({ floors: floorsArray });
        
        if (floorsArray.length > 0) {
          setActiveFloor(1);
        }

      } catch (error) {
        console.error("Error fetching live mall data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    if (!interiorData) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;
      const triggerPoint = window.innerHeight * 0.3; 
      let detectedFloor = 1;

      interiorData.floors.forEach((floor: any, index: number) => {
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
          Connecting to Database...
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
            Scroll to explore {interiorData.floors.length} floors
          </motion.p>
        </div>
      </section>

      <div className="relative z-20 pb-32">
        {interiorData.floors.map((floor: any, index: number) => {
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