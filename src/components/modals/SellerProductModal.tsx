'use client';

import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-react';

interface SellerProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

const CATEGORIES = [
  'Construction & Tools',
  'Home & Living',
  'Apparel & Fashion',
  'Beauty & Personal Care'
];

export default function SellerProductModal({ isOpen, onClose, onSave }: SellerProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: CATEGORIES[0],
    price: '',
    stock: 25,
    size: '',
    color: '',
  });
  
  const [images, setImages] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImageUrl = URL.createObjectURL(e.target.files[0]);
      setImages([...images, newImageUrl]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent, targetStatus: string) => {
    e.preventDefault();
    if (!form.name || !form.sku) return alert('Please fill in the required fields (Name & SKU).');
    
    onSave({
      id: `PRD-${Date.now().toString().slice(-4)}`,
      name: form.name,
      sku: form.sku.toUpperCase(),
      category: form.category,
      price: Number(form.price) || 0,
      stock: Number(form.stock),
      size: form.size,
      color: form.color,
      status: targetStatus,
      image: images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=100&q=80'
    });
    
    setForm({ name: '', sku: '', category: CATEGORIES[0], price: '', stock: 25, size: '', color: '' });
    setImages([]);
  };

  // کلاس استاندارد برای همه فیلدها با ارتفاع ثابت 38px
  const inputClass = "w-full h-[38px] px-3 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden my-8">
        
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Add Catalog Product</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Product Title *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="e.g. Concrete Wall Tile 45x45"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Base SKU Code *</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className={`${inputClass} font-mono`}
                placeholder="PRM-TILE-45"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`${inputClass} bg-white`}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Price (Toman) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
                placeholder="e.g. 145000"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Size / Dimensions</label>
              <input
                type="text"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className={inputClass}
                placeholder="e.g. 45x45 cm"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Color / Finish</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className={inputClass}
                placeholder="e.g. Light Blue"
              />
            </div>
          </div>

          {/* بخش آپلود عکس با استایل مینیمال پروژه */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium text-zinc-700">Product Images</label>
              <span className="text-[10px] text-zinc-400">Max 5 images</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-zinc-400" />
                <span className="text-[10px] text-zinc-500">Upload</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {images.map((imgSrc, index) => (
                <div key={index} className="aspect-square rounded-xl border border-zinc-200 relative group overflow-hidden bg-zinc-100">
                  <img src={imgSrc} alt={`upload-${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="p-1.5 bg-white/20 hover:bg-rose-500 text-white rounded text-[10px] backdrop-blur-sm transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              className="px-4 py-2 rounded-lg border border-zinc-300 font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'active')}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}