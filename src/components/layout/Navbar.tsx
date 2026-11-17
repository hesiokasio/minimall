'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, User, LogOut } from 'lucide-react';
import CartDrawer from './CartDrawer';
import Container from './Container';

// ۱. وارد کردن ابزارهای انیمیشن و مغز متفکر
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { createClient } from '../../utils/supabase/client';

const Navbar = () => {
  const supabase = createClient();
  const { isCartOpen, openCart, closeCart, cartItems } = useCart();
  
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // بررسی وضعیت لاگین مشتری در هدر
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoadingUser(false);
    };
    checkUser();

    // گوش دادن به تغییرات لاگین/خروج به صورت آنی
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="w-full h-20 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center">
        <Container className="flex items-center justify-between w-full">
          
          {/* سمت چپ: منو */}
          <div className="flex items-center gap-4 w-1/3">
            <button suppressHydrationWarning className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer">
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

          {/* سمت راست: سرچ، پروفایل/ورود و سبد خرید */}
          <div className="flex items-center gap-3 w-1/3 justify-end">
            <button suppressHydrationWarning className="hidden md:flex items-center gap-3 bg-black/[0.03] hover:bg-black/[0.06] border border-black/5 px-4 py-2 rounded-full transition-colors cursor-pointer">
              <Search size={16} />
              <span className="text-[10px] font-mono text-black/40">Search...</span>
            </button>

            {/* بخش مدیریت ورود مشتری در هدر */}
            {!loadingUser && (
              user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60">
                    <User size={14} className="text-zinc-500" />
                    <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    title="Sign Out"
                    className="p-2 hover:bg-black/5 rounded-full transition-colors text-zinc-600 hover:text-rose-600 cursor-pointer"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login/storefront"
                  className="text-xs font-semibold tracking-wider uppercase px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-full transition-colors shrink-0"
                >
                  Sign In
                </Link>
              )
            )}
            
            {/* دکمه سبد خریدِ داینامیک و انیمیشن‌دار */}
            <button 
              suppressHydrationWarning
              onClick={openCart}
              className="relative p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer group"
            >
              <ShoppingBag size={20} className="text-[#222222] group-hover:scale-110 transition-transform" />
              
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    key={totalItems} 
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