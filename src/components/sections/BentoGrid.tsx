import React from 'react';
import { ArrowRight } from 'lucide-react';
import Container from '../layout/Container';
import { createClient } from '../../utils/supabase/client';
import Link from 'next/link';

type BentoGridProps = {
  sectionId?: string; // دریافت آیدی ردیف از page.tsx
};

export default async function BentoGrid({ sectionId }: BentoGridProps) {
  // اگر آیدی پاس داده نشده بود (مثل حالت دمو)، هیچی رندر نکن
  if (!sectionId) return null;

  const supabase = createClient();

  // گرفتن بنرهای مربوط به این ردیف خاص از دیتابیس
  const { data: banners } = await supabase
    .from('home_section_items')
    .select('id, image_url, target_link')
    .eq('section_id', sectionId);

  // اگر بنری وجود نداشت، چیزی نمایش نده
  if (!banners || banners.length === 0) return null;

  // برای چیدمان بونتو گرید، به ۴ بنر نیاز داریم. اگر کمتر بود، با مقادیر خالی پر می‌کنیم تا استایل به هم نریزد
  const banner1 = banners[0];
  const banner2 = banners[1];
  const banner3 = banners[2];
  const banner4 = banners[3];

  return (
    <section className="w-full py-16 md:py-24 relative z-20 overflow-hidden">
      <Container>
        <div className="flex flex-col gap-8 md:gap-12">
          
          {/* هدر */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-black uppercase leading-none">
                CURATED <br />
                <span className="text-black/30">EDITIONS</span>
              </h2>
            </div>
            <p className="max-w-sm text-xs md:text-sm text-black/60 leading-relaxed font-medium">
              Discover our meticulously selected editorial pieces. Interact with the canvas to explore hidden details and exclusive collections.
            </p>
          </div>

          {/* گرید نامتقارن */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]">
            
            {/* ۱. کارت عمودی بلند (سمت چپ) */}
            {banner1 && (
              <Link href={banner1.target_link || '#'} className="lg:col-span-1 lg:row-span-2 relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer block">
                <img 
                  src={banner1.image_url} 
                  alt="Banner 1" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <span className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full text-sm transition-colors hover:bg-white/30">
                    + Explore Collection
                  </span>
                </div>
              </Link>
            )}

            {/* ۲. کارت کوچک (بالا وسط) */}
            {banner2 && (
              <Link href={banner2.target_link || '#'} className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-[#f4f3f0] cursor-pointer block">
                <img src={banner2.image_url} alt="Banner 2" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </Link>
            )}

            {/* ۳. کارت کوچک (بالا راست) */}
            {banner3 && (
              <Link href={banner3.target_link || '#'} className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-[#f4f3f0] cursor-pointer block">
                <img src={banner3.image_url} alt="Banner 3" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </Link>
            )}

            {/* ۴. بنر عریض (پایین راست) */}
            {banner4 && (
              <Link href={banner4.target_link || '#'} className="lg:col-span-2 relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-[#111] flex flex-col justify-end cursor-pointer block">
                <img 
                  src={banner4.image_url} 
                  alt="Banner 4" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                <div className="relative z-10 p-8 md:p-10">
                  <span className="uppercase text-[9px] md:text-[10px] tracking-widest text-white/60 mb-2 block font-bold">
                    Featured Campaign
                  </span>
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                    NEW <br/> COLLECTION
                  </h3>
                  <span className="text-[10px] md:text-xs text-white uppercase tracking-widest flex items-center gap-2 hover:text-white/70 transition-colors border-b border-white/30 pb-1.5 w-fit font-bold">
                    Discover <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )}

          </div>
        </div>
      </Container>
    </section>
  );
}