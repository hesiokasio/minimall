'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus, Search, Store, Trash2, CheckCircle2, 
  XCircle, Eye, Package, ChevronDown, Clock, Loader2, X
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

export default function StoresDirectoryPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const preselectedMallId = searchParams.get('mall'); 

  const [stores, setStores] = useState<any[]>([]);
  const [malls, setMalls] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mallFilter, setMallFilter] = useState(preselectedMallId || 'all');
  const [sortOption, setSortOption] = useState('name-asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [storesRes, mallsRes, productsRes] = await Promise.all([
        supabase.from('stores').select('*').order('created_at', { ascending: false }),
        supabase.from('malls').select('id, name'),
        supabase.from('products').select('id, store_id, status')
      ]);

      setStores(storesRes.data || []);
      setMalls(mallsRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching stores data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, mallFilter, sortOption]);

  // Actions
  const updateStoreStatus = async (storeId: string, newStatus: string) => {
    const { error } = await supabase.from('stores').update({ status: newStatus }).eq('id', storeId);
    if (!error) {
      setStores(stores.map(s => s.id === storeId ? { ...s, status: newStatus } : s));
    }
  };

  const deleteStore = async (storeId: string, storeName: string) => {
    if (window.confirm(`Are you sure you want to delete "${storeName}"? All its products must be deleted first.`)) {
      const { error } = await supabase.from('stores').delete().eq('id', storeId);
      if (!error) {
        setStores(stores.filter(s => s.id !== storeId));
      } else {
        alert('Error deleting store. Please delete its assigned products first.');
      }
    }
  };

  // Filter and Sort Logic
  const filteredStores = useMemo(() => {
    let result = stores.filter((store) => {
      const matchesSearch = 
        (store.name?.toLowerCase() || store.brand_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        store.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.phone?.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
      const matchesMall = mallFilter === 'all' || store.mall_id === mallFilter;
      
      return matchesSearch && matchesStatus && matchesMall;
    });

    switch (sortOption) {
      case 'newest':
        return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'name-desc':
        return result.sort((a, b) => (b.name || b.brand_name || '').localeCompare(a.name || a.brand_name || ''));
      case 'name-asc':
      default:
        return result.sort((a, b) => (a.name || a.brand_name || '').localeCompare(b.name || b.brand_name || ''));
    }
  }, [stores, searchQuery, statusFilter, mallFilter, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // KPIs
  const stats = useMemo(() => {
    return {
      total: stores.length,
      active: stores.filter(s => s.status === 'active').length,
      inactive: stores.filter(s => s.status === 'inactive' || s.status === 'suspended').length,
      pending: stores.filter(s => s.status === 'pending').length,
    };
  }, [stores]);

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
            Stores Management
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor store approvals, mall floor assignments, primary contacts, and product assortments.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Register Store
        </button>
      </div>

      {/* Summary KPI Cards (Vanguard OS Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-zinc-900 text-white rounded-xl shadow-sm">
          <div className="text-[11px] font-medium text-zinc-400 mb-1.5">Total Stores</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
        <div 
          className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer" 
          onClick={() => setStatusFilter('active')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Active Stores</div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.active}</div>
        </div>
        <div 
          className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer" 
          onClick={() => setStatusFilter('inactive')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Inactive / Suspended</div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.inactive}</div>
        </div>
        <div 
          className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer" 
          onClick={() => setStatusFilter('pending')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Pending Approval</div>
          <div className="text-2xl font-semibold text-amber-600">{stats.pending}</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-sm flex flex-col gap-4">
        
        {/* Row 1: Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search store name, owner, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors bg-zinc-50/50"
            />
          </div>

          <div className="relative">
            <select 
              value={mallFilter}
              onChange={(e) => setMallFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700 truncate"
            >
              <option value="all">All Malls</option>
              {malls.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
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
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative hidden sm:block">
            <select className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700 opacity-60 cursor-not-allowed" disabled>
              <option value="all">Any Product Count</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Sort and Results Count */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <span className="text-[13px] text-zinc-500">
            Showing <strong className="text-zinc-900 font-semibold">{filteredStores.length}</strong> of <strong className="text-zinc-900 font-semibold">{stores.length}</strong> stores
          </span>
          
          <div className="relative w-48">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-1.5 text-[13px] border border-zinc-200 rounded-md focus:outline-none bg-white text-zinc-700 font-medium"
            >
              <option value="name-asc">Sort: Name (A–Z)</option>
              <option value="name-desc">Sort: Name (Z–A)</option>
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="px-5 py-4 w-[280px]">Store</th>
                <th className="px-5 py-4">Mall & Location</th>
                <th className="px-5 py-4">Products (Active/Total)</th>
                <th className="px-5 py-4">Owner & Contact</th>
                <th className="px-5 py-4">Registered / Updated</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {paginatedStores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    No stores found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedStores.map((store) => {
                  const storeName = store.name || store.brand_name || 'Unnamed Store';
                  const mallName = malls.find(m => m.id === store.mall_id)?.name || 'Unassigned';
                  
                  const storeProducts = products.filter(p => p.store_id === store.id);
                  const activeProductsCount = storeProducts.filter(p => p.status === 'active').length;
                  const totalProductsCount = storeProducts.length;

                  const regDate = new Date(store.created_at).toISOString().split('T')[0];
                  const updDate = store.updated_at ? new Date(store.updated_at).toISOString().split('T')[0] : regDate;

                  return (
                    <tr key={store.id} className="hover:bg-zinc-50/50 transition-colors group">
                      
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {store.logo_url || store.cover_image_url ? (
                              <img src={store.logo_url || store.cover_image_url} alt={storeName} className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-4 h-4 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900 truncate">{storeName}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 truncate flex items-center gap-1">
                              <span className="font-mono">STR-{store.id.split('-')[0].toUpperCase()}</span>
                              <span>•</span>
                              <span>{store.category || store.tagline || 'Retail'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-zinc-900 font-medium text-[13px] truncate">{mallName}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          Floor {store.floor || store.floor_level || 1} • Unit {store.unit || 'N/A'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-[13px]">
                          <span className={`font-semibold ${activeProductsCount > 0 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                            {activeProductsCount}
                          </span>
                          <span className="text-zinc-400 text-[11px]">/ {totalProductsCount} SKUs</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-zinc-800 text-[13px] font-medium truncate">{store.owner || 'N/A'}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          {store.phone ? store.phone : <span className="text-amber-600">Missing phone</span>}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-[11px] text-zinc-500 space-y-0.5">
                          <div><span className="text-zinc-400">Reg:</span> {regDate}</div>
                          <div><span className="text-zinc-400">Upd:</span> {updDate}</div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {store.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : store.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium">
                            <Clock className="w-3.5 h-3.5" /> Pending Approval
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-medium">
                            <XCircle className="w-3.5 h-3.5" /> {store.status === 'suspended' ? 'Suspended' : 'Inactive'}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {store.status === 'pending' && (
                            <button
                              onClick={() => updateStoreStatus(store.id, 'active')}
                              className="mr-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium rounded shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                          )}

                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                              href={`/store/${store.id}`} 
                              target="_blank"
                              title="View Storefront"
                              className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link 
                              href={`/admin/products?store=${store.id}`}
                              title="Manage Products"
                              className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                            >
                              <Package className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => updateStoreStatus(store.id, store.status === 'active' ? 'inactive' : 'active')}
                              title={store.status === 'active' ? 'Deactivate' : 'Activate'}
                              className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            >
                              {store.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => deleteStore(store.id, storeName)}
                              title="Delete Store"
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
            Showing <strong className="text-zinc-900">{filteredStores.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong className="text-zinc-900">{Math.min(currentPage * itemsPerPage, filteredStores.length)}</strong> of <strong className="text-zinc-900">{filteredStores.length}</strong> entries
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

      {/* Add Store Modal */}
      {isAddModalOpen && (
        <AddStoreModal 
          supabase={supabase} 
          malls={malls}
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
   ADD STORE MODAL COMPONENT
--------------------------------------------------------- */
function AddStoreModal({ supabase, malls, onClose, onSuccess }: any) {
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
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      alert('Error registering store: ' + (err?.message || 'Database error'));
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
              <label className="block font-medium text-zinc-700 mb-1">Store Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Status</label>
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
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800">
              {submitting ? 'Saving...' : 'Register Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}