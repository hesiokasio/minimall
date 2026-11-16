'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

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

export default function AddStoreModal({ supabase, malls, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: '',
    mallId: malls[0]?.id || '',
    floor: 1,
    unit: '101',
    category: CATEGORIES[0],
    status: 'active',
    owner: '',
    phone: '',
    email: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);

    try {
      const fullPayload: any = {
        name: form.name,
        brand_name: form.name,
        mall_id: form.mallId || null,
        floor: Number(form.floor),
        unit: form.unit,
        category: form.category,
        status: form.status,
        owner: form.owner,
        phone: form.phone,
        email: form.email,
        description: form.description,
      };

      const { error } = await supabase.from('stores').insert([fullPayload]);

      if (error) {
        const retry = await supabase.from('stores').insert([{ name: form.name, category: form.category }]);
        if (retry.error) throw retry.error;
      }

      onSuccess(form.name);
    } catch (err: any) {
      alert('Error registering store: ' + (err?.message || 'Check database'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Register Store</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Promer Flagship Store"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Assigned Mall</label>
              <select
                value={form.mallId}
                onChange={(e) => setForm({ ...form, mallId: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white"
              >
                <option value="">Select Mall...</option>
                {malls.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Floor</label>
                <input
                  type="number"
                  min="1"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Unit #</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Business Category</label>
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

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Operational Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white"
              >
                <option value="active">Active</option>
                <option value="pending">Pending Approval</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Owner / Manager</label>
              <input
                type="text"
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                placeholder="Manager Name"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0912..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800">
              {submitting ? 'Saving...' : 'Register Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}