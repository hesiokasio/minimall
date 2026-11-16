'use client';

import React, { useState } from 'react';
import { Package, X } from 'lucide-react';

const CATEGORIES = [
  'Apparel & Fashion',
  'Beauty & Personal Care',
  'Electronics',
  'Food & Beverage',
  'Home & Living',
  'Jewelry & Watches',
  'Construction & Materials',
  'Sports & Outdoors'
];

export default function AddProductModal({ supabase, stores, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    storeId: stores[0]?.id || '',
    category: CATEGORIES[0],
    price: '',
    stock: 25,
    status: 'active',
    image: '',
    description: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    setSubmitting(true);

    try {
      let finalImageUrl = form.image;

      if (uploadFile) {
        const ext = uploadFile.name.split('.').pop();
        const fileName = `prod-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('banners').upload(fileName, uploadFile);
        if (!upErr) {
          const { data } = supabase.storage.from('banners').getPublicUrl(fileName);
          finalImageUrl = data.publicUrl;
        }
      }

      const fullPayload: any = {
        name: form.name,
        sku: form.sku,
        store_id: form.storeId || null,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        status: form.status,
        image_url: finalImageUrl,
        description: form.description,
      };

      const { error } = await supabase.from('products').insert([fullPayload]);

      if (error) {
        const retry = await supabase.from('products').insert([
          { name: form.name, price: Number(form.price), image_url: finalImageUrl }
        ]);
        if (retry.error) throw retry.error;
      }

      onSuccess(form.name);
    } catch (err: any) {
      alert('Error adding product: ' + (err?.message || 'Database error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Add Catalog Product</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">Register a new SKU and assign it to a tenant store.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Product Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Lumina Reference Monitor"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">SKU Code</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                placeholder="PRM-001"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Assigned Store <span className="text-rose-500">*</span></label>
              <select
                required
                value={form.storeId}
                onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white"
              >
                <option value="">Select Store...</option>
                {stores.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Price <span className="text-rose-500">*</span></label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
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
                <option value="active">Active & Visible</option>
                <option value="inactive">Hidden (Draft)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-2 pt-2">
              <label className="block font-medium text-zinc-700">Product Image (Upload or URL)</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {(uploadFile || form.image) ? (
                    <img src={uploadFile ? URL.createObjectURL(uploadFile) : form.image} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-[11px] text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Or paste an image URL..."
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Product Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                placeholder="Product details, material, dimensions..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700 hover:bg-zinc-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800">
              {submitting ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}