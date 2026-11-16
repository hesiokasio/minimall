'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Ticket, Clock, CheckCircle2, AlertCircle,
  Loader2, ChevronLeft, ChevronRight, MessageSquareReply,
  ChevronDown, ChevronUp, User, CornerDownRight
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';
import TablePagination from '../../../../components/layout/TablePagination';

const StatusBadge = ({ status }: { status: string }) => {
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

export default function AdminTicketsPage() {
  const supabase = createClient();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSavingReply, setIsSavingReply] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    
    // ۱. گرفتن تمام تیکت‌ها
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (ticketsError) {
      console.error('Error fetching tickets:', ticketsError);
      setIsLoading(false);
      return;
    }

    if (ticketsData && ticketsData.length > 0) {
      // استخراج آیدی فروشندگان
      const vendorIds = [...new Set(ticketsData.map(t => t.vendor_id))];
      
      // ۲. گرفتن اطلاعات فروشگاه‌ها
      const { data: storesData } = await supabase
        .from('stores')
        .select('owner_id, name, phone, mall_id, floor, unit') 
        .in('owner_id', vendorIds);

      // ۳. گرفتن نام پاساژها (اضافه شدن این بخش برای تبدیل آیدی به اسم)
      let mallsData: any[] = [];
      if (storesData && storesData.length > 0) {
        const mallIds = [...new Set(storesData.map(s => s.mall_id).filter(Boolean))];
        if (mallIds.length > 0) {
          const { data: mData } = await supabase
            .from('malls')
            .select('id, name')
            .in('id', mallIds);
          mallsData = mData || [];
        }
      }

      // ۴. ترکیب همه اطلاعات با هم
      const enrichedTickets = ticketsData.map(ticket => {
        const store = storesData?.find(s => s.owner_id === ticket.vendor_id);
        const mall = mallsData?.find(m => m.id === store?.mall_id); // پیدا کردن نام پاساژ

        return {
          ...ticket,
          storeName: store?.name || 'Unknown Store',
          storePhone: store?.phone || 'No Phone',
          storeMall: mall?.name || 'Unknown Mall', // 🟢 حالا نام پاساژ جایگزین شناسه می‌شود
          storeFloor: store?.floor || '-',
          storeUnit: store?.unit || '-'
        };
      });
      
      setTickets(enrichedTickets);
    } else {
      setTickets([]);
    }
    
    setIsLoading(false);
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    const originalTickets = [...tickets];
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));

    const { error } = await supabase
      .from('support_tickets')
      .update({ status: newStatus })
      .eq('id', ticketId);

    if (error) {
      alert('خطا در بروزرسانی وضعیت تیکت');
      setTickets(originalTickets); 
    }
  };

  const handleSaveReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    setIsSavingReply(true);

    const { error } = await supabase
      .from('support_tickets')
      .update({ admin_reply: replyText.trim(), status: 'resolved' })
      .eq('id', ticketId);

    if (error) {
      alert('خطا در ثبت پاسخ: ' + error.message);
    } else {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, admin_reply: replyText.trim(), status: 'resolved' } : t));
      setReplyText('');
    }
    setIsSavingReply(false);
  };

  const toggleExpand = (ticket: any) => {
    if (expandedId === ticket.id) {
      setExpandedId(null);
      setReplyText('');
    } else {
      setExpandedId(ticket.id);
      setReplyText(ticket.admin_reply || '');
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.storeName && t.storeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.reference && t.reference.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Support Tickets</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80">
              {tickets.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage and resolve all vendor support requests across the platform.
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-3 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, subject, or reference..."
              className="w-full h-[38px] pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="w-full h-[38px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:bg-white transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
            <p className="text-xs font-medium text-zinc-500">Loading tickets and store data...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full flex-1">
            <Ticket className="w-10 h-10 text-zinc-300 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-900">No tickets found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">There are no support requests matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-[10px] font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">
                    <th className="py-3 px-5 w-6"></th>
                    <th className="py-3 px-4">Ticket Subject & Ref</th>
                    <th className="py-3 px-4">Store Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {currentTickets.map((ticket) => (
                    <React.Fragment key={ticket.id}>
                      <tr 
                        onClick={() => toggleExpand(ticket)}
                        className={`group border-b border-zinc-100 cursor-pointer transition-colors ${expandedId === ticket.id ? 'bg-zinc-50/80' : 'hover:bg-zinc-50/50'}`}
                      >
                        {/* 1. Expand Icon */}
                        <td className="py-4 px-5 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                          {expandedId === ticket.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </td>
                        
                        {/* 2. Subject & Ref */}
                        <td className="py-4 px-4 min-w-[200px] max-w-[250px]">
                          <div className="font-semibold text-zinc-900 truncate">
                            {ticket.subject}
                          </div>
                          {ticket.reference && (
                            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                              Ref: {ticket.reference}
                            </div>
                          )}
                        </td>

                        {/* 3. Store Name */}
                        <td className="py-4 px-4 text-zinc-900 font-medium whitespace-nowrap">
                          {ticket.storeName}
                        </td>

                        {/* 4. Location (Mall, Floor, Unit) */}
                        <td className="py-4 px-4 text-zinc-600 whitespace-nowrap">
                          {ticket.storeMall} • Fl {ticket.storeFloor} • Unit {ticket.storeUnit}
                        </td>

                        {/* 5. Date */}
                        <td className="py-4 px-5 text-zinc-500 whitespace-nowrap">
                          {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>

                        {/* 6. Status */}
                        <td className="py-4 px-5">
                          <StatusBadge status={ticket.status} />
                        </td>

                        {/* 7. Action Dropdown */}
                        <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={ticket.status}
                            onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                            className="bg-white border border-zinc-200 text-zinc-700 text-[11px] font-medium rounded-lg px-2 py-1.5 focus:outline-none focus:border-zinc-400 cursor-pointer shadow-2xs hover:bg-zinc-50 transition-colors"
                          >
                            <option value="open">Set: Open</option>
                            <option value="in_progress">Set: In Progress</option>
                            <option value="resolved">Set: Resolved</option>
                          </select>
                        </td>
                      </tr>

                      {/* Expanded Chat Area */}
                      {expandedId === ticket.id && (
                        <tr className="border-b border-zinc-200/80 bg-zinc-50/50">
                          {/* Colspan changed to 7 to match new columns */}
                          <td colSpan={7} className="p-0">
                            <div className="p-6 sm:p-8 animate-in slide-in-from-top-2 duration-200 fade-in flex flex-col gap-6 border-l-[3px] border-l-blue-500">
                              
                              <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shrink-0 mt-1">
                                  <User className="w-4 h-4 text-zinc-500" />
                                </div>
                                <div className="flex-1 bg-white border border-zinc-200/70 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                    <span>Vendor Message</span>
                                    <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">Tel: {ticket.storePhone}</span>
                                  </div>
                                  <p className="text-zinc-700 text-xs leading-relaxed whitespace-pre-wrap">
                                    {ticket.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-4 pl-4 sm:pl-12">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 mt-2">
                                  <CornerDownRight className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="bg-white border border-zinc-200/70 p-4 rounded-2xl rounded-tl-sm shadow-sm focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400 transition-all">
                                    <div className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider mb-2">Admin Reply</div>
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Type your official reply here. The vendor will see this in their dashboard..."
                                      className="w-full bg-transparent border-none p-0 text-xs text-zinc-700 focus:outline-none focus:ring-0 resize-none min-h-[80px]"
                                    />
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                                      <span className="text-[10px] text-zinc-400">Replying will automatically mark ticket as Resolved.</span>
                                      <button 
                                        onClick={() => handleSaveReply(ticket.id)}
                                        disabled={isSavingReply || !replyText.trim() || replyText === ticket.admin_reply}
                                        className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-[11px] font-medium hover:bg-zinc-800 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                      >
                                        {isSavingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquareReply className="w-3.5 h-3.5" />}
                                        {ticket.admin_reply ? 'Update Reply' : 'Send Reply'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              totalItems={filteredTickets.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}