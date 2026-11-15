'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus, Search, Store, Trash2, CheckCircle2, 
  XCircle, Eye, Package, ChevronDown, Loader2, X, AlertTriangle
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
  const [isLoading, setIsLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0
  });

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState(preselectedStoreId || 'all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        productsRes, 
        storesRes, 
        activeCountRes,
        lowStockCountRes,
        outOfStockCountRes
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
        supabase.from('stores').select('id, name'),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('products').select('id', { count: 'exact', head: true }).lt('stock', 10).gt('stock', 0),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('stock', 0)
      ]);

      setStats({
        total: productsRes.count || 0,
        active: activeCountRes.count || 0,
        lowStock: lowStockCountRes.count || 0,
        outOfStock: outOfStockCountRes.count || 0
      });

      setProducts(productsRes.data || []);
      setStores(storesRes.data || []);
    } catch (error) {
      console.error('Error fetching products data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, storeFilter, categoryFilter, sortOption]);

  // Actions
  const updateProductStatus = async (productId: string, newStatus: string) => {
    const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', productId);
    if (!error) {
      setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus } : p));
      fetchData(); 
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) {
        setProducts(products.filter(p => p.id !== productId));
        fetchData();
      } else {
        alert('Error deleting product. Check database permissions.');
      }
    }
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((prod) => {
      const matchesSearch = 
        (prod.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (prod.sku?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prod.status === statusFilter;
      const matchesStore = storeFilter === 'all' || prod.store_id === storeFilter;
      const matchesCategory = categoryFilter === 'all' || prod.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesStore && matchesCategory;
    });

    switch (sortOption) {
      case 'price-desc':
        return result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      case 'price-asc':
        return result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      case 'stock-asc':
        return result.sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
      case 'oldest':
        return result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'newest':
      default:
        return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [products, searchQuery, statusFilter, storeFilter, categoryFilter, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-64 bg-zinc-200 rounded-lg" />
        <div className="grid grid-cols-4 gap-4"><div className="h-24 bg-white border border-zinc-200 rounded-xl col-span-4" /></div>
        <div className="h-96 w-full bg-white border border-zinc-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
            Catalog & Products
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage global inventory, pricing, SKUs, and product visibility across all stores.
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          className="p-4 sm:p-5 bg-zinc-900 text-white rounded-xl shadow-sm cursor-pointer hover:bg-zinc-800 transition-colors"
          onClick={() => setStatusFilter('all')}
        >
          <div className="text-[11px] font-medium text-zinc-400 mb-1.5">Total Products</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
        <div 
          className={`p-4 sm:p-5 bg-white border ${statusFilter === 'active' ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'} rounded-xl transition-all cursor-pointer`} 
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Active & Visible</div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.active}</div>
        </div>
        <div 
          className="p-4 sm:p-5 bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm rounded-xl transition-all"
        >
          <div className="text-[11px] font-medium text-amber-600 mb-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Low Stock Warning
          </div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.lowStock}</div>
        </div>
        <div 
          className="p-4 sm:p-5 bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm rounded-xl transition-all"
        >
          <div className="text-[11px] font-medium text-rose-600 mb-1.5 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Out of Stock
          </div>
          <div className="text-2xl font-semibold text-rose-600">{stats.outOfStock}</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by product name or SKU code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors bg-zinc-50/50"
            />
          </div>

          <div className="relative">
            <select 
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700 truncate"
            >
              <option value="all">All Stores</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700 truncate"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Sort and Results Count */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <span className="text-[13px] text-zinc-500">
            Showing <strong className="text-zinc-900 font-semibold">{filteredProducts.length}</strong> of <strong className="text-zinc-900 font-semibold">{stats.total}</strong> products
          </span>
          
          <div className="relative w-48">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-1.5 text-[13px] border border-zinc-200 rounded-md focus:outline-none bg-white text-zinc-700 font-medium"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price-desc">Sort: Price (High-Low)</option>
              <option value="price-asc">Sort: Price (Low-High)</option>
              <option value="stock-asc">Sort: Lowest Stock</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="px-5 py-4 w-[320px]">Product & SKU</th>
                <th className="px-5 py-4">Store & Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock Level</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-zinc-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => {
                  const storeName = stores.find(s => s.id === prod.store_id)?.name || 'Unknown Store';
                  const isLowStock = prod.stock > 0 && prod.stock < 10;
                  const isOutOfStock = prod.stock === 0;

                  return (
                    <tr key={prod.id} className="hover:bg-zinc-50/50 transition-colors group">
                      
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {prod.image_url || prod.image ? (
                              <img src={prod.image_url || prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900 truncate">{prod.name}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 truncate font-mono">
                              SKU: {prod.sku || `PRD-${prod.id.split('-')[0].toUpperCase()}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-zinc-900 font-medium text-[13px] flex items-center gap-1.5 truncate">
                          <Store className="w-3.5 h-3.5 text-zinc-400" /> {storeName}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          {prod.category || 'Uncategorized'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-zinc-900 font-medium tracking-tight">
                          ${Number(prod.price || 0).toLocaleString()}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-zinc-900'}`}>
                            {prod.stock || 0}
                          </span>
                          <span className="text-[11px] text-zinc-500">units</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {prod.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/product/${prod.id}`} 
                            target="_blank"
                            title="View in Storefront"
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => updateProductStatus(prod.id, prod.status === 'active' ? 'inactive' : 'active')}
                            title={prod.status === 'active' ? 'Deactivate' : 'Activate'}
                            className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          >
                            {prod.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => deleteProduct(prod.id, prod.name)}
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
            Showing <strong className="text-zinc-900">{filteredProducts.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong className="text-zinc-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</strong> of <strong className="text-zinc-900">{filteredProducts.length}</strong> entries
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
                    currentPage === page 
                      ? 'bg-zinc-900 text-white shadow-sm' 
                      : 'text-zinc-600 hover:bg-zinc-200/50'
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