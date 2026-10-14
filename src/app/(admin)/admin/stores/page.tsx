'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, UploadCloud, Store, Building2, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '../../../../utils/supabase/client'; // مسیر را بر اساس ساختار پوشه خودتان چک کنید

export default function StoresManager() {
  const [stores, setStores] = useState<any[]>([]);
  const [malls, setMalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // فیلدهای فرم (بر اساس ستون‌های دیتابیس شما)
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [selectedMall, setSelectedMall] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    // ۱. دریافت لیست پاساژها برای منوی کشویی
    const { data: mallsData } = await supabase.from('malls').select('id, name');
    if (mallsData) setMalls(mallsData);

    // ۲. دریافت لیست غرفه‌ها به همراه نام پاساژشان
    const { data: storesData } = await supabase
      .from('stores')
      .select('*, malls(name)')
      .order('created_at', { ascending: false });
    
    if (storesData) setStores(storesData);
    setIsLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMall) {
      alert('لطفاً یک پاساژ را انتخاب کنید!');
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMsg('');
    let finalImageUrl = existingImageUrl;

    // آپلود عکس (برای راحتی کار، عکس‌های غرفه را هم در همان باکت malls ولی در پوشه stores ذخیره می‌کنیم)
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `stores/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('malls')
        .upload(fileName, selectedFile);

      if (uploadError) {
        alert('خطا در آپلود عکس: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      
      const response = supabase.storage.from('malls').getPublicUrl(fileName);
      finalImageUrl = response.data?.publicUrl || (response as any).publicURL || null;
    }

    const payload = {
      brand_name: brandName,
      tagline: tagline,
      mall_id: selectedMall,
      cover_image_uri: finalImageUrl,
    };

    if (editingId) {
      const { error } = await supabase.from('stores').update(payload).eq('id', editingId);
      if (!error) {
        setSuccessMsg(`تغییرات غرفه "${brandName}" با موفقیت ذخیره شد.`);
        resetForm();
      } else alert('خطا در ویرایش: ' + error.message);
    } else {
      const { error } = await supabase.from('stores').insert([payload]);
      if (!error) {
        setSuccessMsg(`غرفه "${brandName}" با موفقیت ثبت شد.`);
        resetForm();
      } else alert('خطا در ثبت: ' + error.message);
    }
    
    fetchData();
    setIsSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const resetForm = () => {
    setBrandName('');
    setTagline('');
    setSelectedMall('');
    setSelectedFile(null);
    setExistingImageUrl(null);
    setEditingId(null);
  };

  const handleEdit = (store: any) => {
    setEditingId(store.id);
    setBrandName(store.brand_name || '');
    setTagline(store.tagline || '');
    setSelectedMall(store.mall_id || '');
    setExistingImageUrl(store.cover_image_uri);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-gray-50 min-h-screen font-sans" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Store className="text-blue-600" /> مدیریت غرفه‌ها
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* فرم ثبت/ویرایش */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              {editingId ? `ویرایش غرفه: ${brandName}` : 'ثبت غرفه جدید'}
            </h2>
            
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">نام برند / غرفه</label>
                <input 
                  type="text" 
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="مثلاً: پرومر" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">شعار یا حوزه فعالیت</label>
                <input 
                  type="text" 
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="مثلاً: تولیدکننده چسب کاشی و پودر بندکشی" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">انتخاب پاساژ</label>
                <div className="relative">
                  <Building2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    value={selectedMall}
                    onChange={(e) => setSelectedMall(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    required
                  >
                    <option value="">-- پاساژ را انتخاب کنید --</option>
                    {malls.map(mall => (
                      <option key={mall.id} value={mall.id}>{mall.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">تصویر کاور / لوگو</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <UploadCloud className="text-gray-400" size={24} />
                    <span className="text-xs text-gray-500 font-medium">
                      {selectedFile ? selectedFile.name : 'برای انتخاب عکس کلیک کنید'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'در حال ذخیره...' : 'ثبت در دیتابیس'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="w-full mt-2 bg-gray-100 text-gray-600 rounded-xl py-3 text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* لیست غرفه‌ها */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
              <Store size={20} className="text-gray-400" /> غرفه‌های فعال ({stores.length})
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" size={32} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stores.map(store => (
                  <div key={store.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group bg-gray-50/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      {store.cover_image_uri ? (
                        <Image src={store.cover_image_uri} alt={store.brand_name || 'بدون نام'} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Store size={24} /></div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center overflow-hidden">
                      <h3 className="font-bold text-gray-800 text-sm truncate">{store.brand_name || 'بدون نام'}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{store.tagline || 'بدون شعار'}</p>
                      
                      {/* نمایش نام پاساژ */}
                      <div className="mt-2 flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md w-fit">
                        <Building2 size={10} />
                        {store.malls?.name || 'پاساژ نامشخص'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleEdit(store)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}