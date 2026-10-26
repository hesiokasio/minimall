import React from 'react';
// در صورت نیاز آیکون‌ها را از کتابخانه خودتان ایمپورت کنید، مثلا:
// import { Search, Plus, Eye } from 'lucide-react';

export default function SubscriptionsPage() {
  const mockSubscriptions = [
    {
      id: 1,
      storeName: 'Promer',
      mall: 'پاساژ رویال',
      plan: 'Annual Pro',
      amount: '$1,200',
      expiryDate: 'Oct 25, 2027',
      status: 'Active',
    },
    {
      id: 2,
      storeName: 'Promer2',
      mall: 'Doll Mall',
      plan: 'Quarterly Plus',
      amount: '$350',
      expiryDate: 'Dec 15, 2026',
      status: 'Expiring',
    },
    {
      id: 3,
      storeName: 'Brand X',
      mall: 'Doll Mall',
      plan: 'Monthly Starter',
      amount: '$150',
      expiryDate: 'Oct 10, 2026',
      status: 'Expired',
    },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto text-gray-900 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-200">
              3 Active
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Vendor subscription plans, billing cycles, and platform revenue tracking.
          </p>
        </div>
        <button className="bg-black text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm">
          <span>+ Add Subscription</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 shadow-sm flex flex-col">
        
        {/* Top Row: Search & Dropdowns */}
        <div className="p-4 flex flex-wrap gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* SVG Search Icon */}
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by store name..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* All Plans Dropdown */}
          <div className="relative min-w-[180px]">
            <select className="w-full appearance-none border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-600 outline-none focus:border-gray-400 bg-transparent cursor-pointer">
              <option>All Plans</option>
              <option>Annual Pro</option>
              <option>Quarterly Plus</option>
              <option>Monthly Starter</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* All Statuses Dropdown */}
          <div className="relative min-w-[180px]">
            <select className="w-full appearance-none border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-600 outline-none focus:border-gray-400 bg-transparent cursor-pointer">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Expiring</option>
              <option>Expired</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
        </div>

        {/* Divider Line */}
        <hr className="border-t border-gray-100" />

        {/* Bottom Row: Results Count & Sort */}
        <div className="px-4 py-3 flex justify-between items-center bg-gray-50/30 rounded-b-xl">
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">3</span> of <span className="font-semibold text-gray-700">3</span> subscriptions
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative min-w-[200px]">
            <select className="w-full appearance-none border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 outline-none focus:border-gray-400 bg-white cursor-pointer shadow-sm">
              <option>Sort: Newest First</option>
              <option>Sort: Oldest First</option>
              <option>Sort: A-Z</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider uppercase">Store & Mall</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider uppercase">Plan Tier</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider uppercase">Expiry Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.storeName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{sub.mall}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{sub.plan}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.amount}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.expiryDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                      sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                      sub.status === 'Expiring' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {sub.status === 'Active' ? '✓ Active' : 
                       sub.status === 'Expiring' ? '⚠ Expiring' : '⊘ Expired'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100">
                      {/* <Eye className="w-4 h-4" /> */}
                      <span className="text-xs font-medium">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">3</span> of <span className="font-medium text-gray-900">3</span> subscriptions
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 text-sm text-white bg-black rounded-md font-medium">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}