'use client';

import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Layers, Link as LinkIcon, Loader2, CheckCircle2, Store } from 'lucide-react';
import { createClient } from '../../../../../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [stores, setStores] = useState<any[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // فیلدهای فرم
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [storeId, setStoreId] = useState('');

  // دریافت لیست غرفه‌ها برای اختصاص محصول به آن‌ها
  useEffect(() => {
    async function fetchStores() {
      const { data } = await supabase.from('stores').select('id, name');
      if (data) {
        setStores(data);
        if (data.length > 0) setStoreId(data[0].id); // انتخاب پیش‌فرض اولین غرفه
      }
      setIsLoadingStores(false);
    }
    fetchStores();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const { error } = await supabase.from('products').insert([
      {
        name,
        category,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        image_url: imageUrl || null,
        store_id: storeId,
      }
    ]);

    if (!error) {
      setSuccessMsg('محصول با موفقیت به سیستم اضافه شد!');
      setTimeout(() => {
        router.push('/admin/products'); // بازگشت به لیست محصولات
      }, 1500);
    } else {
      console.error(error);
      alert('خطا در ثبت محصول. لطفا دوباره تلاش کنید.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto w-full" dir="rtl">
      
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">افزودن محصول جدید</h1>
        <p className="text-gray-500 mt-2 text-sm">تعریف کالای جدید و اختصاص آن به غرفه‌های فعال.</p>
      </header>

      {successMsg && (
        <div className="mb-8 p-4 bg-black text-white rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
        <form onSubmit={handleCreateProduct} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* نام محصول */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">نام محصول</label>
              <div className="relative">
                <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلا: پودر بندکشی الاستومری رنگ طوسی"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all" 
                />
              </div>
            </div>

            {/* دسته‌بندی */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">دسته‌بندی</label>
              <div className="relative">
                <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="مثلا: مصالح ساختمانی"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all" 
                />
              </div>
            </div>

            {/* قیمت */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">قیمت (تومان)</label>
              <div className="relative">
                <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثلا: 150000"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all text-left" 
                  dir="ltr"
                />
              </div>
            </div>

            {/* موجودی */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">موجودی انبار</label>
              <div className="relative">
                <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="مثلا: 50"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all text-left" 
                  dir="ltr"
                />
              </div>
            </div>

          </div>

          {/* انتخاب غرفه */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-2 block">اختصاص به غرفه (فروشنده)</label>
            <div className="relative">
              <Store className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                required
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                disabled={isLoadingStores}
                className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all appearance-none"
              >
                {isLoadingStores ? (
                  <option>در حال بارگذاری غرفه‌ها...</option>
                ) : stores.length === 0 ? (
                  <option value="">هیچ غرفه‌ای یافت نشد!</option>
                ) : (
                  stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* آدرس عکس */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-2 block">لینک عکس محصول</label>
            <div className="relative">
              <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="url" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all text-left" 
                dir="ltr"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">لینک مستقیم تصویر محصول را وارد کنید. (آپلود مستقیم بعداً اضافه می‌شود)</p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
            <button 
              type="submit"
              disabled={isSubmitting || stores.length === 0}
              className="w-full md:w-auto px-10 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-black flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> در حال ثبت...</> : 'ثبت محصول در دیتابیس'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}