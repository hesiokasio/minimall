'use client';

import React, { useState, useEffect } from 'react';
import { Store, MapPin, Camera, Building, Hash, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function SettingsPage() {
  const [malls, setMalls] = useState<any[]>([]);
  const [isLoadingMalls, setIsLoadingMalls] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // استیت‌های فرم فروشگاه
  const [brandName, setBrandName] = useState('Promer');
  const [tagline, setTagline] = useState('');
  const [selectedMall, setSelectedMall] = useState('');
  const [floorLevel, setFloorLevel] = useState('1');
  const [unitNumber, setUnitNumber] = useState('');

  useEffect(() => {
    const fetchMalls = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('malls').select('*');
      if (data) {
        setMalls(data);
        if (data.length > 0) setSelectedMall(data[0].id); // انتخاب پیش‌فرض اولین پاساژ
      }
      setIsLoadingMalls(false);
    };
    fetchMalls();
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const supabase = createClient();
    const { error } = await supabase.from('stores').insert([
      {
        brand_name: brandName,
        tagline: tagline,
        mall_id: selectedMall,
        floor_level: parseInt(floorLevel) || 1,
        unit_number: unitNumber,
      }
    ]);

    if (!error) {
      setSuccessMsg('Store deployed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      console.error(error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSaveChanges} className="p-6 md:p-12 max-w-3xl mx-auto w-full pb-32 md:pb-12">
      
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-black/50 mt-1 text-xs md:text-sm">Manage your brand identity and mall location.</p>
      </header>

      {/* پیام موفقیت */}
      {successMsg && (
        <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-green-100">
          <CheckCircle2 size={20} className="text-green-500" />
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

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
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-black/60 mb-2 block">Tagline / Slogan</label>
              <input 
                type="text" 
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Premium Construction Materials"
                className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 px-4 text-sm outline-none transition-all" 
              />
            </div>
          </div>
        </section>

        {/* بخش لوکیشن و طبقه */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-3 block">Location in Mall</h2>
          
          <div className="space-y-4">
            {/* انتخاب پاساژ */}
            <div>
              <label className="text-xs font-semibold text-black/60 mb-2 block">Select Mall</label>
              <div className="relative">
                {isLoadingMalls ? (
                  <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 animate-spin" size={18} />
                ) : (
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                )}
                <select 
                  value={selectedMall}
                  onChange={(e) => setSelectedMall(e.target.value)}
                  disabled={isLoadingMalls}
                  className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none appearance-none transition-all cursor-pointer disabled:opacity-50"
                >
                  {malls.map(mall => (
                    <option key={mall.id} value={mall.id}>{mall.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* طبقه */}
              <div>
                <label className="text-xs font-semibold text-black/60 mb-2 block">Floor Level</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={floorLevel}
                    onChange={(e) => setFloorLevel(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all" 
                  />
                </div>
              </div>

              {/* پلاک */}
              <div>
                <label className="text-xs font-semibold text-black/60 mb-2 block">Unit Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                  <input 
                    type="text" 
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    placeholder="e.g. A-102"
                    className="w-full bg-black/[0.02] border border-transparent focus:border-black/10 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all uppercase" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* دکمه ذخیره (در موبایل به صورت شناور در می‌آید) */}
      <div className="fixed bottom-[88px] left-0 w-full px-6 md:static md:w-auto md:px-0 md:mt-10 z-30">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto md:px-10 bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-black/80 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-black flex items-center justify-center gap-2"
        >
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </div>

    </form>
  );
}