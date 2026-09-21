'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Store, Package, TrendingUp, Loader2 } from 'lucide-react';
import { createClient } from '../../../utils/supabase/client'; // آدرس دیتابیس را چک کن

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ malls: 0, stores: 0, products: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      // دریافت آمار واقعی از جداول دیتابیس
      const { count: mallsCount } = await supabase.from('malls').select('*', { count: 'exact', head: true });
      const { count: storesCount } = await supabase.from('stores').select('*', { count: 'exact', head: true });
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

      setStats({
        malls: mallsCount || 0,
        stores: storesCount || 0,
        products: productsCount || 0
      });
      setIsLoading(false);
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto w-full" dir="rtl">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">نمای کلی پلتفرم</h1>
        <p className="text-gray-500 mt-2 text-sm">آمار لحظه‌ای از وضعیت پاساژها و فروشندگان.</p>
      </header>

      {/* ویجت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
              <Building2 size={24} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> زنده
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1" dir="ltr">{stats.malls}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">پاساژهای فعال</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
              <Store size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1" dir="ltr">{stats.stores}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">غرفه‌های ثبت‌شده</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
              <Package size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1" dir="ltr">{stats.products}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">محصولات روی سایت</div>
          </div>
        </div>

      </div>

      <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center">
        <h3 className="font-bold text-gray-800 mb-2">به مرکز فرماندهی خوش آمدید</h3>
        <p className="text-sm text-gray-400">از طریق منوی سمت راست می‌توانید ساختار سایت را مدیریت کنید.</p>
      </div>

    </div>
  );
}