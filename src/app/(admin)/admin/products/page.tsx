'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, Eye, Ban, Loader2 } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      // دریافت تمام محصولات دیتابیس به همراه نام فروشگاهی که آن را ثبت کرده
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          stores ( name )
        `)
        .order('created_at', { ascending: false });

      if (data) setProducts(data);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto w-full" dir="rtl">
      
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
  <div>
    <h1 className="text-3xl font-black tracking-tight text-gray-900">نظارت بر محصولات</h1>
    <p className="text-gray-500 mt-2 text-sm">بررسی و مدیریت کالاهای ثبت شده توسط تمام غرفه‌ها.</p>
  </div>
  <div className="flex gap-2 w-full md:w-auto">
    {/* دکمه جدید برای رفتن به صفحه افزودن محصول */}
    <a href="/admin/products/new" className="bg-black text-white hover:bg-gray-800 px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-sm whitespace-nowrap">
      افزودن محصول
    </a>
    <div className="relative w-full md:w-72">
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input 
        type="text" 
        placeholder="جستجوی محصول..."
        className="w-full bg-white border border-gray-100 focus:border-gray-200 rounded-xl py-3 pr-11 pl-4 text-sm font-medium outline-none transition-all shadow-sm"
      />
    </div>
  </div>
</header>

      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
        ) : products.length === 0 ? (
          <div className="text-center p-12 text-gray-400 text-sm font-medium">
            هنوز هیچ محصولی در پلتفرم ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">محصول</th>
                  <th className="px-6 py-4">فروشگاه (غرفه)</th>
                  <th className="px-6 py-4">قیمت / موجودی</th>
                  <th className="px-6 py-4 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={18} />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{product.category || 'بدون دسته‌بندی'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-600 text-xs">
                      {product.stores?.name || 'نامشخص'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {(product.price || 0).toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">تومان</span>
                      </div>
                      <div className={`text-[10px] mt-0.5 font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} عدد موجود` : 'ناموجود'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="مشاهده در سایت">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف محصول">
                          <Ban size={18} />
                        </button>
                      </div>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}