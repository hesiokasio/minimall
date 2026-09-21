'use client';

import React, { useState, useEffect } from 'react';
import { Building, Hash, Loader2, CheckCircle2, Trash2, Edit2, UploadCloud, X } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function AdminMallsPage() {
  const supabase = createClient();
  
  // استیت‌های فرم
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // فیلدهای فرم
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  
  // مدیریت عکس
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // استیت لیست پاساژها
  const [malls, setMalls] = useState<any[]>([]);
  const [isLoadingMalls, setIsLoadingMalls] = useState(true);

  const fetchMalls = async () => {
    setIsLoadingMalls(true);
    const { data } = await supabase.from('malls').select('*').order('created_at', { ascending: false });
    if (data) setMalls(data);
    setIsLoadingMalls(false);
  };

  useEffect(() => {
    fetchMalls();
  }, []);

  // مدیریت انتخاب فایل تصویر
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // نمایش پیش‌نمایش عکس انتخابی
    }
  };

  // حذف تصویر انتخاب شده از فرم
  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setExistingImageUrl('');
  };

  // دکمه ویرایش (پر کردن فرم با اطلاعات پاساژ)
  const handleEditClick = (mall: any) => {
    setEditingId(mall.id);
    setName(mall.name);
    setTotalFloors(mall.total_floors ? mall.total_floors.toString() : '1');
    setExistingImageUrl(mall.cover_image || '');
    setPreviewUrl(mall.cover_image || '');
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // اسکرول نرم به بالای صفحه
  };

  // لغو ویرایش و خالی کردن فرم
  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setTotalFloors('');
    handleClearImage();
  };

  // تابع ذخیره (ایجاد جدید یا ویرایش قبلی)
  // تابع ذخیره (ایجاد جدید یا ویرایش قبلی)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    let finalImageUrl = existingImageUrl;

    // ۱. اگر فایل جدیدی انتخاب شده باشد، ابتدا آن را آپلود می‌کنیم
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('malls')
        .upload(`covers/${fileName}`, selectedFile);

      if (uploadError) {
        alert('خطا در آپلود عکس: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      
      // گرفتن لینک معتبر با پشتیبانی از تمامی نسخه‌های سوپابیس
      const response = supabase.storage.from('malls').getPublicUrl(`covers/${fileName}`);
      finalImageUrl = response.data?.publicUrl || (response as any).publicURL || null;
    }

    const payload = {
      name: name,
      total_floors: parseInt(totalFloors) || 1,
      cover_image: finalImageUrl,
    };

    // ۲. تصمیم‌گیری برای آپدیت یا اینسرت
    if (editingId) {
      // استفاده از select برای اطمینان از اینکه دیتابیس واقعاً ردیف را آپدیت کرده است
      const { data, error } = await supabase.from('malls').update(payload).eq('id', editingId).select();
      
      if (error) {
        alert('خطای دیتابیس در ویرایش: ' + error.message);
      } else if (data && data.length === 0) {
        alert('خطای دسترسی! دیتابیس اجازه آپدیت نمی‌دهد. باید RLS جدول malls را چک کنید.');
      } else {
        setSuccessMsg(`تغییرات پاساژ "${name}" با موفقیت ذخیره شد.`);
        handleCancelEdit();
      }
    } else {
      const { error } = await supabase.from('malls').insert([payload]);
      if (!error) {
        setSuccessMsg(`پاساژ "${name}" با موفقیت ثبت شد.`);
        handleCancelEdit();
      } else {
        alert('خطای دیتابیس در ثبت: ' + error.message);
      }
    }
    
    fetchMalls(); // رفرش لیست
    setIsSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteMall = async (id: string, mallName: string) => {
    if (!window.confirm(`آیا از حذف پاساژ "${mallName}" مطمئن هستید؟`)) return;
    const { error } = await supabase.from('malls').delete().eq('id', id);
    if (!error) {
      setMalls(malls.filter(mall => mall.id !== id));
      if (editingId === id) handleCancelEdit(); // اگر در حال ویرایش بودیم، فرم بسته شود
    } else alert('خطا در حذف!');
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full" dir="rtl">
      
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">مدیریت پاساژها</h1>
        <p className="text-gray-500 mt-2 text-sm">ثبت، ویرایش و مدیریت مراکز خرید در پلتفرم.</p>
      </header>

      {successMsg && (
        <div className="mb-8 p-4 bg-black text-white rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

      {/* فرم ثبت / ویرایش */}
      <div className={`bg-white border shadow-sm rounded-3xl p-8 mb-8 transition-colors duration-500 ${editingId ? 'border-blue-200 shadow-blue-50' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xs font-bold uppercase tracking-widest block ${editingId ? 'text-blue-500' : 'text-gray-400'}`}>
            {editingId ? `در حال ویرایش: ${name}` : 'ثبت پاساژ جدید'}
          </h2>
          {editingId && (
            <button onClick={handleCancelEdit} className="text-xs text-gray-400 hover:text-black flex items-center gap-1 font-bold">
              لغو ویرایش <X size={14} />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">نام مرکز خرید</label>
              <div className="relative">
                <Building className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلا: مجتمع تجاری رویال"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">تعداد طبقات تجاری</label>
              <div className="relative">
                <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" min="1" required value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} placeholder="مثلا: 5"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-sm font-medium outline-none transition-all text-left" dir="ltr"
                />
              </div>
            </div>

          </div>

          {/* فیلد آپلود عکس کاور */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-2 block">تصویر کاور پاساژ</label>
            
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="mb-2 text-gray-400" size={24} />
                  <p className="mb-1 text-sm text-gray-500 font-bold">برای انتخاب عکس کلیک کنید</p>
                  <p className="text-xs text-gray-400">PNG, JPG (پیشنهادی: افقی)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="relative w-full h-48 md:w-1/2 rounded-2xl overflow-hidden border border-gray-100 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={handleClearImage} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Trash2 size={14} /> حذف عکس
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" disabled={isSubmitting}
              className={`w-full md:w-auto px-10 py-4 text-white rounded-2xl font-bold text-sm shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'}`}
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> در حال پردازش...</> : (editingId ? 'ذخیره تغییرات' : 'ثبت در دیتابیس')}
            </button>
          </div>
        </form>
      </div>

      {/* لیست پاساژها */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block">پاساژهای فعال ({malls.length})</h2>

        {isLoadingMalls ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-300" size={32} /></div>
        ) : malls.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            هنوز پاساژی ثبت نکرده‌اید.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {malls.map((mall) => (
              <div key={mall.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-gray-200 transition-all">
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden border border-black/5">
                    {mall.cover_image ? (
                      <img src={mall.cover_image} alt={mall.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Building size={20} /></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{mall.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-medium">
                      <span><Hash size={12} className="inline mr-1"/> {mall.total_floors} طبقه</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEditClick(mall)}
                    className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="ویرایش پاساژ"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteMall(mall.id, mall.name)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="حذف پاساژ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}