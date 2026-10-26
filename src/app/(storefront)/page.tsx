import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/sections/Hero';
import BentoGrid from '../../components/sections/BentoGrid';
import HorizontalProductRow from '../../components/sections/HorizontalProductRow';
import HorizontalBrandRow from '../../components/sections/HorizontalBrandRow';
import Footer from '../../components/layout/Footer';
import DiscoveryRow from '../../components/sections/DiscoveryRow';
import FullBanner from '../../components/sections/FullBanner';

import { PRODUCTS, FEATURED_BRANDS } from '../../data/mockData';
import { createClient } from '../../utils/supabase/client'; // ایمپورت دیتابیس

// این خط به نکست‌جی‌اس می‌گوید که این صفحه را کش نکند تا به محض تغییر در پنل ادمین، سایت آپدیت شود
export const revalidate = 0; 

export default async function Home() {
  const supabase = createClient();
  
  // ۱. گرفتن لیست چیدمان‌ها از دیتابیس به ترتیب دلخواه شما
  const { data: sections } = await supabase
    .from('home_sections')
    .select('*')
    .eq('is_published', true) // 🔴 فقط آنهایی که در پنل پابلیش شده‌اند
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return (
    <div className="min-h-screen bg-[#f4f3f0] text-[#1a1a1a] font-sans selection:bg-black selection:text-white relative">
      
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <Navbar />

      <main>
        {/* هدر سایت همیشه ثابت است */}
        <Hero />
        
        {/* ۲. رندر کردن اتوماتیک ردیف‌ها بر اساس چیزی که در پنل ادمین ساختید */}
        {sections?.map((section) => {
          
          // اگر نوع چیدمان اسلایدر محصول بود
          if (section.type === 'product_carousel') {
            return (
              <DiscoveryRow 
                key={section.id} 
                title={section.title} 
                sectionId={section.id} // 🔴 این آیدی را می‌فرستیم تا ردیف بداند کدام محصولات را لود کند
              />
            );
          }

          // اگر بنر گرافیکی بود
          if (section.type === 'bento_grid') {
            return <BentoGrid key={section.id} sectionId={section.id} />; // 🔴 این تغییر را اعمال کنید
          }

          // اگر بنر تمام‌عرض بود
          if (section.type === 'full_banner') {
            return <FullBanner key={section.id} sectionId={section.id} />;
          }

          // اگر اسلایدر فروشندگان/بوتیک‌ها بود
          if (section.type === 'store_carousel') {
            return (
              <HorizontalBrandRow 
                key={section.id}
                category="Boutiques" 
                title={section.title} 
                sectionId={section.id} // 🔴 این آیدی معجزه می‌کند!
              />
            );
          }

          return null;
        })}
        
      </main>

      <Footer />
    </div>
  );
}