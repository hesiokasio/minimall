'use client';

import React, { useEffect, useState } from 'react';
import { Store, ShieldCheck, Ban, Loader2, Search, MapPin } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStores() {
      // دریافت لیست تمام غرفه‌ها به همراه نام پاساژی که در آن قرار دارند
      const { data } = await supabase
        .from('stores')
        .select(`
          *,
          malls ( name )
        `)
        .order('created_at', { ascending: false });

      if (data) setStores(data);
      setIsLoading(false);
    }
    fetchStores();
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto w-full" dir="rtl">
      
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">فروشندگان و غرفه‌ها</h1>
          <p className="text-gray-500 mt-2 text-sm">نظارت بر برندها و مغازه‌های فعال در پلتفرم.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="جستجوی نام فروشگاه..."
            className="w-full bg-white border border-gray-100 focus:border-gray-200 rounded-xl py-3 pr-11 pl-4 text-sm font-medium outline-none transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
        ) : stores.length === 0 ? (
          <div className="text-center p-12 text-gray-400 text-sm font-medium">
            هیچ فروشگاهی در سیستم ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">نام غرفه</th>
                  <th className="px-6 py-4">مکان (پاساژ / طبقه)</th>
                  <th className="px-6 py-4">مالک (Owner ID)</th>
                  <th className="px-6 py-4 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                          <Store size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{store.name}</div>
                          <div className="text-[10px] text-gray-400 tracking-wider mt-0.5">{store.tagline || '---'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 font-medium text-xs">
                        <MapPin size={14} className="text-gray-400" />
                        {store.malls?.name || 'نامشخص'}
                        <span className="text-gray-300 mx-1">|</span>
                        طبقه {store.floor_level}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-md inline-block" dir="ltr">
                        {store.owner_id ? store.owner_id.substring(0, 8) + '...' : 'System'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="تایید فروشگاه">
                          <ShieldCheck size={18} />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="تعلیق">
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