import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/sections/Hero';
import BentoGrid from '../../components/sections/BentoGrid';
import HorizontalProductRow from '../../components/sections/HorizontalProductRow';
import { PRODUCTS } from '../../data/mockData';
import HorizontalBrandRow from '../../components/sections/HorizontalBrandRow';
import Footer from '../../components/layout/Footer';
import DiscoveryRow from '../../components/sections/DiscoveryRow'
import { NEW_ARRIVALS, CURATED_EDIT, FEATURED_BRANDS } from '../../data/mockData';

// اضافه کردن کامپوننت زنده
import LiveTrendingProducts from '../../components/sections/LiveTrendingProducts'; 

export default function Home() {
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
        <Hero />
        
        {/* ردیف اول حالا داینامیک است و از دیتابیس می‌خواند */}
        <LiveTrendingProducts />
        
        {/* بقیه ردیف‌ها فعلاً به صورت هاردکد باقی می‌مانند تا بعداً آن‌ها را هم داینامیک کنیم */}
        <DiscoveryRow title="Fresh Drops" products={NEW_ARRIVALS} />
        <HorizontalBrandRow category="The Brand Archive" title="Featured Boutiques" brands={FEATURED_BRANDS} />
        <DiscoveryRow title="The Considered Edit" products={CURATED_EDIT} />
        <BentoGrid />
        <HorizontalProductRow 
          category="New Arrivals" 
          title="The considered edit" 
          products={PRODUCTS} 
        />
        <HorizontalBrandRow 
          category="The Brand Archive" 
          title="Featured Boutiques" 
          brands={FEATURED_BRANDS} 
        />
      </main>

      <Footer />
    </div>
  );
}