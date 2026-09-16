'use client';

import React from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
// 🔴 فراخوانی کانتینر برای تراز شدن با کل پروژه
import Container from './Container'; 

const Navbar = () => {
  return (
    // نویگیشن شیشه‌ای و چسبان به بالای صفحه
    <header className="sticky top-0 z-[60] w-full bg-white/90 backdrop-blur-lg border-b border-black/[0.04]">
      
      {/* استفاده از Container برای هم‌ترازیِ دقیق با هیرو سکشن */}
      <Container className="flex justify-between items-center py-4 md:py-5">
        
        {/* سمت چپ: دکمه منو */}
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity flex-1">
          <Menu size={24} strokeWidth={1.5} className="text-black" />
          <span className="text-[10px] uppercase tracking-[0.3em] hidden md:block mt-1 font-bold text-black">
            Menu
          </span>
        </div>
        
        {/* وسط: لوگو */}
        <div className="text-2xl tracking-tighter font-black cursor-pointer text-black flex-1 text-center">
          MINI<span className="font-light">MALL</span>
        </div>

        {/* سمت راست: جستجوی کالا و سبد خرید */}
        <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
          
          {/* دکمه جستجوی هوشمند (Command Palette) مختص دسکتاپ */}
          <button 
  suppressHydrationWarning 
  className="hidden md:flex items-center gap-3 bg-black/[0.03] hover:bg-black/[0.06] border border-black/5 px-4 py-2 rounded-full transition-colors"
>
            <Search size={16} strokeWidth={2} className="text-black/40 group-hover:text-black/70 transition-colors" />
            <span className="text-[10px] font-mono text-black/40 group-hover:text-black/60 transition-colors">
              Search products...
            </span>
            {/* میانبر کیبورد */}
            <kbd className="hidden lg:inline-flex items-center gap-1 bg-white border border-black/10 px-1.5 py-0.5 rounded text-[9px] font-mono text-black/50 shadow-sm">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>

          {/* آیکون جستجو مختص موبایل */}
          <button className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors">
            <Search size={20} strokeWidth={1.5} className="text-black" />
          </button>

          {/* سبد خرید با نشانگر تعداد */}
          <div className="relative cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center p-1">
            <ShoppingBag size={20} strokeWidth={1.5} className="text-black" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              0
            </span>
          </div>
          
        </div>
      </Container>
    </header>
  );
};

export default Navbar;