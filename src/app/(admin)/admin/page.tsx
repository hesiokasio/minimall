'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2, Store, Package, LayoutTemplate, Plus, ArrowUpRight,
  ArrowDownRight, HelpCircle, Database, ChevronRight, CheckCircle2,
  RefreshCw, ArrowRight, X, UploadCloud, Loader2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { createClient } from '../../../utils/supabase/client';

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

const DEMO_SALES_SERIES: Record<string, any[]> = {
  '7d': [
    { label: 'Mon', revenue: 42800, prevRevenue: 38900, orders: 164 },
    { label: 'Tue', revenue: 46200, prevRevenue: 41200, orders: 179 },
    { label: 'Wed', revenue: 51900, prevRevenue: 47500, orders: 196 },
    { label: 'Thu', revenue: 49400, prevRevenue: 48100, orders: 185 },
    { label: 'Fri', revenue: 68500, prevRevenue: 61000, orders: 248 },
    { label: 'Sat', revenue: 84200, prevRevenue: 76400, orders: 302 },
    { label: 'Sun', revenue: 72900, prevRevenue: 65800, orders: 268 },
  ],
  '30d': [
    { label: 'Wk 1', revenue: 312000, prevRevenue: 289000, orders: 1180 },
    { label: 'Wk 2', revenue: 348500, prevRevenue: 315000, orders: 1295 },
    { label: 'Wk 3', revenue: 389200, prevRevenue: 352000, orders: 1410 },
    { label: 'Wk 4', revenue: 415900, prevRevenue: 378900, orders: 1542 },
  ],
};

