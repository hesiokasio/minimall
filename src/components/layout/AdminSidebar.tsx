'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

interface AdminSidebarProps {
  navGroups: any[];
}

export default function AdminSidebar({ navGroups }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('Loading...');

  useEffect(() => {
    const getAdminUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setAdminEmail(user.email);
      }
    };
    getAdminUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login/admin');
  };

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

      {/* Admin Profile Card, Sign Out & Collapse Button */}
      <div className="p-3 border-t border-zinc-200/70 space-y-2">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60 ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center shrink-0 uppercase">
            {adminEmail !== 'Loading...' ? adminEmail.substring(0, 2) : 'SA'}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-zinc-900 truncate">
                Super Admin
              </div>
              <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                {adminEmail}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          title={sidebarCollapsed ? 'Sign Out' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>

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