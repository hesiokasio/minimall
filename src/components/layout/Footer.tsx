import React from 'react';

const Footer = () => {
  return (
    // حذف گوشه‌های گرد و مارجین منفی، تغییر رنگ به زغالی مات
    <footer className="w-full bg-[#161616] text-white pt-24 pb-20 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      
      {/* واترمارک غول‌پیکر پس‌زمینه (مثل عدد 2036 در عکس شما، من 2026 گذاشتم) */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[15rem] md:text-[22rem] font-bold text-white/[0.03] pointer-events-none select-none leading-none tracking-tighter z-0">
        2026
      </div>

      {/* کانتینر اصلی محتوا */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-24">
        
        {/* ستون چپ: لوگو و توضیحات */}
        <div className="max-w-sm">
          <h2 className="text-3xl font-medium tracking-tight mb-6 flex items-center gap-2">
            {/* می‌توانید اسم برند خودتان مثل PROMER را اینجا جایگزین کنید */}
            SPATIAL<span className="font-light">COMMERCE</span>
          </h2>
          <p className="text-[13px] text-white/50 leading-relaxed font-light">
            Defining the next era of digital commerce through spatial interfaces and curated editorial experiences.
          </p>
        </div>

        {/* ستون راست: لینک‌ها */}
        <div className="flex gap-16 md:gap-28">
          
          {/* ستون شبکه‌های اجتماعی */}
          <div className="flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1 block">
              Connect
            </span>
            <a href="#" className="text-sm font-light text-white/70 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-sm font-light text-white/70 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-sm font-light text-white/70 hover:text-white transition-colors">LinkedIn</a>
          </div>
          
          {/* ستون قوانین و مقررات */}
          <div className="flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1 block">
              Legal
            </span>
            <a href="#" className="text-sm font-light text-white/70 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm font-light text-white/70 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-sm font-light text-white/70 hover:text-white transition-colors">Returns</a>
          </div>

        </div>
      </div>
      
    </footer>
  );
};

export default Footer;