const KpiCard = ({ label, value, subtext, trend, trendUp = true, tooltip, sparkline, href }: any) => {
  const [showTip, setShowTip] = useState(false);

  const content = (
    <div className="group relative bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-5 transition-all duration-150 hover:border-zinc-300 hover:shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-zinc-500 tracking-tight">{label}</span>
          {tooltip && (
            <div
              className="relative"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600 cursor-help" />
              {showTip && (
                <div className="absolute right-0 bottom-6 z-30 w-52 p-2.5 text-[11px] leading-relaxed text-white bg-zinc-900 rounded-lg shadow-lg pointer-events-none">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-semibold text-zinc-900 tracking-tight tabular-nums">
            {value}
          </div>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded ${
                trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}
            >
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-500 truncate">{subtext}</span>
        {sparkline && (
          <div className="flex items-end gap-0.5 h-4 shrink-0">
            {sparkline.map((val: number, idx: number) => (
              <div
                key={idx}
                style={{ height: `${Math.max(20, val)}%` }}
                className="w-1 bg-zinc-200 group-hover:bg-zinc-500 rounded-full transition-colors"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

export default function SuperAdminDashboard() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  
  // 🟢 استیت جدید برای ذخیره آمار دقیق کل رکوردها
  const [counts, setCounts] = useState({ malls: 0, stores: 0, products: 0, sections: 0 });
  
  const [malls, setMalls] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [sectionItems, setSectionItems] = useState<any[]>([]);

  const [dateRange, setDateRange] = useState<'7d' | '30d'>('30d');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');

  const [mallModalOpen, setMallModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 🟢 دریافت داینامیک اطلاعات با بهینه‌سازی دقیق
      // ما فقط 100 آیتم آخر را برای لیست‌ها لود می‌کنیم اما تعداد کل (count) را محاسبه می‌کنیم
      const [mallsRes, storesRes, productsRes, sectionsRes, itemsRes] = await Promise.all([
        supabase.from('malls').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(100),
        supabase.from('stores').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(100),
        supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(100),
        supabase.from('home_sections').select('*', { count: 'exact' }).order('sort_order', { ascending: true }),
        supabase.from('home_section_items').select('*'),
      ]);

      // 🟢 ذخیره آمار واقعی دیتابیس
      setCounts({
        malls: mallsRes.count || 0,
        stores: storesRes.count || 0,
        products: productsRes.count || 0,
        sections: sectionsRes.count || 0,
      });

      setMalls(mallsRes.data || []);
      setStores(storesRes.data || []);
      setProducts(productsRes.data || []);
      setSections(sectionsRes.data || []);
      setSectionItems(itemsRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const operationalAlerts = useMemo(() => {
    const alerts: any[] = [];

    sections.forEach((sec) => {
      const count = sectionItems.filter((item) => item.section_id === sec.id).length;
      if (count === 0) {
        alerts.push({
          id: `sec-${sec.id}`,
          severity: 'warning',
          category: 'Storefront Layout',
          title: `Section "${sec.title}" has 0 items`,
          description: 'Assign products or upload banners so this row renders on the homepage.',
          actionLabel: 'Open Builder',
          href: '/admin/home-builder',
        });
      }
    });

    products.filter((p) => !p.image_url && !p.image).forEach((p) => {
      alerts.push({
        id: `prod-${p.id}`,
        severity: 'info',
        category: 'Catalog Quality',
        title: `Product "${p.name}" is missing an image`,
        description: 'Upload a product thumbnail to improve storefront conversion.',
        actionLabel: 'Edit Product',
        href: '/admin/products',
      });
    });

    // 🟢 آپدیت شده برای استفاده از counts
    if (counts.malls === 0) {
      alerts.push({
        id: 'no-malls',
        severity: 'critical',
        category: 'Onboarding',
        title: 'No shopping malls registered yet',
        description: 'Onboard your first commercial shopping center to start assigning stores.',
        actionLabel: 'Add Mall',
        onClick: () => setMallModalOpen(true),
      });
    }

    return alerts;
  }, [sections, sectionItems, products, counts.malls]);

  const currentChartData = DEMO_SALES_SERIES[dateRange];
  const totalDemoRevenue = currentChartData.reduce((acc, item) => acc + item.revenue, 0);
  const totalDemoOrders = currentChartData.reduce((acc, item) => acc + item.orders, 0);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
        <div className="h-7 w-56 bg-zinc-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white border border-zinc-200/70 rounded-xl p-5" />
          ))}
        </div>
        <div className="h-80 bg-white border border-zinc-200/70 rounded-xl p-6" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
              Platform Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Database className="w-3 h-3 text-emerald-600" />
              Supabase Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time directory posture across shopping centers, tenant stores, catalog SKUs, and storefront layout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center bg-white border border-zinc-200/90 rounded-lg p-1 text-xs shadow-2xs">
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setDateRange(p.id as '7d' | '30d')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  dateRange === p.id ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAllData}
            className="p-2 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            title="Refresh live data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => setMallModalOpen(true)}
          className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors text-left shadow-2xs group cursor-pointer"
        >
          <div>
            <div className="text-xs font-semibold">Add Mall</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Onboard complex</div>
          </div>
          <Plus className="w-4 h-4 text-zinc-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => setStoreModalOpen(true)}
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-300 text-zinc-900 transition-colors text-left group cursor-pointer"
        >
          <div>
            <div className="text-xs font-semibold">Register Store</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Assign tenant unit</div>
          </div>
          <Store className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
        </button>

        <button
          onClick={() => setProductModalOpen(true)}
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-300 text-zinc-900 transition-colors text-left group cursor-pointer"
        >
          <div>
            <div className="text-xs font-semibold">Add Product</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Register catalog SKU</div>
          </div>
          <Package className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
        </button>

        <Link
          href="/admin/home-builder"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-300 text-zinc-900 transition-colors text-left group"
        >
          <div>
            <div className="text-xs font-semibold">Home Page Builder</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Manage rows & banners</div>
          </div>
          <LayoutTemplate className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 🟢 نمایش داینامیک آمار از state جدید counts */}
        <KpiCard
          label="Total Malls"
          value={counts.malls}
          subtext="Commercial complexes onboarded"
          trend="Active"
          trendUp={true}
          sparkline={[45, 55, 60, 75, 80, 100]}
          tooltip="Total commercial shopping centers registered in Supabase."
          href="/admin/malls"
        />
        <KpiCard
          label="Registered Stores"
          value={counts.stores}
          subtext={`Across ${counts.malls} shopping centers`}
          trend="+11.1%"
          trendUp={true}
          sparkline={[40, 50, 62, 70, 85, 95]}
          tooltip="All tenant businesses registered in the platform."
          href="/admin/stores"
        />
        <KpiCard
          label="Catalog Products"
          value={counts.products}
          subtext="Unique catalog SKUs"
          trend="+19.3%"
          trendUp={true}
          sparkline={[30, 45, 55, 72, 84, 98]}
          tooltip="Total products registered across all tenant stores."
          href="/admin/products"
        />
        <KpiCard
          label="Storefront Sections"
          value={counts.sections}
          subtext={`${sectionItems.length} total items assigned`}
          trend="Live CMS"
          trendUp={true}
          sparkline={[55, 62, 74, 68, 86, 96]}
          tooltip="Dynamic homepage rows configured in the Page Builder."
          href="/admin/home-builder"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-zinc-900">Sales & Order Performance</h2>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/70 rounded-full">
                    Demo Telemetry
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Comparison against previous period across connected tenant POS terminals
                </p>
              </div>

              <div className="inline-flex bg-zinc-100 p-0.5 rounded-lg text-[11px]">
                {[
                  { id: 'revenue', label: 'Revenue' },
                  { id: 'orders', label: 'Orders' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setChartMetric(m.id as 'revenue' | 'orders')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      chartMetric === m.id ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full mt-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18181b" stopOpacity={0.14} />
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#71717a' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (chartMetric === 'orders' ? v : `$${(v / 1000).toFixed(0)}k`)}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  {chartMetric === 'revenue' && (
                    <Area
                      type="monotone"
                      dataKey="prevRevenue"
                      stroke="#a1a1aa"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="none"
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey={chartMetric}
                    stroke="#18181b"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
            <span>
              Period Total: <strong className="text-zinc-900">${totalDemoRevenue.toLocaleString()}</strong> ({totalDemoOrders} orders)
            </span>
            <Link href="/admin/orders" className="font-medium text-zinc-900 hover:underline inline-flex items-center gap-1">
              View All Orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Homepage Layout Posture</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Active sequence of {counts.sections} storefront rows {/* 🟢 آپدیت شد */}
                </p>
              </div>
              <LayoutTemplate className="w-4 h-4 text-zinc-400" />
            </div>

            <div className="mt-4 space-y-2.5 max-h-64 overflow-y-auto">
              {sections.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  No sections created yet.
                </div>
              ) : (
                sections.map((sec, idx) => {
                  const count = sectionItems.filter((i) => i.section_id === sec.id).length;
                  return (
                    <div
                      key={sec.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50/80 border border-zinc-200/60 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded bg-white border border-zinc-200 flex items-center justify-center font-semibold text-[11px] text-zinc-600 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-zinc-900 truncate">{sec.title}</div>
                          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{sec.type}</div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                          count > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {count} items
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-100">
            <Link
              href="/admin/home-builder"
              className="w-full py-2 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200/70 text-xs font-medium text-zinc-900 transition-colors flex items-center justify-center"
            >
              Manage Page Builder
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Operational Alerts</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Actionable exceptions requiring attention</p>
            </div>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {operationalAlerts.length}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 flex-1">
            {operationalAlerts.length === 0 ? (
              <div className="py-12 text-center text-xs text-emerald-600 font-medium flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>All platform systems and sections are healthy.</span>
              </div>
            ) : (
              operationalAlerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-zinc-50/80 border border-zinc-200/70 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {alert.category}
                    </span>
                    {alert.onClick ? (
                      <button
                        onClick={alert.onClick}
                        className="text-xs font-medium text-zinc-900 hover:underline inline-flex items-center gap-1 shrink-0"
                      >
                        {alert.actionLabel} <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <Link
                        href={alert.href}
                        className="text-xs font-medium text-zinc-900 hover:underline inline-flex items-center gap-1 shrink-0"
                      >
                        {alert.actionLabel} <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-900">{alert.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{alert.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Recent Catalog Products</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Latest SKUs added to Supabase</p>
            </div>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="mt-4 divide-y divide-zinc-100 flex-1">
            {products.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400">No products registered yet.</div>
            ) : (
              products.slice(0, 5).map((prod) => (
                <div key={prod.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {prod.image_url || prod.image ? (
                        <img src={prod.image_url || prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-900 truncate">{prod.name}</div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {Number(prod.price || 0).toLocaleString()} Toman
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Registered Stores</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Active tenant boutiques</p>
            </div>
            <Store className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="mt-4 divide-y divide-zinc-100 flex-1">
            {stores.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400">No stores registered yet.</div>
            ) : (
              stores.slice(0, 5).map((st, idx) => (
                <div key={st.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-xs font-semibold text-zinc-400 tabular-nums">0{idx + 1}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-900 truncate">{st.name}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{st.category || 'Retail Store'}</div>
                    </div>
                  </div>
                  <Link
                    href="/admin/stores"
                    className="text-[11px] font-medium text-zinc-700 hover:text-zinc-900 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200/70 transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {mallModalOpen && (
        <AddMallModal
          supabase={supabase}
          onClose={() => setMallModalOpen(false)}
          onSuccess={(mallName: string) => {
            setMallModalOpen(false);
            fetchAllData();
            showToast('Mall Created', `"${mallName}" has been saved to Supabase.`);
          }}
        />
      )}

      {storeModalOpen && (
        <AddStoreModal
          supabase={supabase}
          malls={malls}
          onClose={() => setStoreModalOpen(false)}
          onSuccess={(storeName: string) => {
            setStoreModalOpen(false);
            fetchAllData();
            showToast('Store Registered', `"${storeName}" has been added to the directory.`);
          }}
        />
      )}

      {productModalOpen && (
        <AddProductModal
          supabase={supabase}
          stores={stores}
          onClose={() => setProductModalOpen(false)}
          onSuccess={(prodName: string) => {
            setProductModalOpen(false);
            fetchAllData();
            showToast('Product Added', `"${prodName}" is now in the catalog.`);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white rounded-xl p-4 shadow-xl border border-zinc-800 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold">{toast.title}</div>
            <div className="text-zinc-300 text-[11px] mt-0.5">{toast.message}</div>
          </div>
          <button onClick={() => setToast(null)} className="text-zinc-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}

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

function AddMallModal({ supabase, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: '',
    city: 'Tehran',
    zone: MALL_ZONES[0],
    category: MALL_CATEGORIES[0],
    address: '',
    floors: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
    description: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Mall name is required.';
    if (!form.city.trim()) errs.city = 'City is required.';
    if (!form.address.trim()) errs.address = 'Address is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);

    try {
      let finalImageUrl = form.image;

      if (uploadFile) {
        const ext = uploadFile.name.split('.').pop();
        const fileName = `mall-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('banners').upload(fileName, uploadFile);
        if (!upErr) {
          const { data } = supabase.storage.from('banners').getPublicUrl(fileName);
          finalImageUrl = data.publicUrl;
        }
      }

      const payload = {
        name: form.name,
        city: form.city,
        zone: form.zone,
        category: form.category,
        address: form.address,
        floors: Number(form.floors),
        status: form.status,
        image_url: finalImageUrl,
        description: form.description,
      };

      let { error } = await supabase.from('malls').insert([payload]);

      if (error) {
        const retry = await supabase.from('malls').insert([{ name: form.name, image_url: finalImageUrl }]);
        if (retry.error) throw retry.error;
      }

      onSuccess(form.name);
    } catch (err: any) {
      alert('Error saving mall: ' + (err?.message || 'Check database permissions'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Add New Shopping Mall</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">Define location, zone, and specialty category</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Mall Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Palladium Mall / پاساژ پالادیوم"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
              {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Tehran"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
              {errors.city && <p className="text-rose-600 text-[11px] mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                Zone / District (منطقه) <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
              >
                {MALL_ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Primary Category (بورس / کاربری پاساژ) <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
              >
                {MALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Street Address (آدرس دقیق) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Moghaddas Ardebili St, Zafaraniyeh"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
              {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Number of Floors</label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.floors}
                onChange={(e) => setForm({ ...form, floors: Number(e.target.value) })}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block font-medium text-zinc-700">Cover Image (Upload or URL)</label>
              <div className="flex items-center gap-3">
                <img
                  src={uploadFile ? URL.createObjectURL(uploadFile) : form.image}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-zinc-200 shrink-0"
                />
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-[11px] text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Short Description (Optional)</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief summary about this shopping center..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Saving...' : 'Create Mall'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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

      let { error } = await supabase.from('stores').insert([fullPayload]);

      if (error) {
        const retry = await supabase.from('stores').insert([{ name: form.name, category: form.category }]);
        if (retry.error) throw retry.error;
      }

      onSuccess(form.name);
    } catch (err: any) {
      alert('Error registering store: ' + (err?.message || 'Check database'));
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
              <label className="block font-medium text-zinc-700 mb-1">
                Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Promer Flagship Store"
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
              <label className="block font-medium text-zinc-700 mb-1">Business Category</label>
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
              <label className="block font-medium text-zinc-700 mb-1">Operational Status</label>
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
                placeholder="Manager Name"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0912..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800">
              {submitting ? 'Saving...' : 'Register Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddProductModal({ supabase, stores, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    storeId: stores[0]?.id || '',
    category: CATEGORIES[0],
    price: '',
    stock: 25,
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
        image_url: finalImageUrl,
        description: form.description,
      };

      let { error } = await supabase.from('products').insert([fullPayload]);

      if (error) {
        const retry = await supabase.from('products').insert([
          { name: form.name, price: Number(form.price), image_url: finalImageUrl }
        ]);
        if (retry.error) throw retry.error;
      }

      onSuccess(form.name);
    } catch (err: any) {
      alert('Error adding product: ' + (err?.message || 'Check database'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Add Catalog Product</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. چسب کاشی پرومر / Lumina Monitor"
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
              <label className="block font-medium text-zinc-700 mb-1">Assigned Store</label>
              <select
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
              <label className="block font-medium text-zinc-700 mb-1">
                Price (Toman) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="250000"
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

            <div className="sm:col-span-2 space-y-2">
              <label className="block font-medium text-zinc-700">Product Image (Upload or URL)</label>
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
                placeholder="Or paste image URL here..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800">
              {submitting ? 'Saving...' : 'Register Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}