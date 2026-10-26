'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus, Search, Edit2, Trash2, CheckCircle2, 
  XCircle, ChevronDown, Package, Image as ImageIcon, Loader2, X
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

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

export default function ProductsDirectoryPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const preselectedStoreId = searchParams.get('store');

  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [malls, setMalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [mallFilter, setMallFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState(preselectedStoreId || 'all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, storesRes, mallsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('stores').select('id, name, mall_id, brand_name'),
        supabase.from('malls').select('id, name')
      ]);

      setProducts(productsRes.data || []);
      setStores(storesRes.data || []);
      setMalls(mallsRes.data || []);
    } catch (error) {
      console.error('Error fetching products data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset pagination when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, mallFilter, storeFilter, categoryFilter, stockFilter, statusFilter, priceFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setMallFilter('all');
    setStoreFilter('all');
    setCategoryFilter('all');
    setStockFilter('all');
    setStatusFilter('all');
    setPriceFilter('all');
  };

  // Actions
  const toggleProductStatus = async (productId: string, currentStatus: string | boolean) => {
    // پشتیبانی از وضعیت متنی یا boolean
    const isCurrentlyActive = currentStatus === 'active' || currentStatus === true;
    const newStatus = isCurrentlyActive ? 'inactive' : 'active';
    
    const { error } = await supabase.from('products').update({ 
      status: newStatus,
      is_published: !isCurrentlyActive // آپدیت همزمان فیلد قدیمی اگر وجود دارد
    }).eq('id', productId);
    
    if (!error) {
      setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus, is_published: !isCurrentlyActive } : p));
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) {
        setProducts(products.filter(p => p.id !== productId));
      }
    }
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const store = stores.find(s => s.id === product.store_id);
      
      // Text Search
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Store & Mall Filter
      const matchesStore = storeFilter === 'all' || product.store_id === storeFilter;
      const matchesMall = mallFilter === 'all' || store?.mall_id === mallFilter;
      
      // Category Filter
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      // Status Filter
      const isActive = product.status === 'active' || product.is_published === true;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && isActive) || 
        (statusFilter === 'inactive' && !isActive);

      // Stock Filter
      const stock = Number(product.stock || 0);
      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = stock > 10;
      if (stockFilter === 'low_stock') matchesStock = stock > 0 && stock <= 10;
      if (stockFilter === 'out_of_stock') matchesStock = stock === 0;

      // Price Filter
      const price = Number(product.price || 0);
      let matchesPrice = true;
      if (priceFilter === 'under_100') matchesPrice = price < 100;
      if (priceFilter === '100_500') matchesPrice = price >= 100 && price <= 500;
      if (priceFilter === 'over_500') matchesPrice = price > 500;

      return matchesSearch && matchesStore && matchesMall && matchesCategory && matchesStatus && matchesStock && matchesPrice;
    });
  }, [products, stores, searchQuery, mallFilter, storeFilter, categoryFilter, stockFilter, statusFilter, priceFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-64 bg-zinc-200 rounded-lg" />
        <div className="h-32 w-full bg-white border border-zinc-200 rounded-xl" />
        <div className="h-96 w-full bg-white border border-zinc-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
              Products Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-600">
              {products.length} SKUs
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Cross-mall SKU registry, pricing, and store inventory levels.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Advanced Filters Toolbar */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-sm flex flex-col gap-4">
        
        {/* Row 1: Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors bg-zinc-50/50"
            />
          </div>

          <div className="relative">
            <select value={mallFilter} onChange={(e) => setMallFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700 truncate">
              <option value="all">All Malls</option>
              {malls.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700 truncate">
              <option value="all">All Stores</option>
              {stores.filter(s => mallFilter === 'all' || s.mall_id === mallFilter).map(s => (
                <option key={s.id} value={s.id}>{s.name || s.brand_name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700">
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700">
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt;10)</option>
              <option value="low_stock">Low Stock (1-10)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Secondary Filters & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative w-36">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-1.5 text-[13px] border border-zinc-200 rounded-md focus:outline-none bg-zinc-50 text-zinc-700 font-medium">
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
            
            <div className="relative w-40">
              <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-1.5 text-[13px] border border-zinc-200 rounded-md focus:outline-none bg-zinc-50 text-zinc-700 font-medium">
                <option value="all">Price: Any Range</option>
                <option value="under_100">Under $100</option>
                <option value="100_500">$100 - $500</option>
                <option value="over_500">Over $500</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <button onClick={resetFilters} className="text-[13px] font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors">
            Reset Product Filters
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="px-5 py-4 w-[320px]">Product & SKU</th>
                <th className="px-5 py-4">Store & Mall</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Updated</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const store = stores.find(s => s.id === product.store_id);
                  const mall = malls.find(m => m.id === store?.mall_id);
                  const sku = product.sku || `PRD-${product.id.split('-')[0].toUpperCase()}`;
                  
                  const isActive = product.status === 'active' || product.is_published === true;
                  const stockCount = Number(product.stock || 0);
                  const updDate = product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : 'N/A';

                  return (
                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                      
                      {/* Product & SKU */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {product.image_url || product.image ? (
                              <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900 truncate">{product.name}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 font-mono truncate">SKU: {sku}</div>
                          </div>
                        </div>
                      </td>

                      {/* Store & Mall */}
                      <td className="px-5 py-4">
                        <div className="text-zinc-900 font-medium text-[13px] truncate">{store?.name || store?.brand_name || 'Unassigned'}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{mall?.name || 'Unknown Mall'}</div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-zinc-600 text-[13px]">
                        {product.category || 'Uncategorized'}
                      </td>

                      {/* Price (Regular & Sale) */}
                      <td className="px-5 py-4">
                        <div className="text-[13px] font-semibold text-zinc-900">${Number(product.price).toLocaleString()}</div>
                        {product.sale_price && Number(product.sale_price) > 0 && (
                          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                            Sale: ${Number(product.sale_price).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock (Color Coded) */}
                      <td className="px-5 py-4">
                        <span className={`text-[13px] font-medium ${
                          stockCount > 10 ? 'text-zinc-600' : 
                          stockCount > 0 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {stockCount} units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Updated */}
                      <td className="px-5 py-4 text-[13px] text-zinc-500">
                        {updDate}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => toggleProductStatus(product.id, product.status || (product.is_published ? 'active' : 'inactive'))}
                            title={isActive ? 'Deactivate' : 'Activate'}
                            className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          >
                            {isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button title="Edit Product" className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id, product.name)}
                            title="Delete Product"
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="px-5 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-900">{filteredProducts.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong className="text-zinc-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</strong> of <strong className="text-zinc-900">{filteredProducts.length}</strong> products
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1 px-2 font-medium hidden sm:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                    currentPage === page ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-200/50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProductModal 
          supabase={supabase} 
          stores={stores}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchData();
          }}
        />
      )}

    </div>
  );
}


/* ---------------------------------------------------------
   ADD PRODUCT MODAL COMPONENT
--------------------------------------------------------- */
function AddProductModal({ supabase, stores, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    storeId: stores[0]?.id || '',
    category: CATEGORIES[0],
    price: '',
    salePrice: '',
    stock: '100',
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
        const fileName = `product-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('products').upload(fileName, uploadFile);
        if (!upErr) {
          const { data } = supabase.storage.from('products').getPublicUrl(fileName);
          finalImageUrl = data.publicUrl;
        }
      }

      const payload: any = {
        name: form.name,
        sku: form.sku || `PRD-${Math.floor(Math.random() * 10000)}`,
        store_id: form.storeId,
        category: form.category,
        price: Number(form.price),
        sale_price: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock),
        status: form.status,
        is_published: form.status === 'active',
        image_url: finalImageUrl,
        description: form.description,
      };

      const { error } = await supabase.from('products').insert([payload]);
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      alert('Error adding product: ' + (err?.message || 'Database error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Add New Product</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Product Name <span className="text-rose-500">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900" />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">SKU Code</label>
              <input type="text" placeholder="e.g. LUM-MON-27" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Assigned Store <span className="text-rose-500">*</span></label>
              <select required value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white">
                <option value="">Select Store...</option>
                {stores.map((s: any) => <option key={s.id} value={s.id}>{s.name || s.brand_name}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Regular Price ($) <span className="text-rose-500">*</span></label>
              <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Sale Price ($) <span className="text-zinc-400 font-normal">(Optional)</span></label>
              <input type="number" min="0" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg placeholder:text-zinc-300" placeholder="Leave empty if no sale" />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Stock Quantity</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg" />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block font-medium text-zinc-700">Product Image (Upload or URL)</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-zinc-200 shrink-0 flex items-center justify-center bg-zinc-50 overflow-hidden">
                  {uploadFile || form.image ? (
                    <img src={uploadFile ? URL.createObjectURL(uploadFile) : form.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : <ImageIcon className="w-5 h-5 text-zinc-300" />}
                </div>
                <input type="text" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-zinc-200 rounded-lg" />
              </div>
              <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full text-[11px] text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer" />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700 hover:bg-zinc-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 inline-flex items-center gap-1.5">
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}