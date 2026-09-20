'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, UploadCloud, X, Tag, CheckCircle2, Loader2, Trash2, Pencil, Eye, EyeOff, CheckSquare } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function ProductsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // استیت جدید برای محصولات انتخاب شده (عملیات گروهی)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // استیت‌های فرم
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // استیت‌های مربوط به ویرایش
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  
  // استیت‌های وضعیت عملیات
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setProducts(data);
    if (error) console.error('Error fetching products:', error);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setProductName('');
    setPrice('');
    setImageFile(null);
    setEditingId(null);
    setCurrentImageUrl(null);
    setIsSheetOpen(false);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setPrice(formatted);
  };

  const openNewProductSheet = () => {
    resetForm();
    setIsSheetOpen(true);
  };

  const openEditSheet = (product: any) => {
    setEditingId(product.id);
    setProductName(product.name);
    setPrice(product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    setCurrentImageUrl(product.image_url);
    setImageFile(null);
    setIsSheetOpen(true);
  };

  // ---------------- توابع عملیات گروهی (Bulk Actions) ----------------

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handleBulkStatus = async (status: boolean) => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_published: status })
        .in('id', selectedIds); // جادوی Supabase برای آپدیت چندتایی

      if (error) throw error;
      
      setSelectedIds([]); // خالی کردن لیست انتخاب‌ها
      fetchProducts(); // رفرش کردن لیست
    } catch (error: any) {
      alert('خطا در تغییر وضعیت گروهی');
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`آیا از حذف ${selectedIds.length} محصول مطمئن هستید؟`)) return;
    setIsLoading(true);
    const supabase = createClient();
    try {
      // ۱. پیدا کردن و حذف عکس‌های این محصولات از سرور
      const productsToDelete = products.filter(p => selectedIds.includes(p.id));
      const fileNames = productsToDelete
        .map(p => p.image_url?.split('/').pop())
        .filter(Boolean) as string[];

      if (fileNames.length > 0) {
        await supabase.storage.from('products').remove(fileNames);
      }

      // ۲. حذف از دیتابیس
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;
      
      setSelectedIds([]);
      fetchProducts();
    } catch (error: any) {
      alert('خطا در حذف گروهی');
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------

  const togglePublishStatus = async (productId: string, currentStatus: boolean) => {
    const supabase = createClient();
    setProducts(products.map(p => p.id === productId ? { ...p, is_published: !currentStatus } : p));
    const { error } = await supabase.from('products').update({ is_published: !currentStatus }).eq('id', productId);
    if (error) {
      alert('خطا در تغییر وضعیت');
      fetchProducts();
    }
  };

  const handleDelete = async (productId: string, imageUrl: string) => {
    if (!window.confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    setIsDeleting(productId);
    const supabase = createClient();
    try {
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) await supabase.storage.from('products').remove([fileName]);
      }
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      
      // اگر محصول در لیست انتخاب‌شده‌ها بود، از آنجا هم پاکش کن
      setSelectedIds(prev => prev.filter(id => id !== productId));
      fetchProducts();
    } catch (error: any) {
      alert('خطا در حذف محصول');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!productName || !price || (!imageFile && !currentImageUrl)) {
      alert('لطفاً نام، قیمت و عکس محصول را وارد کنید!');
      return;
    }

    setIsPublishing(true);
    const supabase = createClient();

    try {
      let finalImageUrl = currentImageUrl;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const numericPrice = Number(price.replace(/,/g, ''));

      if (editingId) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ name: productName, price: numericPrice, image_url: finalImageUrl })
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { data: storeData, error: storeError } = await supabase.from('stores').select('id').limit(1).single();
        if (storeError || !storeData) throw new Error('فروشگاه پیدا نشد!');
        const { error: insertError } = await supabase
          .from('products')
          .insert({
            store_id: storeData.id,
            name: productName,
            price: numericPrice,
            image_url: finalImageUrl,
            is_published: true 
          });
        if (insertError) throw insertError;
      }
      
      resetForm();
      fetchProducts();
    } catch (error: any) {
      alert('خطا در ذخیره محصول: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full relative min-h-screen">
      
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-black/50 mt-1 text-xs md:text-sm">Manage your mall inventory.</p>
        </div>
        <button 
          onClick={openNewProductSheet}
          className="hidden md:flex bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold items-center gap-2 hover:bg-black/80 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full bg-white border border-black/[0.05] rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-black/20 focus:ring-1 focus:ring-black/20 transition-all shadow-sm"
        />
      </div>

      {/* 🔴 نوار ابزار عملیات گروهی (زمانی که محصولی وجود دارد نمایش داده می‌شود) */}
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/[0.02] border border-black/[0.05] p-4 rounded-2xl mb-6 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={products.length > 0 && selectedIds.length === products.length}
              onChange={toggleSelectAll}
              className="w-5 h-5 rounded border-black/20 text-black focus:ring-black cursor-pointer accent-black"
            />
            <span className="text-sm font-bold text-black/70">
              {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select All'}
            </span>
          </label>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleBulkStatus(true)}
                className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-xl hover:bg-green-200 transition-colors flex items-center gap-1.5"
              >
                <Eye size={14} /> Publish Selected
              </button>
              <button 
                onClick={() => handleBulkStatus(false)}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-xl hover:bg-yellow-200 transition-colors flex items-center gap-1.5"
              >
                <EyeOff size={14} /> Draft Selected
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-black/20 mb-4" size={32} />
          <p className="text-sm text-black/50">در حال دریافت محصولات...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-black/10 rounded-3xl bg-black/[0.01]">
          <div className="w-16 h-16 bg-black/[0.04] rounded-full flex items-center justify-center mb-4 text-black/40">
            <Tag size={24} />
          </div>
          <h3 className="text-lg font-bold mb-1">No products yet</h3>
          <p className="text-black/50 text-sm mb-6 text-center max-w-xs">
            Your storefront is currently empty. Add your first product to start selling.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative ${
                selectedIds.includes(product.id) ? 'border-black ring-1 ring-black' : 'border-black/5'
              }`}
            >
              
              {/* 🔴 چک‌باکس انتخاب روی هر کارت */}
              <div className="absolute top-3 left-3 z-10">
                <input 
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => toggleSelection(product.id)}
                  className="w-5 h-5 rounded border-transparent bg-white/90 backdrop-blur-sm text-black focus:ring-black cursor-pointer accent-black shadow-sm"
                />
              </div>

              {/* دکمه‌های عملیات */}
              <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditSheet(product)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-blue-500 rounded-full hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id, product.image_url)}
                  disabled={isDeleting === product.id}
                  className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-50 hover:text-red-600 shadow-sm disabled:opacity-50"
                >
                  {isDeleting === product.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>

              <div className="aspect-[4/3] w-full bg-black/[0.02] relative overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!product.is_published && 'grayscale opacity-60'}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/20"><Tag size={40} /></div>
                )}
              </div>
              
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-black/60 text-sm font-medium">
                    {product.price.toLocaleString()} تومان
                  </p>
                </div>
                
                <button 
                  onClick={() => togglePublishStatus(product.id, product.is_published)}
                  className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors ${
                    product.is_published 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  {product.is_published ? (
                    <><Eye size={12} /> Published</>
                  ) : (
                    <><EyeOff size={12} /> Draft</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={openNewProductSheet}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] z-40 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </button>

      <AnimatePresence>
        {isSheetOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-0 md:top-0 md:w-[450px] md:h-full bg-white z-50 rounded-t-[2.5rem] md:rounded-none shadow-2xl flex flex-col"
            >
              <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mt-4 md:hidden" />
              
              <div className="flex justify-between items-center p-6 border-b border-black/[0.05]">
                <h2 className="text-lg font-bold">{editingId ? 'Edit Product' : 'New Product'}</h2>
                <button onClick={resetForm} className="p-2 bg-black/[0.04] rounded-full text-black/60 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                <div>
                  <label className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2 block">Product Image</label>
                  <label className="w-full aspect-[4/3] bg-black/[0.02] border border-dashed border-black/15 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/[0.04] transition-colors relative overflow-hidden group">
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                    {imageFile ? (
                      <div className="flex flex-col items-center text-green-600">
                        <CheckCircle2 size={32} className="mb-2" />
                        <span className="text-sm font-semibold">عکس جدید انتخاب شد</span>
                      </div>
                    ) : currentImageUrl ? (
                      <div className="relative w-full h-full">
                        <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <UploadCloud size={28} className="text-white mb-2" />
                          <span className="text-sm font-semibold text-white">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} className="text-black/40 mb-2" />
                        <span className="text-sm font-semibold text-black/60">Tap to upload</span>
                      </>
                    )}
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2 block">Name</label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. پودر بندکشی الاستومری" className="w-full bg-black/[0.03] border-none rounded-xl py-3.5 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/10 transition-all" />
                </div>

                <div>
                  <label className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2 block">Price (Toman)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 text-sm font-bold">T</span>
                    <input type="text" value={price} onChange={handlePriceChange} placeholder="0" className="w-full bg-black/[0.03] border-none rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/10 transition-all" />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-black/[0.05] bg-white pb-safe">
                <button onClick={handleSave} disabled={isPublishing} className="w-full flex items-center justify-center bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-black/80 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  {isPublishing ? 'در حال ذخیره...' : (editingId ? 'Save Changes' : 'Save Product')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}