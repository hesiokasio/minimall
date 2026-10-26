'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

export default function StorefrontCampaigns() {
  const [banners, setBanners] = useState<any[]>([]);
  const [closedBanners, setClosedBanners] = useState<string[]>([]);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const fetchActiveCampaigns = async () => {
      const { data } = await supabase
        .from('campaign_banners')
        .select('*')
        .eq('is_active', true);
      if (data) setBanners(data);
    };
    fetchActiveCampaigns();
  }, []);

  // عدم نمایش بنرها در صفحات ادمین
  if (pathname.startsWith('/admin')) return null;

  const activeBanners = banners.filter(banner => {
    if (closedBanners.includes(banner.id)) return false;
    
    if (banner.target_page === 'all') return true;
    if (banner.target_page === 'home' && pathname === '/') return true;
    if (banner.target_page === 'shop' && pathname.includes('/shop')) return true;
    if (banner.target_page === 'checkout' && pathname.includes('/checkout')) return true;
    return false;
  });

  // تفکیک بنرها بر اساس جایگاهی که شما در پنل انتخاب کرده‌اید
  const topBarBanner = activeBanners.find(b => b.position === 'top_bar');
  const popupBanner = activeBanners.find(b => b.position === 'popup');
  const floatingBanner = activeBanners.find(b => b.position === 'floating');

  return (
    <>
      {/* 1. نوار اطلاع‌رسانی بالا (Top Bar) */}
      {topBarBanner && (
        <div className="relative bg-zinc-900 text-white w-full z-40">
          <Link href={topBarBanner.target_link || '#'} className="block">
            {topBarBanner.image_url ? (
              <div className="w-full h-12 sm:h-14 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                <img src={topBarBanner.image_url} alt={topBarBanner.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="w-full py-2.5 px-10 text-center text-xs sm:text-sm font-medium hover:text-zinc-200 transition-colors">
                {topBarBanner.title}
              </div>
            )}
          </Link>
          <button onClick={(e) => { e.preventDefault(); setClosedBanners([...closedBanners, topBarBanner.id]); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. پاپ‌آپ وسط صفحه (Popup) */}
      {popupBanner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <button onClick={() => setClosedBanners([...closedBanners, popupBanner.id])} className="absolute top-3 right-3 z-10 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
              <X className="w-5 h-5" />
            </button>
            <Link href={popupBanner.target_link || '#'}>
              {popupBanner.image_url ? (
                <img src={popupBanner.image_url} alt={popupBanner.title} className="w-full h-auto max-h-[70vh] object-cover" />
              ) : (
                <div className="p-12 text-center text-xl font-bold text-zinc-900">{popupBanner.title}</div>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* 3. بنر شناور گوشه پایین (Floating) */}
      {floatingBanner && (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 duration-500">
          <div className="relative group">
            <button onClick={() => setClosedBanners([...closedBanners, floatingBanner.id])} className="absolute -top-2 -right-2 z-10 p-1 bg-white text-zinc-900 shadow-md rounded-full border border-zinc-200 hover:bg-zinc-100 transition-colors opacity-0 group-hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
            <Link href={floatingBanner.target_link || '#'}>
              {floatingBanner.image_url ? (
                <img src={floatingBanner.image_url} alt={floatingBanner.title} className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl shadow-2xl object-cover border-2 border-white" />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-zinc-900 text-white rounded-xl shadow-2xl flex items-center justify-center p-4 text-center text-sm font-semibold border-2 border-white">
                  {floatingBanner.title}
                </div>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}