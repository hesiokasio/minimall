'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingCart,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  LogOut
} from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  exact?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export default function VendorSidebar() {
  const supabase = createClient();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // استیت‌های داینامیک برای نام فروشگاه و ایمیل کاربر
  const [storeName, setStoreName] = useState('Vendor Shop');
  const [vendorEmail, setVendorEmail] = useState('');

  // گرفتن اطلاعات واقعی از سرور هنگام لود سایدبار و ساخت فروشگاه خودکار
  useEffect(() => {
    const fetchSidebarData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setVendorEmail(user.email || '');

        // ۱. تلاش برای پیدا کردن فروشگاه کاربر (استفاده از maybeSingle برای جلوگیری از ارور قرمز)
        const { data: storeData } = await supabase
          .from('stores')
          .select('name')
          .eq('owner_id', user.id)
          .limit(1)
          .maybeSingle(); 

        // ۲. بررسی نتیجه
        if (storeData && storeData.name) {
          // اگر فروشگاه داشت، اسمش را نشان بده
          setStoreName(storeData.name);
        } else {
          // اگر فروشگاه نداشت، در پس‌زمینه یکی برایش می‌سازیم
          const { data: newStore, error } = await supabase
            .from('stores')
            .insert([{ 
               owner_id: user.id, 
               name: 'فروشگاه جدید', 
               status: 'inactive' // وضعیت غیرفعال چون هنوز پول نداده
            }])
            .select('name')
            .single();
            
          if (newStore && !error) {
            setStoreName(newStore.name);
          }
        }
      }
    };

    fetchSidebarData();
  }, []);
  // تابع خروج از حساب کاربری
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Store Management',
      items: [
        { href: '/dashboard', label: 'Overview', icon: Home, exact: true },
        { href: '/dashboard/products', label: 'Products', icon: Package, count: 2 },
        { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart, count: 4 },
      ],
    },
    {
      title: 'Configuration & Support',
      items: [
        { href: '/dashboard/settings', label: 'Store Settings', icon: Settings },
        { href: '/dashboard/billing', label: 'Billing & Plans', icon: CreditCard },
        { href: '/dashboard/support', label: 'Help & Support', icon: HelpCircle },
      ],
    },
  ];

  const isActiveLink = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col shrink-0 bg-white border-r border-zinc-200/80 transition-all duration-200 select-none z-30 h-screen ${
        sidebarCollapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200/70">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-left focus:outline-none group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:bg-zinc-800 transition-colors shrink-0">
            {storeName.charAt(0).toUpperCase()}
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-semibold tracking-tight text-zinc-900 leading-none">
                VENDOR PANEL
              </div>
              <div className="text-[11px] text-zinc-500 mt-1 truncate">
                {storeName}
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2.5 space-y-6 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-2.5 mb-1.5">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-zinc-500'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-md tabular-nums ${
                        active ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile, Sign Out & Collapse Button */}
      <div className="p-2.5 border-t border-zinc-200/70 space-y-2">
        {!sidebarCollapsed && (
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
               {storeName.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-900 truncate">{storeName}</p>
                <p className="text-[10px] text-zinc-500 truncate">{vendorEmail}</p>
             </div>
          </div>
        )}

        {/* دکمه خروج فعال */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 py-2 px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={() => setSidebarCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 py-2 px-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!sidebarCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}