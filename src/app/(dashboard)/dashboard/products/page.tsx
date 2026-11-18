'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Package, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import SellerProductModal from '../../../../components/modals/SellerProductModal';
import { createClient } from '../../../../utils/supabase/client';
import TablePagination from '../../../../components/layout/TablePagination';

const CATEGORIES = ['All Categories', 'Construction & Tools', 'Home & Living', 'Apparel & Fashion', 'Beauty & Personal Care'];

const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, any> = {
    active: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Active' },
    draft: { bg: 'bg-zinc-100 text-zinc-700 border-zinc-200', icon: Edit3, label: 'Draft' },
    out_of_stock: { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertTriangle, label: 'Out of Stock' },
    inactive: { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: XCircle, label: 'Inactive' },
  };
  const cfg = configs[status] || configs.inactive;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap ${cfg.bg}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

export default function SellerProductsPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, itemsPerPage]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        setProducts([]);
        return;
      }

      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id, mall_id')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle();

      if (storeError) {
        console.error('Error fetching store:', storeError.message);
      }

      if (storeData) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error.message);
        } else {
          setProducts(data || []);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Unexpected error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (p.sku?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ۱. ثبت محصول جدید یا ذخیره ویرایش محصول
  const handleSaveProduct = async (productData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return alert('شما وارد نشده‌اید!');

      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id, mall_id')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle();
      
      if (storeError || !storeData) {
        alert('ابتدا باید اطلاعات فروشگاه خود را در بخش تنظیمات ذخیره کنید.');
        return;
      }

      const basePrice = Number(productData.price) || 0;
      const discountPercent = Math.min(99, Math.max(0, Number(productData.discount_percent) || 0));
      const discountPrice = discountPercent > 0 
        ? Math.round(basePrice * (1 - discountPercent / 100)) 
        : null;

      const payload: any = {
        vendor_id: user.id,
        store_id: storeData.id,
        name: productData.name,
        sku: productData.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        category: productData.category || 'Uncategorized',
        price: basePrice,
        discount_percent: discountPercent,
        discount_price: discountPrice,
        stock: Number(productData.stock) || 0,
        size: productData.size || '',
        color: productData.color || '',
        description: productData.description || '',
        status: productData.status || 'active',
        images: productData.image ? [productData.image] : (editingProduct?.images || [])
      };

      if (editingProduct?.id) {
        // حالت ویرایش محصول موجود
        const { data, error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id)
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(products.map(p => p.id === editingProduct.id ? data[0] : p));
        }
      } else {
        // حالت افزودن محصول جدید
        const { data, error } = await supabase
          .from('products')
          .insert([payload])
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setProducts([data[0], ...products]);
        }
      }

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  // ۲. تاگل سوئیچ سریع برای تغییر وضعیت فعال/غیرفعال بودن محصول
  const handleToggleStatus = async (prod: any) => {
    const newStatus = prod.status === 'active' ? 'inactive' : 'active';
    
    // آپدیت آنی در ظاهر جدول
    setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, status: newStatus } : p));

    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', prod.id);

    if (error) {
      alert('خطا در تغییر وضعیت محصول: ' + error.message);
      // برگرداندن به حالت قبل در صورت خطا
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, status: prod.status } : p));
    }
  };

  // ۳. حذف محصول از دیتابیس
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert('Error deleting product.');
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Products Catalog</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80">
              {products.length} SKUs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your store inventory, pricing, discounts, and product listings.
          </p>
        </div>
        
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full h-[38px] pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full h-[38px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:bg-white transition-colors cursor-pointer">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-[38px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:bg-white transition-colors cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[360px]">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
            <p className="text-xs font-medium text-zinc-500">Loading products from database...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-3.5 px-5">Product Details</th>
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Description</th>
                    <th className="py-3.5 px-5">Price (Toman)</th>
                    <th className="py-3.5 px-5">Stock</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 px-5 text-center">
                        <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-zinc-900">No products found</h3>
                        <p className="text-xs text-zinc-500 mt-1">Your catalog is empty or doesn't match the current filters.</p>
                        {(searchQuery || categoryFilter !== 'All Categories' || statusFilter !== 'all') && (
                          <button 
                            onClick={() => { setSearchQuery(''); setCategoryFilter('All Categories'); setStatusFilter('all'); }}
                            className="mt-4 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-lg transition-colors"
                          >
                            Clear Filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-zinc-50/80 transition-colors group">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            {prod.images?.[0] ? (
                              <img 
                                src={prod.images[0]} 
                                alt={prod.name} 
                                className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0 bg-zinc-100" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg border border-zinc-200 shrink-0 bg-zinc-100 flex items-center justify-center text-zinc-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-zinc-900 group-hover:underline cursor-pointer">{prod.name}</div>
                              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">SKU: {prod.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-zinc-600">{prod.category}</td>
                        <td className="py-3 px-5 text-zinc-500 max-w-[160px]">
                          {prod.description ? (
                            <span className="block truncate" title={prod.description}>
                              {prod.description}
                            </span>
                          ) : (
                            <span className="text-zinc-300 italic">No description</span>
                          )}
                        </td>
                        <td className="py-3 px-5 tabular-nums">
                          {Number(prod.discount_percent) > 0 ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-rose-600">
                                  {Number(prod.discount_price || Math.round(prod.price * (1 - prod.discount_percent / 100))).toLocaleString()}
                                </span>
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded">
                                  -{prod.discount_percent}%
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-400 line-through">
                                {Number(prod.price).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold text-zinc-900">
                              {Number(prod.price).toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-5 tabular-nums">
                          <span className={`${prod.stock === 0 ? 'text-rose-600 font-semibold' : prod.stock <= 10 ? 'text-amber-600 font-semibold' : 'text-zinc-700'}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <StatusBadge status={prod.status} />
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {/* ۱. تاگل سوئیچ فعال/غیرفعال کردن محصول به جای آیکون چشم */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(prod)}
                              title={prod.status === 'active' ? 'Active (Click to Deactivate)' : 'Inactive (Click to Activate)'}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                prod.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  prod.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>

                            {/* ۲. دکمه ویرایش (Edit) */}
                            <button 
                              type="button"
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsModalOpen(true);
                              }}
                              title="Edit Product"
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* ۳. دکمه حذف (Delete) */}
                            <button 
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              title="Delete Product"
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              totalItems={filteredProducts.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        )}
      </div>

      <SellerProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }} 
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />

    </div>
  );
}