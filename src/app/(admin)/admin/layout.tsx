import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Building2, 
  Store, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  LayoutTemplate, 
  Image as ImageIcon, 
  LogOut 
} from 'lucide-react';
import '../../globals.css'; // // مطمئن شو مسیر استایل درست است

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#F8F8F8] min-h-screen flex overflow-hidden selection:bg-black selection:text-white">
        
        {/* منوی کناری ثابت (Sidebar) */}
        <aside className="w-[260px] bg-white border-l border-black/[0.04] flex flex-col shrink-0 z-50 shadow-sm">
          
          {/* بخش لوگو */}
          <div className="h-20 flex flex-col justify-center items-center border-b border-black/[0.04]">
            <Link href="/" className="text-xl font-black tracking-tighter">
              MINIMALL<span className="text-black/20">.</span>
            </Link>
            <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 mt-1 uppercase">
              Super Admin
            </span>
          </div>

          {/* لینک‌های منو */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2 mt-2 px-3">
              مدیریت پلتفرم
            </div>
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <LayoutDashboard size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              داشبورد اصلی
            </Link>
            <Link href="/admin/malls" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <Building2 size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              پاساژها
            </Link>
            <Link href="/admin/stores" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <Store size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              فروشندگان (Vendors)
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <Package size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              نظارت بر محصولات
            </Link>

            <div className="my-4 border-b border-black/[0.03]" />

            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2 mt-4 px-3">
              مالی و فروش
            </div>
            <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <ShoppingCart size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              سفارشات کلان
            </Link>
            <Link href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <CreditCard size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              تسویه‌حساب‌ها
            </Link>

            <div className="my-4 border-b border-black/[0.03]" />

            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2 mt-4 px-3">
              ویترین سایت
            </div>
            <Link href="/admin/home-builder" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <LayoutTemplate size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              چیدمان صفحه اصلی
            </Link>
            <Link href="/admin/banners" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-black/[0.03] hover:text-black transition-all group">
              <ImageIcon size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              بنرها و کمپین‌ها
            </Link>

          </nav>

          {/* دکمه خروج */}
          <div className="p-4 border-t border-black/[0.04]">
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors w-full">
              <LogOut size={16} /> خروج از پنل
            </button>
          </div>
        </aside>

        {/* محتوای متغیر صفحات (همان فرم‌هایی که ساختی اینجا لود می‌شوند) */}
        <main className="flex-1 h-screen overflow-y-auto relative">
          {children}
        </main>

      </body>
    </html>
  );
}