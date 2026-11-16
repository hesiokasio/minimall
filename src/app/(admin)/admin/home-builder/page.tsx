'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutTemplate, Plus, ArrowUp, ArrowDown, Eye, EyeOff, 
  Edit2, Trash2, Globe, Image as ImageIcon, X, Link as LinkIcon, DollarSign, Type, Upload, Loader2
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

const SECTION_TYPES = [
  { label: 'بنر تمام‌عرض (Full Banner)', value: 'full_banner' },
  { label: 'بنرهای شبکه‌ای (Bento Grid)', value: 'bento_grid' },
  { label: 'اسلایدر محصولات (Products)', value: 'product_carousel' },
  { label: 'بوتیک‌های ویژه (Boutiques)', value: 'store_carousel' }
];

export default function HomePageBuilder() {
  const supabase = createClient();
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  const fetchSections = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('home_sections')
      .select(`
        id, title, type, sort_order, is_active, is_published,
        items:home_section_items(id, image_url, title, target_link)
      `)
      // 🔴 دو خط eq را از اینجا حذف کردیم تا همه سکشن‌ها (منتشر شده و درفت) نمایش داده شوند
      .order('sort_order', { ascending: true });

    if (data) {
      const formattedData = data.map(sec => ({
        id: sec.id,
        name: sec.title || '', 
        type: sec.type || 'full_banner',
        order: sec.sort_order || 1,
        isVisible: sec.is_active !== false, 
        isPublished: sec.is_published === true, 
        updatedAt: new Date().toISOString().split('T')[0],
        items: (sec.items || []).map((item: any) => ({
          id: item.id,
          image: item.image_url || '',
          title: item.title || '',
          price: '', 
          link: item.target_link || ''
        }))
      }));
      setSections(formattedData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const updateOrderInDb = async (newSections: any[]) => {
    const updates = newSections.map((sec, i) => ({
      id: sec.id,
      sort_order: i + 1
    }));
    await supabase.from('home_sections').upsert(updates);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((sec, i) => sec.order = i + 1);
    setSections(newSections);
    updateOrderInDb(newSections);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    newSections.forEach((sec, i) => sec.order = i + 1);
    setSections(newSections);
    updateOrderInDb(newSections);
  };

  // 🔴 ذخیره وضعیت دکمه چشم مستقیماً در ستون is_active
  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setSections(sections.map(s => s.id === id ? { ...s, isVisible: newStatus } : s));
    await supabase.from('home_sections').update({ is_active: newStatus }).eq('id', id);
  };

  // 🔴 ذخیره وضعیت کره زمین در ستون is_published
  const togglePublish = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setSections(sections.map(s => s.id === id ? { ...s, isPublished: newStatus } : s));
    await supabase.from('home_sections').update({ is_published: newStatus }).eq('id', id);
  };

  const deleteSection = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this section?')) {
      setSections(sections.filter(s => s.id !== id));
      await supabase.from('home_section_items').delete().eq('section_id', id);
      await supabase.from('home_sections').delete().eq('id', id);
    }
  };

  const handleAddNew = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (section: any) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleSaveSection = async (savedSection: any) => {
    const isEdit = !!editingSection;
    let sectionId = savedSection.id;

    const sectionPayload = {
      title: savedSection.name, 
      type: savedSection.type, 
      is_active: savedSection.isVisible, // 🔴 در زمان ذخیره فرم هم در is_active قرار می‌گیرد
      sort_order: isEdit ? savedSection.order : sections.length + 1
    };

    if (isEdit) {
      await supabase.from('home_sections').update(sectionPayload).eq('id', sectionId);
    } else {
      const { data } = await supabase.from('home_sections').insert([sectionPayload]).select().single();
      if (data) sectionId = data.id;
    }

    if (sectionId) {
      await supabase.from('home_section_items').delete().eq('section_id', sectionId);
      
      if (savedSection.items && savedSection.items.length > 0) {
        const itemsToInsert = savedSection.items.map((item: any) => ({
          section_id: sectionId,
          image_url: item.image,
          title: item.title,
          target_link: item.link
        }));
        await supabase.from('home_section_items').insert(itemsToInsert);
      }
    }

    fetchSections();
    setIsModalOpen(false);
  };

  const publishedCount = sections.filter(s => s.isPublished).length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6" dir="ltr">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Home Page Builder</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live CMS
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">Configure layout blocks, banners, and product grids for the customer storefront.</p>
        </div>
        <button onClick={handleAddNew} className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl shadow-sm">
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Total Blocks</div>
          <div className="text-2xl font-semibold text-zinc-900">
            {isLoading ? <div className="w-8 h-8 bg-zinc-200 rounded animate-pulse" /> : sections.length}
          </div>
        </div>
        <div className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl shadow-sm">
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Published on Site</div>
          <div className="text-2xl font-semibold text-zinc-900">
            {isLoading ? <div className="w-8 h-8 bg-zinc-200 rounded animate-pulse" /> : publishedCount}
          </div>
        </div>
        <div className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl shadow-sm">
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Drafts</div>
          <div className="text-2xl font-semibold text-amber-600">
            {isLoading ? <div className="w-8 h-8 bg-amber-200/50 rounded animate-pulse" /> : (sections.length - publishedCount)}
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-zinc-400" /> Storefront Layout Structure
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-60">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
            <span className="text-sm font-medium text-zinc-500">Loading layout blocks...</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {sections.length === 0 ? (
              <div className="px-5 py-12 text-center text-zinc-500 text-sm">No sections found. Add one to start building.</div>
            ) : (
              sections.map((section, index) => {
                const typeLabel = SECTION_TYPES.find(t => t.value === section.type)?.label || section.type;

                return (
                  <div key={section.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveUp(index)} disabled={index === 0} className="p-0.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveDown(index)} disabled={index === sections.length - 1} className="p-0.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ArrowDown className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-600 shrink-0">{section.order}</div>
                      <div>
                        <div className="font-semibold text-zinc-900 text-[14px] flex items-center gap-2">
                          {section.name}
                          {!section.isPublished && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">Draft</span>}
                        </div>
                        <div className="text-[12px] text-zinc-500 mt-0.5 flex items-center gap-2">
                          <span>Type: {typeLabel}</span><span>•</span>
                          <span>Items: {section.items?.length || 0}</span><span>•</span>
                          <span>Updated: {section.updatedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* 🟢 سمت راست: کنترلرهای مینیمال (Published / Unpublished) */}
                      <div className="flex items-center gap-4">
                        
                        {/* ۱. سوئیچ کشویی مدرن برای پابلیش */}
                        <div className="flex items-center gap-2" title={section.isPublished ? "Currently published on site" : "Unpublished (Hidden)"}>
                          <span className={`text-[10px] font-bold uppercase tracking-wider min-w-[85px] text-right ${section.isPublished ? 'text-emerald-600' : 'text-zinc-400'}`}>
                            {section.isPublished ? 'Published' : 'Unpublished'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePublish(section.id, section.isPublished)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${section.isPublished ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${section.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        <div className="w-px h-6 bg-zinc-200"></div>

                        {/* ۲. دکمه‌های ثانویه (ویرایش، حذف) */}
                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(section)} title="Edit Content" className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteSection(section.id)} title="Delete Section" className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                      </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {isModalOpen && <SectionModal supabase={supabase} onClose={() => setIsModalOpen(false)} onSave={handleSaveSection} editData={editingSection} />}
    </div>
  );
}

/* ---------------------------------------------------------
   SECTION MODAL
--------------------------------------------------------- */
function SectionModal({ supabase, onClose, onSave, editData }: any) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    type: SECTION_TYPES[0].value,
    isVisible: true,
  });

  const [items, setItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<any>(null);

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        name: editData.name,
        type: editData.type,
        isVisible: editData.isVisible,
      });
      setItems(editData.items || []);
    } else {
      setItems([{ id: Date.now(), image: '', title: '', price: '', link: '' }]);
    }
  }, [editData]);

  const handleItemChange = (id: number, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), image: '', title: '', price: '', link: '' }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUploadImage = async (id: number, file: File) => {
    setUploadingId(id);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('banners').upload(fileName, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(fileName);
      handleItemChange(id, 'image', publicUrl);

    } catch (error) {
      console.error(error);
      alert('خطا در آپلود تصویر در سرور');
    }
    setUploadingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSubmitting(true);
    await onSave({ ...form, items });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-semibold text-zinc-900">
            {editData ? 'Edit Layout Section' : 'Add New Layout Section'}
          </h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="section-form" onSubmit={handleSubmit} className="space-y-5 text-sm">
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">Internal Name <span className="text-rose-500">*</span></label>
                <input type="text" required placeholder="e.g. Winter Collection Banner" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">Section Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900 text-[13px]">
                    {SECTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">Initial Status</label>
                  <select value={form.isVisible ? 'visible' : 'hidden'} onChange={(e) => setForm({ ...form, isVisible: e.target.value === 'visible' })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900 text-[13px]">
                    <option value="visible">Visible (Active)</option>
                    <option value="hidden">Hidden (Draft)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[12px] font-medium text-zinc-700">Section Content (Images & Details)</label>
                <button type="button" onClick={addItem} className="text-[11px] font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Content Item
                </button>
              </div>

              <div className="space-y-4">
                {items.length === 0 && (
                  <div className="text-center text-[12px] text-zinc-400 py-4 border border-dashed border-zinc-200 rounded-lg">No items added. Click "Add Content Item" to start.</div>
                )}
                
                {items.map((item, index) => (
                  <div key={item.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl relative group">
                    <button type="button" onClick={() => removeItem(item.id)} className="absolute -top-2.5 -right-2.5 bg-white border border-zinc-200 text-rose-500 p-1.5 rounded-full shadow-sm hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all z-10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-zinc-200 shrink-0 flex items-center justify-center bg-white overflow-hidden shadow-sm">
                          {item.image ? (
                            <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-zinc-300" />
                          )}
                        </div>
                        <div className="relative flex-1">
                          <input type="text" placeholder="Image URL or Upload..." value={item.image} onChange={(e) => handleItemChange(item.id, 'image', e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px] bg-white" />
                        </div>
                        <div className="relative shrink-0">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadImage(item.id, file);
                            }}
                            disabled={uploadingId === item.id}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <button type="button" disabled={uploadingId === item.id} className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50">
                            {uploadingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            {uploadingId === item.id ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input type="text" placeholder="Title or Description" value={item.title} onChange={(e) => handleItemChange(item.id, 'title', e.target.value)} className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px] bg-white" />
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input type="text" placeholder="Price (Optional)" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px] bg-white" />
                        </div>
                      </div>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input type="text" placeholder="Target Link URL (/category/...)" value={item.link} onChange={(e) => handleItemChange(item.id, 'link', e.target.value)} className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px] bg-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 bg-white flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-zinc-200 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">Cancel</button>
          <button type="submit" form="section-form" disabled={isSubmitting} className="px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-[13px] font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editData ? 'Save Changes' : 'Add Section')}
          </button>
        </div>

      </div>
    </div>
  );
}