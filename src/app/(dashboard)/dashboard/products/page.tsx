'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, UploadCloud, X, Tag } from 'lucide-react';

export default function ProductsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [price, setPrice] = useState('');

  // تابع فرمت کردن قیمت (جدا کردن ۳ رقم ۳ رقم)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setPrice(formatted);
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full relative min-h-screen">
      
      {/* هدر صفحه محصولات */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-black/50 mt-1 text-xs md:text-sm">Manage your mall inventory.</p>
        </div>
        {/* دکمه دسکتاپ */}
        <button 
          onClick={() => setIsSheetOpen(true)}
          className="hidden md:flex bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold items-center gap-2 hover:bg-black/80 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </header>

      {/* نوار جستجو */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full bg-white border border-black/[0.05] rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-black/20 focus:ring-1 focus:ring-black/20 transition-all shadow-sm"
        />
      </div>

      {/* لیست خالی (Empty State) */}
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-black/10 rounded-3xl bg-black/[0.01]">
        <div className="w-16 h-16 bg-black/[0.04] rounded-full flex items-center justify-center mb-4 text-black/40">
          <Tag size={24} />
        </div>
        <h3 className="text-lg font-bold mb-1">No products yet</h3>
        <p className="text-black/50 text-sm mb-6 text-center max-w-xs">
          Your storefront is currently empty. Add your first product to start selling.
        </p>
      </div>

      {/* دکمه شناور موبایل (FAB) */}
      <button 
        onClick={() => setIsSheetOpen(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] z-40 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </button>

      {/* 🔴 انیمیشن و منطق Bottom Sheet برای افزودن محصول */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* پس‌زمینه تاریک */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            {/* فرم کشویی */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-0 md:top-0 md:w-[450px] md:h-full bg-white z-50 rounded-t-[2.5rem] md:rounded-none shadow-2xl flex flex-col"
            >
              {/* خط تزیینی بالای کشو در موبایل */}
              <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mt-4 md:hidden" />
              
              <div className="flex justify-between items-center p-6 border-b border-black/[0.05]">
                <h2 className="text-lg font-bold">New Product</h2>
                <button onClick={() => setIsSheetOpen(false)} className="p-2 bg-black/[0.04] rounded-full text-black/60 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              {/* محتوای فرم */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                
                {/* آپلود عکس */}
                <div>
                  <label className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2 block">Product Image</label>
                  <div className="w-full aspect-[4/3] bg-black/[0.02] border border-dashed border-black/15 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/[0.04] transition-colors">
                    <UploadCloud size={28} className="text-black/40 mb-2" />
                    <span className="text-sm font-semibold text-black/60">Tap to upload</span>
                  </div>
                </div>

                {/* نام محصول */}
                <div>
                  <label className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2 block">Name</label>
                  <input type="text" placeholder="e.g. Minimalist Watch" className="w-full bg-black/[0.03] border-none rounded-xl py-3.5 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/10 transition-all" />
                </div>

                {/* قیمت با فرمت خودکار */}
                <div>
                  <label className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2 block">Price (Toman)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 text-sm font-bold">T</span>
                    <input 
                      type="text" 
                      value={price}
                      onChange={handlePriceChange}
                      placeholder="0" 
                      className="w-full bg-black/[0.03] border-none rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/10 transition-all" 
                    />
                  </div>
                </div>

              </div>

              {/* دکمه ذخیره (چسبیده به پایین) */}
              <div className="p-6 border-t border-black/[0.05] bg-white pb-safe">
                <button className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-black/80 transition-colors shadow-lg active:scale-[0.98]">
                  Publish Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}