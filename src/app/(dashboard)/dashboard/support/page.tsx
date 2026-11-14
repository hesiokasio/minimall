'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, AlertCircle, Loader2, 
  MessageSquareReply, ChevronDown, ChevronUp, User, Headset 
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

const TicketStatusBadge = ({ status }: { status: string }) => {
  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-medium whitespace-nowrap">
        <Clock className="w-3.5 h-3.5" />
        In Progress
      </span>
    );
  }
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-medium whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Resolved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-[11px] font-medium whitespace-nowrap">
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    subject: '',
    reference: '',
    description: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('vendor_id', user.id)
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

      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          vendor_id: user.id,
          subject: form.subject,
          reference: form.reference,
          description: form.description,
          status: 'open'
        }]);

      if (error) throw error;

      alert('Support ticket submitted successfully!');
      setForm({ subject: '', reference: '', description: '' });
      
      fetchTickets();
      
    } catch (err: any) {
      alert('Error submitting ticket: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const inputClass = "w-full h-[38px] px-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors";
  const labelClass = "block font-semibold text-zinc-800 mb-2 text-xs";

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Help & Seller Support</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Operational guides, mall concierge dispatch rules, and support ticket tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* فرم ثبت تیکت جدید */}
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
              <label className={labelClass}>Order or SKU Reference (Optional)</label>
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
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Explain your issue or request in detail..."
                className="w-full p-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 mt-2 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* لیست تیکت‌ها (طراحی جدید آکاردئونی) */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-fit flex flex-col min-h-[300px] overflow-hidden">
          <div className="p-6 sm:px-8 sm:pt-8 sm:pb-6 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-900">Your Support Tickets</h2>
          </div>
          
          {isLoading ? (
             <div className="flex-1 flex flex-col items-center justify-center py-12">
               <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
               <p className="text-xs font-medium text-zinc-500">Loading your tickets...</p>
             </div>
          ) : tickets.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
               <AlertCircle className="w-10 h-10 text-zinc-300 mb-3" />
               <h3 className="text-sm font-semibold text-zinc-900">No tickets found</h3>
               <p className="text-xs text-zinc-500 mt-1">You haven't submitted any support requests yet.</p>
             </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="group">
                  {/* هدر تیکت (بخش قابل کلیک) */}
                  <div 
                    onClick={() => toggleExpand(ticket.id)}
                    className={`p-5 sm:px-8 flex items-center justify-between gap-4 cursor-pointer transition-colors ${expandedId === ticket.id ? 'bg-zinc-50/50' : 'hover:bg-zinc-50/50'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <TicketStatusBadge status={ticket.status} />
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
                        {ticket.subject}
                      </h3>
                      {ticket.reference && (
                        <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          Ref: {ticket.reference}
                        </p>
                      )}
                    </div>
                    <div className="text-zinc-400 shrink-0">
                      {expandedId === ticket.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* بدنه تیکت (محیط گفتگو) */}
                  {expandedId === ticket.id && (
                    <div className="px-5 sm:px-8 pb-6 pt-2 bg-zinc-50/50 animate-in slide-in-from-top-2 duration-200 fade-in flex flex-col gap-5 border-t border-zinc-100/50">
                      
                      {/* پیام کاربر */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center shrink-0 mt-1">
                          <User className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                        <div className="flex-1 bg-white border border-zinc-200/80 p-3.5 rounded-2xl rounded-tl-sm shadow-sm">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">You</div>
                          <p className="text-zinc-700 text-xs leading-relaxed whitespace-pre-wrap">
                            {ticket.description}
                          </p>
                        </div>
                      </div>

                      {/* پیام ادمین (اگر وجود داشته باشد) */}
                      {ticket.admin_reply ? (
                        <div className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-1">
                            <Headset className="w-3.5 h-3.5 text-emerald-700" />
                          </div>
                          <div className="flex-1 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl rounded-tl-sm shadow-sm">
                            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              Support Team
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <p className="text-emerald-900 text-xs leading-relaxed whitespace-pre-wrap">
                              {ticket.admin_reply}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 italic pl-10">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Waiting for support team response...
                        </div>
                      )}

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}