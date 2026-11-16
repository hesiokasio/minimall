'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Building2, Trash2, CheckCircle2, 
  XCircle, Eye, Store, ChevronDown, Loader2, X
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

// 🟢 ۱. وارد کردن کامپوننت‌های مشترک
import AddMallModal from '../../../../components/modals/AddMallModal';
import TablePagination from '../../../../components/layout/TablePagination'; 

const MALL_ZONES = [
  'North (شمال شهر)',
  'Center / Bazaar (مرکز و بازار)',
  'West (غرب)',
  'East (شرق)',
  'South (جنوب)',
];

const MALL_CATEGORIES = [
  'Mixed Luxury & Retail (مرکز خرید جامع)',
  'Apparel & Fashion (بورس پوشاک و مد)',
  'Electronics & Mobile (بورس دیجیتال و موبایل)',
  'Construction & Interior (بورس ساختمان و دکوراسیون)',
  'Jewelry & Gold (بورس طلا و جواهر)',
  'Home & Kitchen (بورس لوازم خانگی)',
];

export default function MallsDirectoryPage() {
  const supabase = createClient();
  const [malls, setMalls] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [totalMallsCount, setTotalMallsCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [mallsRes, storesRes, productsRes] = await Promise.all([
        supabase.from('malls').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
        supabase.from('stores').select('id, mall_id, status'),
        supabase.from('products').select('id, store_id')
      ]);

      setTotalMallsCount(mallsRes.count || 0);
      setMalls(mallsRes.data || []);
      setStores(storesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching malls directory data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, zoneFilter, sortOption, itemsPerPage]);

  const toggleMallStatus = async (mallId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await supabase.from('malls').update({ status: newStatus }).eq('id', mallId);
    if (!error) {
      setMalls(malls.map(m => m.id === mallId ? { ...m, status: newStatus } : m));
    }
  };

  const deleteMall = async (mallId: string, mallName: string) => {
    if (window.confirm(`Are you sure you want to delete "${mallName}"? This action cannot be undone.`)) {
      const { error } = await supabase.from('malls').delete().eq('id', mallId);
      if (!error) {
        setMalls(malls.filter(m => m.id !== mallId));
        setTotalMallsCount(prev => prev - 1); 
      } else {
        alert('Error deleting mall. Ensure no stores are attached to it first.');
      }
    }
  };

  const filteredMalls = useMemo(() => {
    let result = malls.filter((mall) => {
      const matchesSearch = 
        mall.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        mall.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mall.city?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || mall.status === statusFilter;
      const matchesZone = zoneFilter === 'all' || mall.zone === zoneFilter;
      return matchesSearch && matchesStatus && matchesZone;
    });

    switch (sortOption) {
      case 'name-asc':
        return result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc':
        return result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'oldest':
        return result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'newest':
      default:
        return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [malls, searchQuery, statusFilter, zoneFilter, sortOption]);

  const paginatedMalls = filteredMalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-64 bg-zinc-200 rounded-lg" />
        <div className="h-16 w-full bg-white border border-zinc-200 rounded-xl" />
        <div className="h-96 w-full bg-white border border-zinc-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
              Malls Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-600">
              {totalMallsCount} Total 
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Manage shopping malls, commercial floor structures, and tenant occupancy.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Mall
        </button>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by mall name, street address, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors bg-zinc-50/50"
            />
          </div>

          <div className="relative">
            <select 
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] border border-zinc-200 rounded-lg focus:outline-none bg-white text-zinc-700 truncate"
            >
              <option value="all">All Zones</option>
              {MALL_ZONES.map(z => (
                <option key={z} value={z}>{z.split(' (')[0]}</option>
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

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <span className="text-[13px] text-zinc-500">
            Showing <strong className="text-zinc-900 font-semibold">{filteredMalls.length}</strong> of <strong className="text-zinc-900 font-semibold">{totalMallsCount}</strong> malls
          </span>
          
          <div className="relative w-48">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-1.5 text-[13px] border border-zinc-200 rounded-md focus:outline-none bg-white text-zinc-700 font-medium"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name-asc">Sort: Name (A–Z)</option>
              <option value="name-desc">Sort: Name (Z–A)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                <th className="px-5 py-4 w-[280px]">Mall</th>
                <th className="px-5 py-4 w-[240px]">Location & Zone</th>
                <th className="px-5 py-4">Floors</th>
                <th className="px-5 py-4">Stores (Active / Total)</th>
                <th className="px-5 py-4">Products</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {paginatedMalls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    No malls found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedMalls.map((mall) => {
                  const mallStores = stores.filter(s => s.mall_id === mall.id);
                  const activeStoresCount = mallStores.filter(s => s.status === 'active').length;
                  const totalStoresCount = mallStores.length;
                  
                  const storeIds = mallStores.map(s => s.id);
                  const mallProductsCount = products.filter(p => storeIds.includes(p.store_id)).length;

                  return (
                    <tr key={mall.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                            {mall.image_url ? (
                              <img src={mall.image_url} alt={mall.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400"><Building2 size={18} /></div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900 truncate">{mall.name}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 truncate font-mono">MALL-{mall.id.split('-')[0].toUpperCase()}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-zinc-800 text-[13px] truncate">{mall.address || 'Address not set'}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          {mall.city || 'Tehran'} • {mall.zone?.split(' (')[0] || 'Unzoned'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-zinc-100 rounded text-xs font-medium text-zinc-700">
                          {mall.floors || 1} Floors
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold ${activeStoresCount > 0 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                            {activeStoresCount}
                          </span>
                          <span className="text-zinc-400 text-[11px]">/ {totalStoresCount} registered</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-zinc-600 font-medium text-[13px]">
                          {mallProductsCount} SKUs
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {mall.status === 'active' ? (
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
                            href={`/mall/${mall.id}`} 
                            target="_blank"
                            title="View Mall in Storefront"
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/admin/stores?mall=${mall.id}`}
                            title="Manage Stores in this Mall"
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                          >
                            <Store className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => toggleMallStatus(mall.id, mall.status)}
                            title={mall.status === 'active' ? 'Deactivate Mall' : 'Activate Mall'}
                            className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          >
                            {mall.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => deleteMall(mall.id, mall.name)}
                            title="Delete Mall"
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
        
        {/* 🟢 ۲. استفاده از کامپوننت مشترک صفحه‌بندی */}
        <TablePagination
          totalItems={filteredMalls.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
        
      </div>

      {isAddModalOpen && (
        <AddMallModal 
          supabase={supabase} 
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