'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Building2, Store, Package, ShoppingCart, CreditCard,
  LayoutTemplate, Image as ImageIcon, Search, Menu, X,
  ChevronRight, ChevronLeft, ExternalLink, Database, BarChart
} from 'lucide-react';
import { createClient } from '../../../utils/supabase/client';
import '../../globals.css';


interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  count?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ malls: any[]; stores: any[]; products: any[] }>({
    malls: [],
    stores: [],
    products: [],
  });
  const [counts, setCounts] = useState({ malls: 0, stores: 0, products: 0, sections: 0 });

  // دریافت شمارنده‌های زنده از دیتابیس
  useEffect(() => {
    async function fetchCounts() {
      const [mallsRes, storesRes, productsRes, sectionsRes] = await Promise.all([
        supabase.from('malls').select('*', { count: 'exact', head: true }),
        supabase.from('stores').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('home_sections').select('*', { count: 'exact', head: true }),
      ]);
      setCounts({
        malls: mallsRes.count || 0,
        stores: storesRes.count || 0,
        products: productsRes.count || 0,
        sections: sectionsRes.count || 0,
      });
    }
    fetchCounts();
  }, [pathname]);

  // میانبر کیبورد Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // جستجوی زنده در Supabase
  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = searchQuery.trim();
      if (q.length < 2) {
        setSearchResults({ malls: [], stores: [], products: [] });
        return;
      }
      const [mallsData, storesData, productsData] = await Promise.all([
        supabase.from('malls').select('id, name, city').ilike('name', `%${q}%`).limit(4),
        supabase.from('stores').select('id, name, category').ilike('name', `%${q}%`).limit(4),
        supabase.from('products').select('id, name, price').ilike('name', `%${q}%`).limit(5),
      ]);
      setSearchResults({
        malls: mallsData.data || [],
        stores: storesData.data || [],
        products: productsData.data || [],
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navGroups: NavGroup[] = [
    {
      title: 'Directory',
      items: [
        { href: '/admin', label: 'Overview', icon: Home, exact: true },
        { href: '/admin/malls', label: 'Malls', icon: Building2, count: counts.malls },
        { href: '/admin/stores', label: 'Stores & Vendors', icon: Store, count: counts.stores },
        { href: '/admin/analytics', label: 'Sales & Analytics', icon: BarChart },
        { href: '/admin/products', label: 'Products Catalog', icon: Package, count: counts.products },
      ],
    },
    {
      title: 'Storefront CMS',
      items: [
        { href: '/admin/home-builder', label: 'Home Page Builder', icon: LayoutTemplate, count: counts.sections },
        { href: '/admin/banners', label: 'Campaign Banners', icon: ImageIcon },
      ],
    },
    {
      title: 'Commerce & Finance',
      items: [
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard }, 
      ],
    },
  ];

  const isActiveLink = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const getBreadcrumbTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.includes('/malls')) return 'Malls Directory';
    if (pathname.includes('/stores')) return 'Stores & Vendors';
    if (pathname.includes('/products')) return 'Products Catalog';
    if (pathname.includes('/home-builder')) return 'Home Page Builder';
    if (pathname.includes('/banners')) return 'Campaign Banners';
    if (pathname.includes('/orders')) return 'Orders';
    if (pathname.includes('/subscriptions')) return 'Subscriptions';
    if (pathname.includes('/analytics')) return 'Sales & Performance Analytics';
    return 'Workspace';
  };

  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col md:flex-row font-sans antialiased selection:bg-zinc-900 selection:text-white overflow-hidden">
        
        {/* Left Collapsible Sidebar */}
        <aside
          className={`hidden md:flex flex-col shrink-0 bg-white border-r border-zinc-200/80 transition-all duration-200 select-none z-30 h-screen ${
            sidebarCollapsed ? 'w-[68px]' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200/70">
            <Link href="/admin" className="flex items-center gap-2.5 text-left focus:outline-none group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:bg-zinc-800 transition-colors shrink-0">
                M
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-sm font-semibold tracking-tight text-zinc-900 leading-none">
                    MINIMALL OS
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1 truncate">
                    Commercial Retail Cloud
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

          {/* Database Status & Collapse Button */}
          <div className="p-2.5 border-t border-zinc-200/70 space-y-2">
            {!sidebarCollapsed && (
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60">
                <div className="flex items-center justify-between text-[11px] font-medium text-zinc-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Connected
                  </span>
                  <Database className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                  Live database sync active across storefront.
                </p>
              </div>
            )}

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

        {/* Main Content Shell */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          
          {/* Top Navigation Bar */}
          <header className="h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 shrink-0 z-20">
            
            {/* Left: Mobile Trigger + Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-500 truncate">
                <span>Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="text-zinc-900 font-semibold truncate">{getBreadcrumbTitle()}</span>
              </div>
            </div>

            {/* Right: Global Search, Live Storefront Link, User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Global Search Trigger */}
              <button
                onClick={() => setGlobalSearchOpen(true)}
                className="flex items-center justify-between gap-3 px-3 py-1.5 h-9 w-10 sm:w-64 lg:w-72 rounded-lg bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-200/80 text-xs text-zinc-500 transition-colors"
              >
                <span className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="hidden sm:inline truncate">Search malls, stores, products...</span>
                </span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-zinc-600 rounded border border-zinc-200">
                  ⌘K
                </kbd>
              </button>

              {/* View Live Storefront */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-medium text-zinc-700 hover:text-zinc-900 transition-all shadow-2xs"
              >
                <span>Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </Link>

              {/* Admin Profile Pill */}
              <div className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-zinc-200/60 bg-white">
                <div className="w-7 h-7 rounded-full bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center">
                  SA
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-zinc-900 leading-none">Super Admin</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Administrator</div>
                </div>
              </div>

            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Mobile Slide-Over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 max-w-[80vw] bg-white h-full p-4 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <span className="font-semibold text-sm">MINIMALL OS</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-zinc-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {navGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-2">
                        {group.title}
                      </div>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveLink(item.href, item.exact);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium ${
                              active ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Search Modal (Cmd+K) */}
        {globalSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden">
              <div className="flex items-center px-4 border-b border-zinc-100">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search across Malls, Stores, and Products..."
                  className="w-full px-3 py-3.5 text-sm text-zinc-900 focus:outline-none"
                />
                <button
                  onClick={() => setGlobalSearchOpen(false)}
                  className="text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
                {searchQuery.trim().length < 2 ? (
                  <div className="py-8 text-center text-zinc-400">
                    Type at least 2 characters to search across the directory...
                  </div>
                ) : (
                  <>
                    {searchResults.malls.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Malls ({searchResults.malls.length})
                        </div>
                        {searchResults.malls.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => { router.push('/admin/malls'); setGlobalSearchOpen(false); }}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 text-left"
                          >
                            <span className="font-semibold text-zinc-900">{m.name}</span>
                            <span className="text-zinc-500 text-[11px]">{m.city || 'Mall'}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.stores.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Stores ({searchResults.stores.length})
                        </div>
                        {searchResults.stores.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => { router.push('/admin/stores'); setGlobalSearchOpen(false); }}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 text-left"
                          >
                            <span className="font-semibold text-zinc-900">{s.name}</span>
                            <span className="text-zinc-500 text-[11px]">{s.category || 'Store'}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.products.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Products ({searchResults.products.length})
                        </div>
                        {searchResults.products.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => { router.push('/admin/products'); setGlobalSearchOpen(false); }}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 text-left"
                          >
                            <span className="font-semibold text-zinc-900">{p.name}</span>
                            <span className="font-semibold text-zinc-700">{Number(p.price).toLocaleString()} Toman</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.malls.length === 0 && searchResults.stores.length === 0 && searchResults.products.length === 0 && (
                      <div className="py-8 text-center text-zinc-500">
                        No results found matching "{searchQuery}".
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </body>
    </html>
  );
}