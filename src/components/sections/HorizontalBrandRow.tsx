'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Container from '../layout/Container';
import { createClient } from '../../utils/supabase/client';

interface HorizontalBrandRowProps {
  category?: string;
  title?: string;
  sectionId?: string; 
}

const HorizontalBrandRow = ({ category = "Boutiques", title = "Featured Brands", sectionId }: HorizontalBrandRowProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    if (sectionId) {
      const fetchBanners = async () => {
        const { data } = await supabase
          .from('home_section_items')
          .select('id, image_url, target_link, title') // 🔴 اضافه شدن title برای نمایش نام برند روی عکس
          .eq('section_id', sectionId);
        
        if (data) setBanners(data);
      };
      fetchBanners();
    }
  }, [sectionId]);

  useEffect(() => {
    if (carouselRef.current) {
      setTimeout(() => {
        if (carouselRef.current) {
          setDragConstraints(
            carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
          );
        }
      }, 100);
    }
  }, [banners]);

  if (!sectionId || banners.length === 0) return null;

  return (
    <section className="w-full py-16 md:py-24 relative z-20 overflow-hidden">
      <Container>
        
        {/* هدر */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold mb-2 block">
              {category}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-black">
              {title}
            </h2>
          </div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-black/50 hidden md:block pointer-events-none">
            Drag to explore &rarr;
          </div>
        </div>

        {/* اسلایدر */}
        <div ref={carouselRef} className="w-full overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -dragConstraints }}
            dragElastic={0.15}
            className="flex gap-6 pb-8 cursor-grab active:cursor-grabbing w-fit"
          >
            {banners.map((banner) => (
              <motion.div 
                key={banner.id}
                className="shrink-0 w-[85vw] md:w-[500px] aspect-[16/9] relative rounded-[2rem] overflow-hidden group bg-black isolate translate-z-0"
                whileHover={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Link href={banner.target_link || '#'} className="absolute inset-0 z-20" draggable={false}>
                  <span className="sr-only">مشاهده بوتیک</span>
                </Link>

                <img 
                  src={banner.image_url} 
                  alt={banner.title || "Boutique"} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40 pointer-events-none"
                  draggable={false}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* 🔴 این قسمت اصلاح شد: حاشیه (padding) به متون برگشت */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none z-10">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-tight">
                      {banner.title || "Featured"}
                    </h3>
                    <button className="text-xs text-white uppercase tracking-widest flex items-center gap-2 pointer-events-auto w-fit font-bold">
                      Enter Boutique <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </Container>
    </section>
  );
};

export default HorizontalBrandRow;