'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

interface SellerProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  initialData?: any;
}

const CATEGORIES = [
  'Construction & Tools',
  'Home & Living',
  'Apparel & Fashion',
  'Beauty & Personal Care'
];

export default function SellerProductModal({ isOpen, onClose, onSave, initialData }: SellerProductModalProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: CATEGORIES[0],
    price: '',
    discount_percent: '',
    stock: 25,
    size: '',
    color: '',
    description: '',
  });
  
  const [images, setImages] = useState<{file?: File, preview: string}[]>([]);

  // اگر فروشنده روی دکمه ویرایش (Edit) کلیک کرده باشد، اطلاعات محصول در فرم پر می‌شود
  useEffect(() => {
    if (initialData && isOpen) {
      setForm({
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category || CATEGORIES[0],
        price: initialData.price !== undefined ? String(initialData.price) : '',
        discount_percent: initialData.discount_percent ? String(initialData.discount_percent) : '',
        stock: initialData.stock !== undefined ? Number(initialData.stock) : 25,
        size: initialData.size || '',
        color: initialData.color || '',
        description: initialData.description || '',
      });

      if (Array.isArray(initialData.images) && initialData.images.length > 0) {
        setImages(initialData.images.map((url: string) => ({ preview: url })));
      } else {
        setImages([]);
      }
    } else if (!initialData && isOpen) {
      setForm({
        name: '',
        sku: '',
        category: CATEGORIES[0],
        price: '',
        discount_percent: '',
        stock: 25,
        size: '',
        color: '',
        description: '',
      });
      setImages([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newImageUrl = URL.createObjectURL(file);
      setImages([...images, { file, preview: newImageUrl }]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent, targetStatus: string) => {
    e.preventDefault();
    if (!form.name || !form.sku) return alert('Please fill in the required fields (Name & SKU).');
    
    setIsUploading(true);

    try {
      let finalImageUrl = '';

      if (images.length > 0) {
        if (images[0].file) {
          // اگر عکس جدید از کامپیوتر انتخاب شده باشد، در سوپابیس آپلود می‌شود
          const file = images[0].file;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
          finalImageUrl = urlData.publicUrl;
        } else {
          // اگر در حالت ویرایش باشیم و عکس قبلی دست‌نخورده باشد
          finalImageUrl = images[0].preview;
        }
      }

      onSave({
        id: initialData?.id || `PRD-${Date.now().toString().slice(-4)}`,
        name: form.name,
        sku: form.sku.toUpperCase(),
        category: form.category,
        price: Number(form.price) || 0,
        discount_percent: Number(form.discount_percent) || 0,
        stock: Number(form.stock),
        size: form.size,
        color: form.color,
        description: form.description,
        status: targetStatus,
        image: finalImageUrl
      });
      
      setForm({
        name: '',
        sku: '',
        category: CATEGORIES[0],
        price: '',
        discount_percent: '',
        stock: 25,
        size: '',
        color: '',
        description: '',
      });
      setImages([]);
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass = "w-full h-[38px] px-3 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none transition-colors";

  // محاسبه لحظه‌ای قیمت پس از تخفیف برای نمایش زیر اینپوت
  const numericPrice = Number(form.price) || 0;
  const numericDiscount = Math.min(99, Math.max(0, Number(form.discount_percent) || 0));
  const discountedPreviewPrice = numericDiscount > 0 
    ? Math.round(numericPrice * (1 - numericDiscount / 100)) 
    : numericPrice;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden my-8">
        
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">
            {initialData ? 'Edit Product & Discount' : 'Add Catalog Product'}
          </h2>
          <button onClick={onClose} disabled={isUploading} className="text-zinc-400 hover:text-zinc-700 transition-colors disabled:opacity-50 cursor-pointer">
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
                placeholder="e.g. Promer Tile Adhesive 5kg"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Base SKU Code *</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className={`${inputClass} font-mono`}
                placeholder="PRM-ADH-05"
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

            {/* ردیف ۳ ستونی: قیمت اصلی، درصد تخفیف، و موجودی انبار */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="block font-medium text-zinc-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={form.discount_percent}
                  onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. 20 (Optional)"
                />
                {numericPrice > 0 && numericDiscount > 0 && (
                  <span className="block text-[10px] text-rose-600 font-semibold mt-1">
                    Final: {discountedPreviewPrice.toLocaleString()} Toman (-{numericDiscount}%)
                  </span>
                )}
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
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Size / Dimensions</label>
              <input
                type="text"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className={inputClass}
                placeholder="e.g. 5kg pack"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Color / Finish</label>
              <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Product Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none transition-colors resize-none"
                placeholder="Write product details and specifications..."
              />
            </div>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className={inputClass}
                placeholder="e.g. White"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium text-zinc-700">Product Images</label>
              <span className="text-[10px] text-zinc-400">Max 5 images</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`aspect-square rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center gap-1.5 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-zinc-400 cursor-pointer'}`}
              >
                <UploadCloud className="w-4 h-4 text-zinc-400" />
                <span className="text-[10px] text-zinc-500">Upload</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                  disabled={isUploading}
                />
              </div>

              {images.map((img, index) => (
                <div key={index} className="aspect-square rounded-xl border border-zinc-200 relative group overflow-hidden bg-zinc-100">
                  <img src={img.preview} alt={`upload-${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => !isUploading && removeImage(index)}
                      disabled={isUploading}
                      className="p-1.5 bg-white/20 hover:bg-rose-500 text-white rounded text-[10px] backdrop-blur-sm transition-colors disabled:opacity-50 cursor-pointer"
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
              disabled={isUploading}
              className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={isUploading}
              className="px-4 py-2 rounded-lg border border-zinc-300 font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'active')}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 min-w-[130px] cursor-pointer"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{isUploading ? 'Saving...' : initialData ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}