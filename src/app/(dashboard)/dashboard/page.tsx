'use client';

import React from 'react';

export default function VendorDashboard() {
  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Promer</h1>
        <p className="text-black/50 mt-1 text-sm">Here's what's happening with your store today.</p>
      </header>

      {/* بخش کارت‌های آمار سریع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl border border-[#EFEFEF] bg-white shadow-sm">
          <div className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Total Products</div>
          <div className="text-3xl font-black">24</div>
        </div>
        <div className="p-6 rounded-2xl border border-[#EFEFEF] bg-white shadow-sm">
          <div className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Active Views</div>
          <div className="text-3xl font-black">1,482</div>
        </div>
        <div className="p-6 rounded-2xl border border-[#EFEFEF] bg-white shadow-sm">
          <div className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Store Status</div>
          <div className="text-lg font-bold text-green-600 flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
          </div>
        </div>
      </div>

      {/* بخش راهنمای قدم‌به‌قدم برای ایجاد محصول */}
      <section className="p-8 rounded-3xl bg-black/[0.02] border border-black/[0.04]">
        <h2 className="text-xl font-bold mb-2">Ready to expand your collection?</h2>
        <p className="text-black/60 text-sm mb-6 max-w-md">
          Start adding your products to the mall directory. They will instantly appear on your store's page.
        </p>
        <button className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-black/80 transition-colors shadow-md">
          + Create New Product
        </button>
      </section>
    </div>
  );
}
