'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Settings } from 'lucide-react';
import '../globals.css'; // 🔴 ایمپورت استایل‌های تیلویند

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <html lang="en">
      <body className="antialiased bg-[#FDFDFC] text-[#111111] font-sans">
        <div className="min-h-screen flex flex-col md:flex-row">
          
          {/* سایدبار دسکتاپ */}
          <aside className="w-64 border-r border-black/[0.04] bg-white p-6 hidden md:flex flex-col sticky top-0 h-screen z-40">
            <div className="font-black text-xl tracking-tighter mb-12 select-none">
              VENDOR<span className="text-black/30">.</span>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-black text-white shadow-md' 
                        : 'text-black/50 hover:bg-black/[0.03] hover:text-black'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* محتوای اصلی */}
          <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
            {children}
          </main>

          {/* منوی پایین موبایل */}
          <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-black/[0.05] z-50 px-6 py-3 flex justify-between items-center pb-safe shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
                    isActive ? 'text-black' : 'text-black/30 hover:text-black/50'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] font-bold transition-all duration-300 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 h-0 overflow-hidden translate-y-2'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

        </div>
      </body>
    </html>
  );
}