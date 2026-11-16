'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus, Search, Store, Trash2, CheckCircle2, 
  XCircle, Eye, Package, ChevronDown, Clock, Loader2, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';
import AddStoreModal from '../../../../components/modals/AddStoreModal';

export default function StoresDirectoryPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const preselectedMallId = searchParams.get('mall'); 

  const [stores, setStores] = useState<any[]>([]);
  const [malls, setMalls] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mallFilter, setMallFilter] = useState(preselectedMallId || 'all');
  const [sortOption, setSortOption] = useState('name-asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        storesRes, 
        mallsRes, 
        productsRes,
        activeCountRes,
        inactiveCountRes,
        pendingCountRes
      ] = await Promise.all([
        supabase.from('stores').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
        supabase.from('malls').select('id, name'),
        supabase.from('products').select('id, store_id, status'),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('stores').select('id', { count: 'exact', head: true }).in('status', ['inactive', 'suspended']),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        total: storesRes.count || 0,
        active: activeCountRes.count || 0,
        inactive: inactiveCountRes.count || 0,
        pending: pendingCountRes.count || 0
      });

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, mallFilter, sortOption, itemsPerPage]);

  const updateStoreStatus = async (storeId: string, newStatus: string) => {
    const { error } = await supabase.from('stores').update({ status: newStatus }).eq('id', storeId);
    if (!error) {
      setStores(stores.map(s => s.id === storeId ? { ...s, status: newStatus } : s));
      fetchData(); 
    }
  };

  const deleteStore = async (storeId: string, storeName: string) => {
    if (window.confirm(`Are you sure you want to delete "${storeName}"? All its products must be deleted first.`)) {
      const { error } = await supabase.from('stores').delete().eq('id', storeId);
      if (!error) {
        setStores(stores.filter(s => s.id !== storeId));
        fetchData();
      } else {
        alert('Error deleting store. Please delete its assigned products first.');
      }
    }
  };

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

  const totalPages = Math.max(1, Math.ceil(filteredStores.length / itemsPerPage));
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationGroup = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-64 bg-zinc-200 rounded-lg" />
        <div className="grid grid-cols-4 gap-4"><div className="h-24 bg-white border border-zinc-200 rounded-xl col-span-4" /></div>
        <div className="h-96 w-full bg-white border border-zinc-200 rounded-xl" />
      </div>
    );
  }

  const startEntry = filteredStores.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filteredStores.length);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          className="p-4 sm:p-5 bg-zinc-900 text-white rounded-xl shadow-sm cursor-pointer hover:bg-zinc-800 transition-colors"
          onClick={() => setStatusFilter('all')}
        >
          <div className="text-[11px] font-medium text-zinc-400 mb-1.5">Total Stores</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
        <div 
          className={`p-4 sm:p-5 bg-white border ${statusFilter === 'active' ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'} rounded-xl transition-all cursor-pointer`} 
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Active Stores</div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.active}</div>
        </div>
        <div 
          className={`p-4 sm:p-5 bg-white border ${statusFilter === 'inactive' ? 'border-rose-500 shadow-md ring-1 ring-rose-500' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'} rounded-xl transition-all cursor-pointer`} 
          onClick={() => setStatusFilter(statusFilter === 'inactive' ? 'all' : 'inactive')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Inactive / Suspended</div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.inactive}</div>
        </div>
        <div 
          className={`p-4 sm:p-5 bg-white border ${statusFilter === 'pending' ? 'border-amber-500 shadow-md ring-1 ring-amber-500' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'} rounded-xl transition-all cursor-pointer`} 
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Pending Approval</div>
          <div className="text-2xl font-semibold text-amber-600">{stats.pending}</div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-sm flex flex-col gap-4">
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

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <span className="text-[13px] text-zinc-500">
            Showing <strong className="text-zinc-900 font-semibold">{filteredStores.length}</strong> of <strong className="text-zinc-900 font-semibold">{stats.total}</strong> stores
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

        {/* Enterprise Data Table Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-200/80 bg-zinc-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-zinc-200/80 shadow-2xs text-zinc-600">
              <span>Showing</span>
              <span className="font-semibold text-zinc-900 tabular-nums">{startEntry}–{endEntry}</span>
              <span>of</span>
              <span className="font-semibold text-zinc-900 tabular-nums">{filteredStores.length}</span>
            </div>

            <div className="hidden sm:block h-4 w-[1px] bg-zinc-200" />

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Rows per page</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none h-7 pl-2.5 pr-7 text-xs font-semibold text-zinc-800 bg-white border border-zinc-200/90 rounded-md shadow-2xs hover:border-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors cursor-pointer tabular-nums"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-zinc-500 tabular-nums hidden md:inline-block">
              Page <strong className="text-zinc-900 font-semibold">{currentPage}</strong> of <strong className="text-zinc-900 font-semibold">{totalPages}</strong>
            </span>

            <div className="inline-flex items-center bg-white border border-zinc-200/90 rounded-lg p-0.5 shadow-2xs">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                title="First Page"
                className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                title="Previous Page"
                className="px-2 h-7 rounded-md flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="h-4 w-[1px] bg-zinc-200 mx-0.5" />

              <div className="flex items-center gap-0.5 px-0.5">
                {getPaginationGroup().map((item, index) => (
                  item === '...' ? (
                    <span key={`dots-${index}`} className="w-7 h-7 flex items-center justify-center text-zinc-400 text-xs select-none">
                      &hellip;
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item as number)}
                      className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-semibold flex items-center justify-center transition-all tabular-nums ${
                        currentPage === item 
                          ? 'bg-zinc-900 text-white shadow-2xs' 
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                    >
                      {item}
                    </button>
                  )
                ))}
              </div>

              <div className="h-4 w-[1px] bg-zinc-200 mx-0.5" />

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Next Page"
                className="px-2 h-7 rounded-md flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Last Page"
                className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

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