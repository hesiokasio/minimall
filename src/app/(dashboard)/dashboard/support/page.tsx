'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

// دیتای تستی تیکت‌ها (مشابه تصویر)
const MOCK_TICKETS = [
  {
    id: 'TCK-381',
    subject: 'Signage approval timeline for Maison Margaux (Unit 118)',
    status: 'in_progress',
    lastUpdate: 'Mall Concierge: Architectural review completes this Friday.',
    reference: 'STR-118',
    date: '2025-02-20'
  },
  {
    id: 'TCK-379',
    subject: 'Request for bulk upload feature on product catalog',
    status: 'resolved',
    lastUpdate: 'Support: The feature has been enabled for your account.',
    reference: 'SYS-FEAT',
    date: '2025-02-18'
  }
];

const TicketStatusBadge = ({ status }: { status: string }) => {
  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5" />
        In Progress
      </span>
    );
  }
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Resolved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-medium whitespace-nowrap shrink-0">
      <AlertCircle className="w-3.5 h-3.5" />
      Open
    </span>
  );
};

export default function SellerSupportPage() {
  const [form, setForm] = useState({
    subject: '',
    reference: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.description) return alert('Subject and description are required.');
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Support ticket submitted successfully!');
      setForm({ subject: '', reference: '', description: '' });
    }, 1000);
  };

  const inputClass = "w-full h-[38px] px-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors";
  const labelClass = "block font-semibold text-zinc-800 mb-2 text-xs";

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Help & Seller Support</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Operational guides, mall concierge dispatch rules, and support ticket tracking.
        </p>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Submit Ticket Form */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm h-fit">
          <h2 className="text-sm font-bold text-zinc-900 mb-6">Submit a Seller Support Ticket</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Subject *</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief summary of issue..."
                className={inputClass}
              />
            </div>
            
            <div>
              <label className={labelClass}>Order or SKU Reference</label>
              <input
                type="text"
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="e.g. VNG-2025-8841 or AES-HB-500"
                className={inputClass}
              />
            </div>
            
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Explain how mall operations or seller support can assist..."
                className="w-full p-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 mt-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* Right Card: Support Tickets List */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm h-fit">
          <h2 className="text-sm font-bold text-zinc-900 mb-6">Your Support Tickets</h2>
          
          <div className="space-y-5">
            {MOCK_TICKETS.map((ticket, index) => (
              <div 
                key={ticket.id} 
                className={`pb-5 ${index !== MOCK_TICKETS.length - 1 ? 'border-b border-zinc-100' : ''}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
                    {ticket.subject}
                  </h3>
                  <TicketStatusBadge status={ticket.status} />
                </div>
                <p className="text-xs text-zinc-600 mb-2">
                  {ticket.lastUpdate}
                </p>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {ticket.id} • Ref: {ticket.reference} • {ticket.date}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}