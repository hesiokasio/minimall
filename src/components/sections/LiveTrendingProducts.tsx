'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client'; // مطمئن شوید مسیر Supabase درست است
import { ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function LiveTrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLatestProducts() {
      // واکشی جدیدترین محصولات از دیتابیس برای نمایش در صفحه اصلی
      const { data } = await supabase
        .from('products')
        .select(`*, stores(name)`)
        .order('created_at', { ascending: false })
        .limit(6);

      if (data) setProducts(data);
      setIsLoading(false);
    }
    fetchLatestProducts();
  }, []);

  return (
    <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-6 md:px-12" dir="rtl">
      
      {/* هدر بخش پرفروش‌ها */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-gray-900 mb-2">
            Trending Right Now
          </h2>
          <p className="text-gray-500 text-sm">جدیدترین و پرفروش‌ترین محصولات پلتفرم</p>
        </div>
        <Link href="/products" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors">
          مشاهده همه <ArrowLeft size={16} />
        </Link>
      </div>

      {/* گرید محصولات داینامیک */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-gray-300" size={40} />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#F8F8F8] rounded-3xl p-10 text-center text-gray-400 text-sm font-medium border border-black/[0.03]">
          هنوز محصولی در سایت وجود ندارد.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block">
              
              <div className="relative aspect-square bg-[#F8F8F8] rounded-2xl overflow-hidden mb-4 border border-black/[0.03] group-hover:shadow-lg transition-all duration-300">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag size={32} />
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full bg-white/90 backdrop-blur-sm text-black text-xs font-bold py-2.5 rounded-xl shadow-sm">
                    مشاهده جزئیات
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {product.stores?.name || 'برند متفرقه'}
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-1 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <div className="text-sm font-black text-gray-900" dir="ltr">
                  {(product.price).toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">Toman</span>
                </div>
              </div>

            </Link>
          ))}
        </div>
      )}

    </section>
  );
}