'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronLeft, Database } from 'lucide-react';

interface AdminSidebarProps {
  navGroups: any[];
}

export default function AdminSidebar({ navGroups }: AdminSidebarProps) {
  const pathname = usePathname();
  // وضعیت باز و بسته بودن منو را به داخل همین فایل منتقل کردیم
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActiveLink = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
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
            {group.items.map((item: any) => {
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
          suppressHydrationWarning
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