'use client';

import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Plus, Loader2 } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function HomeBuilderPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState('product_carousel');

  const supabase = createClient();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const { data } = await supabase
      .from('home_sections')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (data) setSections(data);
    setIsLoading(false);
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('home_sections').insert([
      { title, type, sort_order: sections.length + 1 }
    ]);

    if (!error) {
      setTitle('');
      fetchSections();
    } else {
      alert('خطا در ثبت ردیف');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto w-full" dir="rtl">
      
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
          <LayoutTemplate size={32} />
          چیدمان صفحه اصلی
        </h1>
        <p className="text-gray-500 mt-2 text-sm">ساخت و مدیریت ساختار ویترین پلتفرم.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* فرم ثبت ردیف جدید */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block">ساخت ردیف جدید</h2>
          
          <form onSubmit={handleAddSection} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">عنوان ردیف (نمایش در سایت)</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلا: Trending Right Now"
                className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all text-left" 
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">نوع چیدمان</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all cursor-pointer text-left"
                dir="ltr"
              >
                <option value="product_carousel">اسلایدر محصولات (Products)</option>
                <option value="store_carousel">بوتیک‌های ویژه (Boutiques)</option>
                <option value="bento_grid">بنرهای گرافیکی (Curated)</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              اضافه کردن به صفحه اصلی
            </button>
          </form>
        </div>

        {/* لیست ردیف‌های سایت */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block">ترتیب نمایش در سایت</h2>
          
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
          ) : sections.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 text-sm font-medium">
              هنوز هیچ ردیفی نساخته‌اید. صفحه اصلی شما کاملاً خالی است!
            </div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex items-center justify-between group hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-sm font-black text-gray-400 border border-gray-100">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 tracking-tight" dir="ltr">{section.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em]">{section.type}</p>
                  </div>
                </div>
                <button className="text-xs bg-black/5 hover:bg-black/10 text-black px-5 py-2.5 rounded-xl font-bold transition-colors">
                  مدیریت محتوا
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}