'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Eye, Package, Truck, CheckCircle, Clock, X, MapPin, Phone, ShoppingBag, DollarSign, AlertCircle, Trash2
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'cancelled', label: 'Cancelled', icon: X, color: 'text-rose-700 bg-rose-50 border-rose-200' }
];

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    revenue: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, pendingRes, deliveredRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*, items:order_items(*)', { count: 'exact' })
          .order('created_at', { ascending: false }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'delivered')
      ]);

      const fetchedOrders = ordersRes.data || [];
      
      const totalRevenue = fetchedOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

      setStats({
        total: ordersRes.count || 0,
        pending: pendingRes.count || 0,
        delivered: deliveredRes.count || 0,
        revenue: totalRevenue
      });

      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    fetchOrders();
  };

  const updateTrackingCode = async (orderId: string, code: string) => {
    await supabase.from('orders').update({ tracking_code: code }).eq('id', orderId);
    setOrders(orders.map(o => o.id === orderId ? { ...o, tracking_code: code } : o));
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order from database?')) return;
    await supabase.from('order_items').delete().eq('order_id', orderId);
    await supabase.from('orders').delete().eq('id', orderId);
    setIsModalOpen(false);
    setSelectedOrder(null);
    fetchOrders();
  };

  // ساخت سفارش بر اساس محصولات واقعی موجود در دیتابیس
  const createOrderFromDB = async () => {
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(10);

    const chosenProduct = dbProducts && dbProducts.length > 0
      ? dbProducts[Math.floor(Math.random() * dbProducts.length)]
      : { name: 'Catalog Product', price: 1200 };

    const qty = Math.floor(Math.random() * 3) + 1;
    const unitPrice = Number(chosenProduct.price) || 1200;
    const totalAmount = qty * unitPrice;

    const { data: newOrder } = await supabase.from('orders').insert([{
      order_number: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: `Customer #${Math.floor(100 + Math.random() * 900)}`,
      customer_phone: `0912${Math.floor(1000000 + Math.random() * 9000000)}`,
      shipping_address: 'Tehran, Commercial District',
      total_amount: totalAmount,
      status: 'pending'
    }]).select().single();

    if (newOrder) {
      await supabase.from('order_items').insert([
        { order_id: newOrder.id, product_name: chosenProduct.name, quantity: qty, price: unitPrice }
      ]);
      fetchOrders();
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
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
    <div className="max-w-[1440px] mx-auto p-6 space-y-6 text-zinc-900" dir="ltr">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Orders Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-600">
              {stats.total} Orders
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">Track, process, and manage customer shipments.</p>
        </div>
        <button 
          onClick={createOrderFromDB} 
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Test Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          className="p-4 sm:p-5 bg-zinc-900 text-white rounded-xl shadow-sm cursor-pointer hover:bg-zinc-800 transition-colors"
          onClick={() => setStatusFilter('All')}
        >
          <div className="text-[11px] font-medium text-zinc-400 mb-1.5 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" /> Total Orders
          </div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>

        <div 
          className={`p-4 sm:p-5 bg-white border ${statusFilter === 'pending' ? 'border-amber-500 shadow-md ring-1 ring-amber-500' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'} rounded-xl transition-all cursor-pointer`} 
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'All' : 'pending')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Pending Fulfillment
          </div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.pending}</div>
        </div>

        <div 
          className={`p-4 sm:p-5 bg-white border ${statusFilter === 'delivered' ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'} rounded-xl transition-all cursor-pointer`} 
          onClick={() => setStatusFilter(statusFilter === 'delivered' ? 'All' : 'delivered')}
        >
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Completed (Delivered)
          </div>
          <div className="text-2xl font-semibold text-zinc-900">{stats.delivered}</div>
        </div>

        <div className="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-xl transition-all">
          <div className="text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-blue-500" /> Gross Revenue
          </div>
          <div className="text-2xl font-semibold text-zinc-900 tracking-tight">
            ${stats.revenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by order number or customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-sm transition-all" 
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-sm text-zinc-700 min-w-[160px] cursor-pointer"
        >
          <option value="All">All Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No orders found matching your criteria.</td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const statusInfo = ORDER_STATUSES.find(s => s.value === order.status) || ORDER_STATUSES[0];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-900">{order.order_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900">{order.customer_name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-900">
                        ${order.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openOrderDetails(order)}
                          className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors inline-flex"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer with Real Pagination */}
        <div className="px-5 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-900">{filteredOrders.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong className="text-zinc-900">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</strong> of <strong className="text-zinc-900">{filteredOrders.length}</strong> entries
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

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
              <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-zinc-400" />
                Order Details: {selectedOrder.order_number}
              </h2>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => deleteOrder(selectedOrder.id)} 
                  title="Delete Order"
                  className="text-zinc-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-50/30">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Customer Information
                  </h3>
                  <div className="bg-white rounded-xl p-4 text-sm border border-zinc-200 shadow-sm space-y-2">
                    <p className="flex justify-between"><span className="text-zinc-500">Name:</span> <span className="font-medium text-zinc-900">{selectedOrder.customer_name}</span></p>
                    <p className="flex justify-between"><span className="text-zinc-500">Phone:</span> <span className="font-medium text-zinc-900">{selectedOrder.customer_phone}</span></p>
                    <div className="flex items-start gap-2 pt-3 border-t border-zinc-100 mt-3">
                      <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <p className="text-zinc-700 leading-relaxed">{selectedOrder.shipping_address}</p>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Status */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Fulfillment
                  </h3>
                  <div className="bg-white rounded-xl p-4 text-sm border border-zinc-200 shadow-sm space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1.5">Order Status</label>
                      <select 
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 bg-white"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1.5">Tracking Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. TRK-987654321"
                        defaultValue={selectedOrder.tracking_code || ''}
                        onBlur={(e) => updateTrackingCode(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Purchased Items
                </h3>
                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-medium text-zinc-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-center">QTY</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {selectedOrder.items?.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-zinc-900 font-medium">{item.product_name}</td>
                          <td className="px-4 py-3 text-center text-zinc-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-zinc-600">${item.price?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-zinc-900">${(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-zinc-50 p-4 border-t border-zinc-200 flex items-center justify-between">
                    <span className="font-semibold text-zinc-500">Total Amount:</span>
                    <span className="text-xl font-bold text-zinc-900">${selectedOrder.total_amount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}