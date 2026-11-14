'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

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
  const supabase = createClient();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    subject: '',
    reference: '',
    description: ''
  });

  // واکشی تیکت‌های مربوط به همین کاربر هنگام لود صفحه
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    
    // ۱. گرفتن یوزر فعلی
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // ۲. گرفتن فقط تیکت‌های همین یوزر
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('vendor_id', user.id) // فیلتر امنیتی
      .order('created_at', { ascending: false });

    if (data) setTickets(data);
    if (error) console.error('Error fetching tickets:', error);
    
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.description) return alert('Subject and description are required.');
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to submit a ticket.');
        return;
      }

      // ارسال تیکت جدید به دیتابیس با آیدی همین یوزر
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          vendor_id: user.id, // ثبت با آیدی واقعی کاربر
          subject: form.subject,
          reference: form.reference,
          description: form.description,
          status: 'open'
        }]);

      if (error) throw error;

      alert('Support ticket submitted successfully!');
      setForm({ subject: '', reference: '', description: '' });
      
      // آپدیت کردن لیست تیکت‌ها برای نمایش تیکت جدید
      fetchTickets();
      
    } catch (err: any) {
      alert('Error submitting ticket: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
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
              className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* Right Card: Support Tickets List */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm h-fit flex flex-col min-h-[300px]">
          <h2 className="text-sm font-bold text-zinc-900 mb-6">Your Support Tickets</h2>
          
          {isLoading ? (
             <div className="flex-1 flex flex-col items-center justify-center py-10">
               <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
               <p className="text-xs font-medium text-zinc-500">Loading your tickets...</p>
             </div>
          ) : tickets.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
               <AlertCircle className="w-8 h-8 text-zinc-300 mb-3" />
               <p className="text-sm font-medium text-zinc-900">No tickets found</p>
               <p className="text-xs text-zinc-500 mt-1">You haven't submitted any support requests yet.</p>
             </div>
          ) : (
            <div className="space-y-5">
              {tickets.map((ticket, index) => (
                <div 
                  key={ticket.id} 
                  className={`pb-5 ${index !== tickets.length - 1 ? 'border-b border-zinc-100' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
                      {ticket.subject}
                    </h3>
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <p className="text-xs text-zinc-600 mb-2 truncate">
                    {ticket.description}
                  </p>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Ref: {ticket.reference || 'N/A'} • {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}