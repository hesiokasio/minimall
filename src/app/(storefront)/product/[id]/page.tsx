'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import Container from '../../../../components/layout/Container';
import { ChevronDown, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { createClient } from '../../../../utils/supabase/client'; // 🔴 اتصال به دیتابیس واقعی

const Accordion = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/10 py-4" dir="rtl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-right font-medium text-[#222222] hover:text-black transition-colors"
      >
        <span>{title}</span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-3' : 'max-h-0'}`}>
        <p className="text-[#717171] text-sm leading-relaxed pl-6 text-justify">{children}</p>
      </div>
    </div>
  );
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔴 تبدیل سایز به سیستم رنگ‌بندی برای پودرهای بندکشی پرومر
  const [selectedColor, setSelectedColor] = useState('سفید');
  const colors = ['سفید', 'مشکی', 'طوسی', 'کرم', 'قهوه‌ای', 'بژ', 'آجری', 'نقره‌ای']; 
  
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart } = useCart(); 
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      // 🔴 استفاده از maybeSingle باعث می‌شود اگر محصول پیدا نشد صفحه کرش نکند
      const { data, error } = await supabase
        .from('products')
        .select('*, stores(brand_name)')
        .eq('id', productId)
        .maybeSingle();

      if (error) {
        // حالا اگر اروری باشد متن دقیق آن را در کنسول می‌نویسد
        console.error('جزئیات ارور دیتابیس:', error.message, error.details);
      }

      if (data) {
        setProduct(data);
      }
      setIsLoading(false);
    };
    
    if (productId) getProduct();
  }, [productId]);

  // چون الان در دیتابیس یک عکس (image_url) داریم، آن را در آرایه قرار می‌دهیم
  const displayImages = product?.image_url ? [product.image_url] : [];
  const nextImage = () => setCurrentImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));

  const handleAddToCart = () => {
    if (!product) return; 
    
    addToCart({
      id: `${product.id}-${selectedColor}`, // آیدی یکتا ترکیب محصول و رنگ
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      size: selectedColor, // رنگ را به جای سایز به سبد می‌فرستیم
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">محصول پیدا نشد!</h1>
          <a href="/" className="text-sm underline underline-offset-4 hover:opacity-70 transition-opacity">بازگشت به صفحه اصلی</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#222222] font-sans bg-white flex flex-col selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-grow w-full py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            
            {/* 🔴 بخش عکس محصول */}
            <div className="md:col-span-7 flex flex-col">
              <div className="relative w-full aspect-[4/5] md:aspect-square bg-[#f4f3f0] rounded-3xl overflow-hidden group border border-black/5">
                <div 
                  className="flex w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentImage * 100}%)` }}
                >
                  {displayImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`${product.name} - ${idx + 1}`} className="w-full h-full object-cover shrink-0 mix-blend-multiply" />
                  ))}
                  {displayImages.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-black/20 text-sm">عکسی موجود نیست</div>
                  )}
                </div>
              </div>
            </div>

            {/* 🔴 بخش اطلاعات محصول (راست‌چین شده برای فارسی) */}
            <div className="md:col-span-5 relative" dir="rtl">
              <div className="md:sticky md:top-[120px] flex flex-col">
                
                <span className="text-sm text-black/50 tracking-widest font-bold mb-3 inline-block">
                  {product.stores?.brand_name || 'فروشگاه'}
                </span>
                
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <span className="text-2xl font-black mb-6 text-black flex items-center gap-2">
                  {product.price.toLocaleString()} <span className="text-sm font-medium text-black/50">تومان</span>
                </span>
                
                <p className="text-[#717171] leading-relaxed mb-8 text-sm md:text-base text-justify">
                  {product.description || 'بهترین کیفیت متریال ساختمانی با تکنولوژی روز. طراحی شده برای ماندگاری بالا و مقاومت در برابر شرایط مختلف جوی.'}
                </p>

                {/* انتخاب رنگ */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-sm">انتخاب رنگ: <span className="text-black/60 font-normal pr-2">{selectedColor}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                          selectedColor === color 
                            ? 'border-black bg-black text-white shadow-md' 
                            : 'border-black/10 text-black/70 hover:border-black/30 hover:bg-black/5 bg-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* دکمه افزودن به سبد خرید */}
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all mb-8 flex items-center justify-center gap-2 shadow-lg
                    ${isAdded ? 'bg-green-600 text-white shadow-green-600/20 scale-[0.98]' : 'bg-black text-white hover:bg-black/90 hover:scale-[0.99] active:scale-95 shadow-black/20'}
                  `}
                >
                  {isAdded ? '✓ به سبد خرید اضافه شد' : <><ShoppingBag size={20} /> افزودن به سبد خرید</>}
                </button>

                {/* آکاردئون توضیحات تکمیلی */}
                <div className="border-t border-black/10 mt-2">
                  <Accordion title="مشخصات فنی">تولید شده با تکنولوژی الاستومری، مقاوم در برابر ترک‌خوردگی، کاملاً ضدآب و آنتی‌باکتریال. مناسب برای فضاهای داخلی و خارجی.</Accordion>
                  <Accordion title="نحوه ارسال">ارسال فوری برای سفارشات تهران توسط پیک و ارسال به شهرستان‌ها از طریق باربری معتبر در بسته‌بندی کاملاً ایمن.</Accordion>
                  <Accordion title="پشتیبانی و ضمانت">دارای ضمانت اصالت و سلامت فیزیکی کالا. پشتیبانی فنی تیم پرومر برای راهنمایی در نحوه استفاده.</Accordion>
                </div>
                
              </div>
            </div>

          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}