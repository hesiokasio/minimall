import React from 'react';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client';

// 🔴 ایمپورت کردن کانتینر استاندارد پروژه
import Container from '../layout/Container'; 

type FullBannerProps = {
  sectionId?: string;
};

export default async function FullBanner({ sectionId }: FullBannerProps) {
  if (!sectionId) return null;

  const supabase = createClient();

  // گرفتن عکس بنر از دیتابیس (فقط ۱ عکس)
  const { data: banners } = await supabase
    .from('home_section_items')
    .select('image_url, target_link')
    .eq('section_id', sectionId)
    .limit(1);

  const banner = banners?.[0];
  if (!banner || !banner.image_url) return null;

  return (
    // بخش اصلی با پدینگ‌های بالا و پایین مشابه بقیه قسمت‌های سایت
    <section className="w-full py-10 md:py-16 relative z-20 overflow-hidden">
      
      {/* 🔴 استفاده از Container برای حفظ عرض مجاز و هماهنگی با کل سایت */}
      <Container>
        <Link 
          href={banner.target_link || '#'} 
          className="block relative w-full h-[200px] md:h-[400px] lg:h-[500px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm"
        >
          <img 
            src={banner.image_url} 
            alt="Promotional Banner" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* یک لایه تیره بسیار ملایم که با هاور شدن محو می‌شود (برای جذابیت بصری) */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        </Link>
      </Container>
      
    </section>
  );
}