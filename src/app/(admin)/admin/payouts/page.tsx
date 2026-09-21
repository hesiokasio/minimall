import React from 'react';
import { CreditCard, Download, CheckCircle2 } from 'lucide-react';

export default function AdminPayoutsPage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto w-full" dir="rtl">
      
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">تسویه‌حساب‌ها</h1>
          <p className="text-gray-500 mt-2 text-sm">مدیریت درخواست‌های واریز وجه و سهم فروشندگان.</p>
        </div>
        <button className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-colors shadow-lg">
          <Download size={16} /> خروجی اکسل (بانک)
        </button>
      </header>

      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
        <div className="text-center p-16 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <CreditCard size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">درخواست تسویه‌ای وجود ندارد</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-sm">
            تمامی حساب‌ها با فروشندگان صفر است و درخواست واریز جدیدی ثبت نشده است.
          </p>
        </div>
      </div>

    </div>
  );
}