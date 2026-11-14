'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { createClient } from '../../../utils/supabase/client'; // مسیر فایل سوپابیس را چک کنید

// کامپوننت بج وضعیت سفارشات (مشابه صفحه Orders)
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
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full px-2 py-0.5 text-[10px] whitespace-nowrap ${cfg.bg}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

export default function OverviewPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  
  // استیت‌های آمار کلیدی
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  
  // استیت ۵ سفارش آخر
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // ۱. گرفتن یوزر واقعی که الان لاگین کرده
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // ۲. پیدا کردن آیدی فروشگاهِ مختص به همین یوزر
      const { data: storeData } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id) // 🟢 فیلتر حیاتی: فقط فروشگاهِ من!
        .limit(1)
        .maybeSingle(); // 🟢 استفاده از maybeSingle برای جلوگیری از ارور
      
      if (storeData) {
        // ۳. دریافت تعداد کل محصولات این فروشگاه
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('store_id', storeData.id);

        // ۴. دریافت تمام سفارشات برای محاسبه درآمد و تعداد
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          // محاسبه درآمد کل (جمع مبالغ سفارشاتی که کنسل نشده‌اند)
          const revenue = ordersData
          .filter((o: any) => o.status !== 'cancelled')
          .reduce((sum: number, order: any) => sum + Number(order.total_price), 0);
          
          setStats({
            totalRevenue: revenue,
            totalOrders: ordersData.length,
            totalProducts: productsCount || 0,
          });

          // جدا کردن ۵ سفارش آخر برای نمایش در جدول
          setRecentOrders(ordersData.slice(0, 5));
        }
      } else {
        // اگر فروشگاهی پیدا نشد، آمار را صفر نشان بده
        setStats({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
        setRecentOrders([]);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-zinc-400 animate-spin mb-4" />
        <p className="text-sm font-medium text-zinc-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* هدر صفحه */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Overview</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* کارت‌های آمار (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* کارت درآمد */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Total Revenue</h3>
            <div className="p-2 bg-zinc-50 rounded-lg"><DollarSign className="w-4 h-4 text-zinc-700" /></div>
          </div>
          <div className="text-2xl font-bold text-zinc-900 tracking-tight tabular-nums">
            {stats.totalRevenue.toLocaleString()} <span className="text-sm text-zinc-400 font-normal">تومان</span>
          </div>
        </div>

        {/* کارت سفارشات */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Total Orders</h3>
            <div className="p-2 bg-zinc-50 rounded-lg"><ShoppingBag className="w-4 h-4 text-zinc-700" /></div>
          </div>
          <div className="text-2xl font-bold text-zinc-900 tracking-tight tabular-nums">
            {stats.totalOrders}
          </div>
        </div>

        {/* کارت محصولات */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex flex-col sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Active Products</h3>
            <div className="p-2 bg-zinc-50 rounded-lg"><Package className="w-4 h-4 text-zinc-700" /></div>
          </div>
          <div className="text-2xl font-bold text-zinc-900 tracking-tight tabular-nums">
            {stats.totalProducts}
          </div>
        </div>
      </div>

      {/* بخش سفارشات اخیر */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/50">
          <h2 className="text-sm font-semibold text-zinc-900">Recent Orders</h2>
          <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-500">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-zinc-200/80 bg-white text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-zinc-900">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-medium text-zinc-900">{order.customer_name}</div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-zinc-900 tabular-nums">
                      {Number(order.total_price).toLocaleString()} تومان
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}