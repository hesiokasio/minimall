'use client';

import React from 'react';
import { Store, MapPin, Camera } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto w-full pb-32 md:pb-12">
      
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-black/50 mt-1 text-xs md:text-sm">Manage your brand identity and mall location.</p>
      </header>

      <div className="space-y-10">
        
        {/* بخش کاور فروشگاه */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-3 block">Storefront Cover</h2>
          <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-black/[0.02] border border-dashed border-black/15 rounded-3xl relative flex flex-col items-center justify-center cursor-pointer hover:bg-black/[0.04] transition-colors overflow-hidden group">
            <Camera size={28} className="text-black/30 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-black/50">Upload Cover Photo</span>
          </div>
        </section>

        {/* بخش اطلاعات پایه‌ای برند */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-3 block">Brand Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-black/60 mb-2 block">Brand Name</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                <input 
                  type="text" 
                  defaultValue="Promer"
                  className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-black/60 mb-2 block">Tagline / Slogan</label>
              <input 
                type="text" 
                placeholder="e.g. Premium Construction Materials"
                className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 px-4 text-sm outline-none transition-all" 
              />
            </div>
          </div>
        </section>

        {/* بخش لوکیشن و طبقه */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-3 block">Location in Mall</h2>
          <div>
            <label className="text-xs font-semibold text-black/60 mb-2 block">Floor Level</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
              <select className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none appearance-none transition-all cursor-pointer">
                <option value="1">Ground Floor (GF)</option>
                <option value="2">First Floor (F1)</option>
                <option value="3">Second Floor (F2)</option>
                <option value="4">Food Court (F3)</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* دکمه ذخیره (در موبایل به صورت شناور در می‌آید) */}
      <div className="fixed bottom-[88px] left-0 w-full px-6 md:static md:w-auto md:px-0 md:mt-10 z-30">
        <button className="w-full md:w-auto md:px-10 bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-black/80 transition-colors shadow-lg active:scale-[0.98]">
          Save Changes
        </button>
      </div>

    </div>
  );
}