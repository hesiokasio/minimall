'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Package, Truck, CheckCircle, Clock, X, MapPin, Phone, ShoppingBag
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
  };

  const updateTrackingCode = async (orderId: string, code: string) => {
    await supabase.from('orders').update({ tracking_code: code }).eq('id', orderId);
    setOrders(orders.map(o => o.id === orderId ? { ...o, tracking_code: code } : o));
  };

  // Create a mock order to test the UI
  const createMockOrder = async () => {
    const { data: newOrder } = await supabase.from('orders').insert([{
      order_number: `ORD-${Math.floor(Math.random() * 10000)}`,
      customer_name: 'John Doe',
      customer_phone: '+1 (555) 123-4567',
      shipping_address: '123 Commerce St, Suite 100, New York, NY 10001',
      total_amount: 2500,
      status: 'pending'
    }]).select().single();

    if (newOrder) {
      await supabase.from('order_items').insert([
        { order_id: newOrder.id, product_name: 'Concrete Wall Tile 45x45', quantity: 2, price: 1000 },
        { order_id: newOrder.id, product_name: 'Tile Adhesive (3kg)', quantity: 1, price: 500 }
      ]);
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-6 text-zinc-900" dir="ltr">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Orders Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-600">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">Track, process, and manage customer shipments.</p>
        </div>
        <button 
          onClick={createMockOrder} 
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Test Order
        </button>
      </div>

      {/* Filter Section (Matches your Product Catalog style) */}
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
          className="px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-sm text-zinc-700 min-w-[160px]"
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No orders found matching your criteria.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
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
        
        {/* Pagination Footer */}
        <div className="bg-white px-6 py-4 border-t border-zinc-200 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing <span className="font-medium text-zinc-900">1</span> to <span className="font-medium text-zinc-900">{filteredOrders.length}</span> of <span className="font-medium text-zinc-900">{filteredOrders.length}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-zinc-200 rounded-md text-sm text-zinc-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-md text-sm font-medium">1</button>
            <button className="px-3 py-1.5 border border-zinc-200 rounded-md text-sm text-zinc-400 cursor-not-allowed">Next</button>
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
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
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