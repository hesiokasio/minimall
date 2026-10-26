'use client';

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Eye, EyeOff, Edit2, Trash2, 
  Image as ImageIcon, X, Link as LinkIcon, Type, Upload, Loader2, MonitorPlay, MapPin
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client'; // مسیر را چک کنید

// تعریف صفحات و جایگاه‌های استاندارد
const TARGET_PAGES = [
  { label: 'همه صفحات (Global)', value: 'all' },
  { label: 'فقط صفحه اصلی (Home)', value: 'home' },
  { label: 'صفحه محصولات (Shop)', value: 'shop' },
  { label: 'صفحه تسویه حساب (Checkout)', value: 'checkout' }
];

const POSITIONS = [
  { label: 'نوار اطلاع‌رسانی بالا (Top Bar)', value: 'top_bar' },
  { label: 'پاپ‌آپ وسط صفحه (Popup)', value: 'popup' },
  { label: 'بنر شناور گوشه پایین (Floating)', value: 'floating' },
  { label: 'بین سکشن‌ها (Inline)', value: 'inline' }
];

export default function CampaignBannersPage() {
  const supabase = createClient();
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('campaign_banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setBanners(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setBanners(banners.map(b => b.id === id ? { ...b, is_active: newStatus } : b));
    await supabase.from('campaign_banners').update({ is_active: newStatus }).eq('id', id);
  };

  const deleteBanner = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign banner?')) {
      setBanners(banners.filter(b => b.id !== id));
      await supabase.from('campaign_banners').delete().eq('id', id);
    }
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const activeCount = banners.filter(b => b.is_active).length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6" dir="ltr">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Campaign Banners</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1">
              <Megaphone className="w-3 h-3" /> Marketing
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">Manage announcement bars, popups, and promotional floating banners.</p>
        </div>
        <button onClick={handleAddNew} className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl shadow-sm">
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Total Campaigns</div>
          <div className="text-2xl font-semibold text-zinc-900">
            {isLoading ? <div className="w-8 h-8 bg-zinc-200 rounded animate-pulse" /> : banners.length}
          </div>
        </div>
        <div className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl shadow-sm">
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Active Now</div>
          <div className="text-2xl font-semibold text-emerald-600">
            {isLoading ? <div className="w-8 h-8 bg-zinc-200 rounded animate-pulse" /> : activeCount}
          </div>
        </div>
        <div className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl shadow-sm">
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Paused / Drafts</div>
          <div className="text-2xl font-semibold text-amber-600">
            {isLoading ? <div className="w-8 h-8 bg-amber-200/50 rounded animate-pulse" /> : (banners.length - activeCount)}
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
            <MonitorPlay className="w-4 h-4 text-zinc-400" /> Active Placements
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-60">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
            <span className="text-sm font-medium text-zinc-500">Loading campaigns...</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {banners.length === 0 ? (
              <div className="px-5 py-12 text-center text-zinc-500 text-sm">No campaigns found. Create one to start marketing.</div>
            ) : (
              banners.map((banner) => {
                const pageLabel = TARGET_PAGES.find(p => p.value === banner.target_page)?.label || banner.target_page;
                const posLabel = POSITIONS.find(p => p.value === banner.position)?.label || banner.position;

                return (
                  <div key={banner.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                        {banner.image_url ? (
                          <img src={banner.image_url} alt="Campaign" className="w-full h-full object-cover" />
                        ) : (
                          <Megaphone className="w-5 h-5 text-zinc-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900 text-[14px] flex items-center gap-2">
                          {banner.title}
                          {!banner.is_active && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">Paused</span>}
                        </div>
                        <div className="text-[12px] text-zinc-500 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1"><MonitorPlay className="w-3.5 h-3.5" /> {pageLabel}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {posLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleVisibility(banner.id, banner.is_active)} 
                        title={banner.is_active ? 'Pause Campaign' : 'Activate Campaign'} 
                        className={`p-2 rounded-md transition-colors ${banner.is_active ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-amber-600 hover:bg-amber-50 bg-amber-50/50'}`}
                      >
                        {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <div className="w-px h-5 bg-zinc-200 mx-1"></div>
                      <button onClick={() => handleEdit(banner)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteBanner(banner.id)} className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {isModalOpen && <CampaignModal supabase={supabase} onClose={() => setIsModalOpen(false)} onSuccess={fetchBanners} editData={editingBanner} />}
    </div>
  );
}

/* ---------------------------------------------------------
   CAMPAIGN MODAL (WITH POSITIONS & PAGES)
--------------------------------------------------------- */
function CampaignModal({ supabase, onClose, onSuccess, editData }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    target_page: TARGET_PAGES[0].value,
    position: POSITIONS[0].value,
    target_link: '',
    image_url: '',
    is_active: false,
  });

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || '',
        target_page: editData.target_page || TARGET_PAGES[0].value,
        position: editData.position || POSITIONS[0].value,
        target_link: editData.target_link || '',
        image_url: editData.image_url || '',
        is_active: editData.is_active || false,
      });
    }
  }, [editData]);

  const handleUploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `camp-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('banners').upload(fileName, file); // از همان باکت بنرها استفاده میکنیم
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(fileName);
      setForm(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      alert('Error uploading image');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setIsSubmitting(true);

    try {
      if (editData) {
        await supabase.from('campaign_banners').update(form).eq('id', editData.id);
      } else {
        await supabase.from('campaign_banners').insert([form]);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Error saving campaign');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-semibold text-zinc-900">
            {editData ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="campaign-form" onSubmit={handleSubmit} className="space-y-5 text-sm">
            
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">Campaign Internal Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Black Friday 2026 Promo" className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1.5 flex items-center gap-1.5"><MonitorPlay className="w-3.5 h-3.5"/> Target Page</label>
                <select value={form.target_page} onChange={(e) => setForm({...form, target_page: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900 text-[13px]">
                  {TARGET_PAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Display Position</label>
                <select value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900 text-[13px]">
                  {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <label className="block text-[12px] font-medium text-zinc-700 mb-3">Campaign Creative (Image)</label>
              <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                <div className="w-12 h-12 rounded-lg border border-zinc-200 shrink-0 flex items-center justify-center bg-white overflow-hidden shadow-sm">
                  {form.image_url ? <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-zinc-300" />}
                </div>
                <div className="relative flex-1">
                  <input type="text" placeholder="Image URL or Upload..." value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px] bg-white" />
                </div>
                <div className="relative shrink-0">
                  <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleUploadImage(e.target.files[0]); }} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                  <button type="button" disabled={uploading} className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50">
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} {uploading ? '...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">Destination URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input type="text" value={form.target_link} onChange={(e) => setForm({...form, target_link: e.target.value})} placeholder="/collections/sale" className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-[13px]" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer p-3 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-colors">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer" />
                <span className="text-[13px] font-medium text-zinc-700">Activate this campaign immediately after saving</span>
              </label>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 bg-white flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-zinc-200 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">Cancel</button>
          <button type="submit" form="campaign-form" disabled={isSubmitting} className="px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-[13px] font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2">
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editData ? 'Save Changes' : 'Launch Campaign'}
          </button>
        </div>

      </div>
    </div>
  );
}