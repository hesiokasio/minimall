'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import VendorSidebar from '../../components/layout/VendorSidebar';
import { Search, ExternalLink, ChevronRight, Menu } from 'lucide-react';
import '../globals.css'; // این مسیر برای شما به درستی کار کرده بود

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  // تولید داینامیک عنوان صفحات در هدر (مثل Admin > Overview)
  const getBreadcrumbTitle = () => {
    if (!pathname || pathname === '/dashboard') return 'Overview';
    if (pathname.includes('/products')) return 'Products';
    if (pathname.includes('/orders')) return 'Orders';
    if (pathname.includes('/inventory')) return 'Inventory';
    if (pathname.includes('/analytics')) return 'Sales & Analytics';
    if (pathname.includes('/earnings')) return 'Earnings & Payouts';
    if (pathname.includes('/settings')) return 'Store Settings';
    if (pathname.includes('/kyc')) return 'KYC Verification';
    return 'Overview';
  };

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-[#FAFAFA] overflow-hidden font-sans antialiased text-zinc-900">
          
          {/* سایدبار */}
          <VendorSidebar />

          {/* بخش اصلی */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            
            {/* هدر بالای داشبورد - کپی دقیق از پنل ادمین */}
            <header className="h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 shrink-0 z-20">
              
              {/* سمت چپ: منوی موبایل و بردکرامب */}
              <div className="flex items-center gap-3 min-w-0">
                <button className="md:hidden p-2 -ml-2 rounded-lg text-zinc-600 hover:bg-zinc-100">
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-500 truncate">
                  <span>Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-zinc-900 font-semibold truncate">{getBreadcrumbTitle()}</span>
                </div>
              </div>

              {/* سمت راست: جستجو، دکمه سایت و باکس پروفایل */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                
                {/* باکس جستجو با استایل کلید ⌘K */}
                <button className="flex items-center justify-between gap-3 px-3 py-1.5 h-9 w-10 sm:w-64 lg:w-72 rounded-lg bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-200/80 text-xs text-zinc-500 transition-colors">
                  <span className="flex items-center gap-2 truncate">
                    <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="hidden sm:inline truncate">Search products, orders...</span>
                  </span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-zinc-600 rounded border border-zinc-200">
                    ⌘K
                  </kbd>
                </button>

                {/* دکمه Live Storefront */}
                <Link
                  href="/"
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-medium text-zinc-700 hover:text-zinc-900 transition-all shadow-2xs"
                >
                  <span>Live Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </Link>

                {/* باکس پروفایل کاربر */}
                <div className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-zinc-200/60 bg-white">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center">
                    VS
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-medium text-zinc-900 leading-none">Vendor Shop</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Verified Partner</div>
                  </div>
                </div>

              </div>
            </header>

            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
            
          </div>
        </div>
      </body>
    </html>
  );
}