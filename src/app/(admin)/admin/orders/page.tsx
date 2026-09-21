import React from 'react';
import { ShoppingCart, Search, Filter, ArrowUpRight } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto w-full" dir="rtl">
      
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">سفارشات کلان</h1>
          <p className="text-gray-500 mt-2 text-sm">پیگیری وضعیت تمام تراکنش‌ها و ارسال‌های سایت.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="bg-white border border-gray-100 hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-600 transition-colors shadow-sm">
            <Filter size={16} /> فیلتر وضعیت
          </button>
          <div className="relative w-full md:w-64">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="کد سفارش..."
              className="w-full bg-white border border-gray-100 focus:border-gray-200 rounded-xl py-3 pr-11 pl-4 text-sm font-medium outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
        <div className="text-center p-16 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <ShoppingCart size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">هنوز سفارشی ثبت نشده است</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-sm">
            به محض اینکه اولین مشتری خریدی انجام دهد، لیست سفارشات در اینجا نمایش داده می‌شود.
          </p>
        </div>
      </div>

    </div>
  );
}