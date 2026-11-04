'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, any> = {
    pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
    processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package, label: 'Processing' },
    shipped: { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck, label: 'Shipped' },
    delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Delivered' },
    cancelled: { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle, label: 'Cancelled' },
  };
  const cfg = configs[status] || configs.pending;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full px-2.5 py-1 text-[11px] whitespace-nowrap ${cfg.bg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

export default function SellerOrdersPage() {
  const supabase = createClient();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    
    // اول آیدی فروشگاه را می‌گیریم
    const { data: storeData } = await supabase.from('stores').select('id').limit(1).single();
    
    if (storeData) {
      // سفارشات مربوط به این فروشگاه را می‌خوانیم
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      if (error) console.error('Error fetching orders:', error.message, error.code, error.hint);
    }
    
    setIsLoading(false);
  };

  // تابع تغییر وضعیت سفارش
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const originalOrders = [...orders];
    // آپدیت سریع در ظاهر سایت (Optimistic UI)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('خطا در بروزرسانی وضعیت سفارش');
      setOrders(originalOrders); // برگرداندن به حالت قبل در صورت ارور
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Orders Management</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Track, manage, and fulfill your customer orders.
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-3 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number or customer name..."
              className="w-full h-[38px] pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-[38px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:bg-white transition-colors cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
            <p className="text-xs font-medium text-zinc-500">Loading orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
            <ShoppingBag className="w-10 h-10 text-zinc-300 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-900">No orders found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">When customers place orders, they will appear here.</p>
            {searchQuery || statusFilter !== 'all' ? (
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="mt-4 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-3.5 px-5">Order ID</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Total</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="py-4 px-5">
                        <span className="font-mono font-semibold text-zinc-900">{order.order_number}</span>
                      </td>
                      <td className="py-4 px-5 text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-zinc-900">{order.customer_name}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{order.customer_phone || 'No phone'}</div>
                      </td>
                      <td className="py-4 px-5 font-semibold text-zinc-900 tabular-nums">
                        {Number(order.total_price).toLocaleString()} تومان
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-5 text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-white border border-zinc-200 text-zinc-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-zinc-400 cursor-pointer shadow-2xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="ml-2 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors inline-flex align-middle" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-zinc-200/80 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
                <div className="text-xs text-zinc-500">
                  Showing <span className="font-medium text-zinc-900">{startIndex + 1}</span> to <span className="font-medium text-zinc-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="font-medium text-zinc-900">{totalItems}</span> orders
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-2xs">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-zinc-700 px-2">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-2xs">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}