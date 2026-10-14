'use client';

import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Plus, Loader2, Search, X, Trash2, Package, UploadCloud, Link as LinkIcon, Image as ImageIcon, ChevronUp, ChevronDown, Edit2, Type, Check, XCircle } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function HomeBuilderPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('product_carousel');

  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [sectionItems, setSectionItems] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [targetLink, setTargetLink] = useState('');
  const [bannerTitle, setBannerTitle] = useState(''); 
  const [isUploading, setIsUploading] = useState(false);

  // استیت‌های ویرایش سریع آیتم
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemData, setEditItemData] = useState({ title: '', link: '' });
  const [editUploadFile, setEditUploadFile] = useState<File | null>(null); // 🔴 استیت جدید برای عکس جایگزین
  const [isItemUpdating, setIsItemUpdating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const { data } = await supabase.from('products').select('id, name, price, image_url').ilike('name', `%${searchQuery}%`).limit(10);
        if (data) setSearchResults(data);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSections = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('home_sections').select('*').order('sort_order', { ascending: true });
    if (data) setSections(data);
    setIsLoading(false); 
  };

  const fetchSectionItems = async (sectionId: string) => {
    const { data } = await supabase.from('home_section_items').select('id, products(*), image_url, target_link, title').eq('section_id', sectionId);
    if (data) setSectionItems(data);
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('home_sections').insert([{ title, type, sort_order: sections.length + 1 }]);
    if (!error) {
      setTitle('');
      fetchSections();
    }
    setIsSubmitting(false);
  };

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const currentSec = newSections[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const swapSec = newSections[swapIndex];

    newSections[index] = swapSec;
    newSections[swapIndex] = currentSec;

    const tempSort = currentSec.sort_order;
    currentSec.sort_order = swapSec.sort_order;
    swapSec.sort_order = tempSort;

    setSections(newSections);

    await supabase.from('home_sections').update({ sort_order: currentSec.sort_order }).eq('id', currentSec.id);
    await supabase.from('home_sections').update({ sort_order: swapSec.sort_order }).eq('id', swapSec.id);
  };

  const deleteSection = async (id: string, sectionTitle: string) => {
    if (!window.confirm(`آیا از حذف ردیف "${sectionTitle}" مطمئن هستید؟`)) return;
    setSections(sections.filter(s => s.id !== id));
    await supabase.from('home_section_items').delete().eq('section_id', id);
    await supabase.from('home_sections').delete().eq('id', id);
  };

  const handleSectionTitleChange = async (newTitle: string) => {
    setEditingSection({ ...editingSection, title: newTitle });
    setSections(sections.map(s => s.id === editingSection.id ? { ...s, title: newTitle } : s));
  };
  
  const saveSectionTitleToDB = async () => {
    if (!editingSection?.title) return;
    await supabase.from('home_sections').update({ title: editingSection.title }).eq('id', editingSection.id);
  };

  const startEditingItem = (item: any) => {
    setEditingItemId(item.id);
    setEditUploadFile(null); // ریست کردن عکس هنگام باز شدن ویرایش
    setEditItemData({
      title: item.title || item.products?.name || '',
      link: item.target_link || ''
    });
  };

  // === 🔴 تابع جدید ویرایش آیتم شامل جایگزینی تصویر ===
  const saveItemEdit = async (id: string, currentImageUrl: string) => {
    setIsItemUpdating(true);
    try {
      let finalImageUrl = currentImageUrl;

      // اگر کاربر عکس جدیدی انتخاب کرده بود، اول آن را آپلود می‌کنیم
      if (editUploadFile) {
        const fileExt = editUploadFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('banners').upload(fileName, editUploadFile);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }

      // آپدیت کردن اطلاعات در دیتابیس
      await supabase.from('home_section_items').update({
        title: editItemData.title,
        target_link: editItemData.link,
        image_url: finalImageUrl
      }).eq('id', id);

      setEditingItemId(null);
      setEditUploadFile(null);
      fetchSectionItems(editingSection.id);

    } catch (error) {
      alert('خطا در ذخیره تغییرات');
    } finally {
      setIsItemUpdating(false);
    }
  };

  const openEditor = (section: any) => {
    setEditingSection(section);
    setSearchQuery('');
    setSearchResults([]);
    setUploadFile(null);
    setTargetLink('');
    setBannerTitle('');
    setEditingItemId(null);
    fetchSectionItems(section.id);
  };

  const handleSearch = (query: string) => setSearchQuery(query);

  const addProductToSection = async (product: any) => {
    if (sectionItems.some(item => item.products?.id === product.id)) {
      alert('این محصول قبلاً اضافه شده است!'); return;
    }
    await supabase.from('home_section_items').insert([{ section_id: editingSection.id, product_id: product.id }]);
    fetchSectionItems(editingSection.id);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setIsUploading(true);
    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('banners').upload(fileName, uploadFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('home_section_items').insert([
        { section_id: editingSection.id, image_url: publicUrl, target_link: targetLink, title: bannerTitle }
      ]);
      if (dbError) throw dbError;

      setUploadFile(null);
      setTargetLink('');
      setBannerTitle('');
      fetchSectionItems(editingSection.id);
    } catch (error) {
      alert('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const removeItemFromSection = async (itemId: string) => {
    await supabase.from('home_section_items').delete().eq('id', itemId);
    fetchSectionItems(editingSection.id);
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto w-full font-sans" dir="rtl">
      
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
          <LayoutTemplate size={32} /> چیدمان صفحه اصلی
        </h1>
        <p className="text-gray-500 mt-2 text-sm">ساخت و مدیریت ساختار ویترین پلتفرم.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block">ساخت ردیف جدید</h2>
          <form onSubmit={handleAddSection} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">عنوان ردیف (نمایش در سایت)</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلا: Trending Right Now" className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all text-left" dir="ltr" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">نوع چیدمان</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all cursor-pointer text-left" dir="ltr">
                <option value="product_carousel">اسلایدر محصولات (Products)</option>
                <option value="full_banner">بنر تمام‌عرض (Full Banner)</option>
                <option value="bento_grid">بنرهای شبکه‌ای (Bento Grid)</option>
                <option value="store_carousel">بوتیک‌های ویژه (Boutiques)</option>
              </select>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} اضافه کردن
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block">ترتیب نمایش در سایت</h2>
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
          ) : sections.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 text-sm font-medium">هیچ ردیفی نساخته‌اید.</div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-gray-300 transition-colors gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-sm font-black text-gray-400 border border-gray-100 shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 tracking-tight" dir="ltr">{section.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em]">{section.type}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 pt-4 sm:pt-0">
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 mr-2">
                    <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent" title="انتقال به بالا">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent" title="انتقال به پایین">
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <button onClick={() => deleteSection(section.id, section.title)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="حذف ردیف">
                    <Trash2 size={16} />
                  </button>

                  <button onClick={() => openEditor(section)} className="text-xs bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shrink-0 flex items-center gap-2">
                    <Edit2 size={14} /> تنظیمات و محتوا
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* مدال مدیریت محتوا */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
              <div className="w-full sm:w-auto flex-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 block">نام ردیف (قابل ویرایش)</label>
                <input 
                  type="text" 
                  value={editingSection.title}
                  onChange={(e) => handleSectionTitleChange(e.target.value)}
                  onBlur={saveSectionTitleToDB}
                  className="text-xl font-black text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-black outline-none w-full max-w-xs pb-1 transition-colors"
                  dir="ltr"
                />
              </div>
              <button onClick={() => setEditingSection(null)} className="p-3 bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 rounded-full transition-colors active:scale-95 shrink-0 shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10">
              
              {editingSection.type === 'product_carousel' ? (
                <div className="relative z-20">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">جستجو در انبار محصولات</label>
                  <div className="relative">
                    <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="نام محصول را تایپ کنید..." className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-gray-300 rounded-2xl py-4 pr-12 pl-4 text-sm font-medium outline-none transition-all shadow-sm" />
                    {isSearching && <Loader2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                      {searchResults.map(prod => (
                        <div key={prod.id} className="flex items-center justify-between p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0">
                              {prod.image_url ? <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" /> : <Package className="absolute inset-0 m-auto text-gray-300" />}
                            </div>
                            <div><p className="text-sm font-bold text-gray-900">{prod.name}</p></div>
                          </div>
                          <button onClick={() => addProductToSection(prod)} className="text-xs font-bold bg-black text-white px-4 py-2 rounded-xl">افزودن</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddBanner} className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-gray-400" /> افزودن تصویر جدید</h3>
                  <div className="space-y-4">
                    <div>
                      <input type="file" accept="image/*" required onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block flex items-center gap-1"><Type size={14} /> عنوان تصویر (اختیاری)</label>
                      <input type="text" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} placeholder="مثلا: کالکشن پاییزه" className="w-full bg-white border border-gray-200 focus:border-gray-300 rounded-xl py-3 px-4 text-sm outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block flex items-center gap-1"><LinkIcon size={14} /> لینک مقصد (اختیاری)</label>
                      <input type="text" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} placeholder="/products/category-name" className="w-full bg-white border border-gray-200 focus:border-gray-300 rounded-xl py-3 px-4 text-sm outline-none transition-all text-left" dir="ltr" />
                    </div>
                    <button type="submit" disabled={!uploadFile || isUploading} className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />} آپلود تصویر
                    </button>
                  </div>
                </form>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block">محتوای فعلی</label>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{sectionItems.length} آیتم</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {sectionItems.map((item) => (
                    <div key={item.id} className="p-3 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 hover:shadow-sm transition-all group">
                      
                      {editingItemId === item.id ? (
                        // 🔴 فرم ویرایش پیشرفته با قابلیت آپلود مجدد عکس
                        <div className="flex flex-col gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200">
                          
                          {/* نمایش عکس فعلی و دکمه آپلود مجدد */}
                          {!item.product_id && (
                            <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100">
                              <img src={item.image_url} alt="Current" className="w-16 h-16 object-cover rounded-lg" />
                              <div className="flex-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">جایگزینی عکس (اختیاری)</label>
                                <input type="file" accept="image/*" onChange={(e) => setEditUploadFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer" />
                              </div>
                            </div>
                          )}

                          <input type="text" value={editItemData.title} onChange={(e)=>setEditItemData({...editItemData, title: e.target.value})} placeholder="عنوان جدید..." className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-black transition-colors" />
                          <input type="text" value={editItemData.link} onChange={(e)=>setEditItemData({...editItemData, link: e.target.value})} placeholder="لینک جدید..." className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm outline-none text-left focus:border-black transition-colors" dir="ltr" />
                          
                          <div className="flex items-center gap-2 justify-end mt-2">
                            <button onClick={() => setEditingItemId(null)} disabled={isItemUpdating} className="p-2 text-gray-400 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"><XCircle size={20} /></button>
                            <button onClick={() => saveItemEdit(item.id, item.image_url)} disabled={isItemUpdating} className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70">
                              {isItemUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} ذخیره تغییرات
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
                              {(item.products?.image_url || item.image_url) ? (
                                <img src={item.products?.image_url || item.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                              ) : <ImageIcon className="absolute inset-0 m-auto text-gray-300" size={20} />}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-gray-900 truncate pr-1">
                                {item.products?.name || item.title || "بنر بدون عنوان"}
                              </p>
                              {item.target_link && <p className="text-xs text-gray-400 truncate pr-1" dir="ltr">{item.target_link}</p>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditingItem(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => removeItemFromSection(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                  
                  {sectionItems.length === 0 && (
                    <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm font-medium">هیچ آیتمی وجود ندارد.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}