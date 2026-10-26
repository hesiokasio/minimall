'use client';

import React from 'react';
import { Download, MonitorX, TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

// داده‌های شبیه‌سازی شده (Demo Data) دقیقاً مطابق عکس Vanguard OS
const DEMO_MALL_SALES = [
  { name: 'Century City', volume: 590000 },
  { name: 'Aventura Mall', volume: 480000 },
  { name: 'Brookfield Pl', volume: 380000 },
];

const DEMO_TOP_PRODUCTS = [
  { name: 'Lumina Studio Reference Monitor 5K', sku: 'LUM-MON-27', units: 194, revenue: 290806 },
  { name: 'Chronos Calibre 89 Automatic', sku: 'CHR-CAL-89', units: 31, revenue: 260400 },
  { name: 'Double-Faced Cashmere Overcoat', sku: 'KKA-CT-09', units: 142, revenue: 177500 },
  { name: 'Resurrection Aromatique Hand Balm', sku: 'AES-HB-500', units: 1120, revenue: 108640 },
];

export default function SalesAnalyticsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
              Sales & Performance Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
              Labeled Demo Dataset
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            Transparent commercial reporting. Revenue is never derived or fabricated from static product catalog prices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <MonitorX className="w-4 h-4 text-zinc-400" />
            Simulate Disconnected POS
          </button>
          <button className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[13px] font-medium text-zinc-500 mb-2">Gross Revenue (Demo)</div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-zinc-900 tracking-tight">$1,465,600</div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <TrendingUp className="w-3 h-3" /> +9.8%
              </span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 mt-4">Last 30 days across 5 active stores</div>
        </div>

        {/* Card 2: Completed Orders */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[13px] font-medium text-zinc-500 mb-2">Completed Orders (Demo)</div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-zinc-900 tracking-tight">5,427</div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <TrendingUp className="w-3 h-3" /> +7.4%
              </span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 mt-4">Verified POS receipts</div>
        </div>

        {/* Card 3: Average Order Value */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[13px] font-medium text-zinc-500 mb-2">Average Order Value</div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-zinc-900 tracking-tight">$270.05</div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <TrendingUp className="w-3 h-3" /> +3.3%
              </span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 mt-4">Up from $261.40 prior period</div>
        </div>

        {/* Card 4: Refunds & Cancellations */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[13px] font-medium text-zinc-500 mb-2">Refunds & Cancellations</div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-zinc-900 tracking-tight">$32,340</div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50/50 text-emerald-700 text-[11px] font-semibold">
                <TrendingDown className="w-3 h-3" /> -0.4%
              </span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 mt-4">2.2% of gross volume</div>
        </div>
      </div>

      {/* Charts & Lists Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: Bar Chart */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-900">Sales by Shopping Mall (Demo)</h2>
            <p className="text-[12px] text-zinc-500 mt-1">Aggregated tenant POS volume per commercial center</p>
          </div>
          
          <div className="h-64 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_MALL_SALES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={80}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#71717a' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#71717a' }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Top Products List */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-zinc-900">Best-Selling Products (Demo)</h2>
            <p className="text-[12px] text-zinc-500 mt-1">Top velocity SKUs from connected store terminals</p>
          </div>

          <div className="flex flex-col gap-5">
            {DEMO_TOP_PRODUCTS.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between pb-5 border-b border-zinc-100 last:border-0 last:pb-0">
                <div>
                  <div className="text-[13px] font-semibold text-zinc-900">{prod.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono flex items-center gap-1.5">
                    <span>{prod.sku}</span>
                    <span>•</span>
                    <span>{prod.units} units sold</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-zinc-900">
                  ${prod.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}