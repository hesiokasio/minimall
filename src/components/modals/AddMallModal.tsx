'use client';

import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';

const MALL_ZONES = [
  'North (شمال شهر)',
  'Center / Bazaar (مرکز و بازار)',
  'West (غرب)',
  'East (شرق)',
  'South (جنوب)',
];

const MALL_CATEGORIES = [
  'Mixed Luxury & Retail (مرکز خرید جامع)',
  'Apparel & Fashion (بورس پوشاک و مد)',
  'Electronics & Mobile (بورس دیجیتال و موبایل)',
  'Construction & Interior (بورس ساختمان و دکوراسیون)',
  'Jewelry & Gold (بورس طلا و جواهر)',
  'Home & Kitchen (بورس لوازم خانگی)',
];

export default function AddMallModal({ supabase, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: '',
    city: 'Tehran',
    zone: MALL_ZONES[0],
    category: MALL_CATEGORIES[0],
    address: '',
    floors: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
    description: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Mall name is required.';
    if (!form.city.trim()) errs.city = 'City is required.';
    if (!form.address.trim()) errs.address = 'Address is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);

    try {
      let finalImageUrl = form.image;

      if (uploadFile) {
        const ext = uploadFile.name.split('.').pop();
        const fileName = `mall-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('banners').upload(fileName, uploadFile);
        if (!upErr) {
          const { data } = supabase.storage.from('banners').getPublicUrl(fileName);
          finalImageUrl = data.publicUrl;
        }
      }

      const payload = {
        name: form.name,
        city: form.city,
        zone: form.zone,
        category: form.category,
        address: form.address,
        floors: Number(form.floors),
        status: form.status,
        image_url: finalImageUrl,
        description: form.description,
      };

      const { error } = await supabase.from('malls').insert([payload]);

      if (error) {
        const retry = await supabase.from('malls').insert([{ name: form.name, image_url: finalImageUrl }]);
        if (retry.error) throw retry.error;
      }

      onSuccess(form.name);
    } catch (err: any) {
      alert('Error saving mall: ' + (err?.message || 'Check database permissions'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Add New Shopping Mall</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">Define location, zone, and specialty category</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Mall Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Palladium Mall / پاساژ پالادیوم"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
              {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Tehran"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
              {errors.city && <p className="text-rose-600 text-[11px] mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                Zone / District (منطقه) <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
              >
                {MALL_ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Primary Category (بورس / کاربری پاساژ) <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
              >
                {MALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Street Address (آدرس دقیق) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Moghaddas Ardebili St, Zafaraniyeh"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
              {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Number of Floors</label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.floors}
                onChange={(e) => setForm({ ...form, floors: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block font-medium text-zinc-700">Cover Image (Upload or URL)</label>
              <div className="flex items-center gap-3">
                <img
                  src={uploadFile ? URL.createObjectURL(uploadFile) : form.image}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-zinc-200 shrink-0"
                />
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-[11px] text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Short Description (Optional)</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief summary about this shopping center..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Saving...' : 'Create Mall'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}