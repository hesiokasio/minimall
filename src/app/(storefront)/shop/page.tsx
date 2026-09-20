'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Loader2, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../../../utils/supabase/client';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedProducts = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    };

    fetchPublishedProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f3f0] text-[#1a1a1a]">
      
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">پرومر (Promer)</h1>
              <p className="text-xs text-black/50 uppercase tracking-widest font-mono mt-0.5">Official Store</p>
            </div>
          </div>
          <div className="relative p-2 cursor-pointer hover:bg-black/5 rounded-full transition-colors">
            <ShoppingBag size={24} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="mb-10 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Latest Products</h2>
          <p className="text-black/60 max-w-md">
            با کیفیت‌ترین متریال‌های ساختمانی و پودرهای بندکشی الاستومری را مستقیماً از پرومر تهیه کنید.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-black/20 mb-4" size={40} />
            <p className="text-sm font-medium text-black/50 tracking-widest uppercase">Loading Storefront...</p>
          </div>
        ) : products.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-black/5 shadow-sm">
            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6 text-black/30">
              <Tag size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">فروشگاه فعلاً خالی است</h3>
            <p className="text-black/50 text-center max-w-sm">
              در حال حاضر محصولی برای نمایش وجود ندارد. لطفاً بعداً سر بزنید.
            </p>
          </div>
          
        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group"
              >
                {/* 🔴 کل کارت محصول را داخل Link قرار دادیم */}
                <Link href={`/product/${product.id}`} className="flex flex-col h-full">
                  
                  <div className="aspect-[4/5] w-full bg-black/[0.02] relative overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/10">
                        <Tag size={48} />
                      </div>
                    )}
                    
                    <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-full bg-black/90 backdrop-blur-md text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl">
                        <Eye size={16} /> مشاهده جزئیات و خرید
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-lg leading-tight mb-3 group-hover:text-black/70 transition-colors line-clamp-2" dir="rtl">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-end" dir="rtl">
                      <span className="font-black text-xl text-black">
                        {product.price.toLocaleString()} <span className="text-xs text-black/50 font-medium mr-1">تومان</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
        )}
      </div>
    </main>
  );
}