'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import CartDrawer from './CartDrawer';
import Container from './Container';

// ۱. وارد کردن ابزارهای انیمیشن و مغز متفکر
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  // ۲. گرفتن اطلاعات از کانتکست
  const { isCartOpen, openCart, closeCart, cartItems } = useCart();
  
  // ۳. محاسبه تعداد کل آیتم‌های داخل سبد
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="w-full h-20 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center">
        <Container className="flex items-center justify-between w-full">
          
          {/* سمت چپ: منو */}
          <div className="flex items-center gap-4 w-1/3">
            <button suppressHydrationWarning className="flex items-center gap-2 hover:opacity-70 transition-opacity">
  <Menu size={20} />
  <span className="text-sm font-semibold tracking-widest uppercase hidden md:block">Menu</span>
</button>
          </div>

          {/* وسط: لوگو */}
          <div className="w-1/3 flex justify-center">
            <Link href="/" className="text-2xl font-black tracking-tighter">
              MINIMALL
            </Link>
          </div>

          {/* سمت راست: سرچ و سبد خرید */}
          <div className="flex items-center gap-4 w-1/3 justify-end">
            <button suppressHydrationWarning className="hidden md:flex items-center gap-3 bg-black/[0.03] hover:bg-black/[0.06] border border-black/5 px-4 py-2 rounded-full transition-colors">
              <Search size={16} />
              <span className="text-[10px] font-mono text-black/40">Search...</span>
            </button>
            
            {/* ۴. دکمه سبد خریدِ داینامیک و انیمیشن‌دار */}
            <button 
              suppressHydrationWarning
              onClick={openCart}
              className="relative p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer group"
            >
              <ShoppingBag size={20} className="text-[#222222] group-hover:scale-110 transition-transform" />
              
              <AnimatePresence>
                {/* فقط وقتی آیتمی در سبد هست، این دایره مشکی را نشان بده */}
                {totalItems > 0 && (
                  <motion.span 
                    key={totalItems} // این کلید باعث می‌شود با هر بار تغییر عدد، انیمیشن دوباره اجرا شود
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-[18px] h-[18px] bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

        </Container>
      </nav>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={closeCart} 
      />
    </>
  );
};

export default Navbar;