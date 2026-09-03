'use client';

import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FloorSection from '../../../components/sections/FloorSection';
import { fetchMallInfo, fetchMallInterior } from '../../../data/mockData';
import { Mall, MallInteriorData } from '../../../types';

export default function MallInterior({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // استیت‌های مدیریت دیتا و لودینگ (دقیقاً مشابه زمانی که به بک‌اند وصل می‌شویم)
  const [mallInfo, setMallInfo] = useState<Mall | null>(null);
  const [interiorData, setInteriorData] = useState<MallInteriorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // وصل شدن به API در لحظه بالا آمدن صفحه
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // به صورت موازی هر دو API را کال می‌کنیم تا سرعت بالا برود
        const [infoResult, interiorResult] = await Promise.all([
          fetchMallInfo(id),
          fetchMallInterior(id)
        ]);
        
        setMallInfo(infoResult);
        setInteriorData(interiorResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // صفحه لودینگِ فضایی در زمانِ انتظار برای پاسخ API
  if (isLoading || !mallInfo || !interiorData) {
    return (
      <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white tracking-[0.3em] text-xs uppercase"
        >
          Connecting to Space...
        </motion.div>
      </div>
    );
  }

  // اگر دیتا با موفقیت لود شد، رابط کاربری رندر می‌شود
  return (
    <main className="relative w-full bg-[#f4f3f0] text-[#1a1a1a] selection:bg-black selection:text-white">
      
      {/* هشتی ورودی با دیتای بایند شده */}
      <section className="relative w-full h-[70vh] overflow-hidden flex flex-col justify-center items-center bg-black">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src={mallInfo.image} 
            alt={mallInfo.title} 
            className="w-full h-full object-cover mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#f4f3f0]" />
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

      {/* بخش طبقات با دیتای بایند شده از API */}
      <div className="relative z-20">
        {interiorData.floors.map((floor) => (
          <FloorSection key={floor.id} floor={floor} />
        ))}
      </div>

    </main>
  );
}