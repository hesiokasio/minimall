'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import Container from '../../../../components/layout/Container';
import { ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, Store as StoreIcon, Check } from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { createClient } from '../../../../utils/supabase/client';

const Accordion = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/10 py-4" dir="rtl">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-right font-medium text-[#222222] hover:text-black transition-colors cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 mt-3' : 'max-h-0'}`}>
        <div className="text-[#717171] text-sm leading-relaxed pl-6 text-justify">{children}</div>
      </div>
    </div>
  );
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart, openCart } = useCart(); 
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select('*, stores(id, name, brand_name)')
        .eq('id', productId)
        .maybeSingle();

      if (error) {
        console.error('جزئیات ارور دیتابیس:', error.message, error.details);
      }

      if (data) {
        setProduct(data);

        if (data.color) {
          const parsedColors = String(data.color).split(/[,،]/).map((c: string) => c.trim()).filter(Boolean);
          if (parsedColors.length > 0) setSelectedColor(parsedColors[0]);
        }

        if (data.size) {
          const parsedSizes = String(data.size).split(/[,،]/).map((s: string) => s.trim()).filter(Boolean);
          if (parsedSizes.length > 0) setSelectedSize(parsedSizes[0]);
        }
      }
      setIsLoading(false);
    };
    
    if (productId) getProduct();
  }, [productId]);

  const displayImages: string[] = 
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : product?.image_url
      ? [product.image_url]
      : product?.image
      ? [product.image]
      : [];

  const availableColors: string[] = product?.color
    ? String(product.color).split(/[,،]/).map((c: string) => c.trim()).filter(Boolean)
    : [];

  const availableSizes: string[] = product?.size
    ? String(product.size).split(/[,،]/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  const storeName = product?.stores?.name || product?.stores?.brand_name || 'فروشگاه رسمی';
  const storeId = product?.stores?.id || product?.store_id;
  const isOutOfStock = product?.stock !== undefined && Number(product.stock) <= 0;

  // محاسبه دقیق قیمت و تخفیف در صفحه جزئیات محصول
  const originalPrice = Number(product?.price) || 0;
  const discountPercent = Number(product?.discount_percent) || 0;
  const hasDiscount = discountPercent > 0 || (product?.discount_price && Number(product.discount_price) < originalPrice);
  
  const finalPrice = product?.discount_price 
    ? Number(product.discount_price) 
    : discountPercent > 0 
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : originalPrice;

  const calculatedPercent = discountPercent > 0 
    ? discountPercent 
    : hasDiscount && originalPrice > 0 
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
      : 0;

  const nextImage = () => setCurrentImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return; 
    
    const variantLabel = [selectedColor, selectedSize].filter(Boolean).join(' / ') || 'Standard';

    addToCart({
      id: `${product.id}-${variantLabel}`,
      productId: product.id,
      name: product.name,
      price: String(finalPrice), // ارسال قیمت نهایی (با احتساب تخفیف) به سبد خرید
      image: displayImages[0] || '',
      size: variantLabel,
      quantity: 1,
    });

    setIsAdded(true);
    openCart();
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
          <Link href="/" className="text-sm underline underline-offset-4 hover:opacity-70 transition-opacity">بازگشت به صفحه اصلی</Link>
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
            
            {/* بخش گالری عکس محصول */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="relative w-full aspect-[4/5] md:aspect-square bg-[#f4f3f0] rounded-3xl overflow-hidden group border border-black/5">
                
                {/* بج درصد تخفیف روی عکس بزرگ محصول */}
                {hasDiscount && calculatedPercent > 0 && (
                  <div className="absolute top-5 left-5 z-20 bg-rose-600 text-white text-xs md:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-md tracking-tight">
                    -{calculatedPercent}% OFF
                  </div>
                )}

                <div 
                  className="flex w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentImage * 100}%)` }}
                >
                  {displayImages.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`${product.name} - ${idx + 1}`} 
                      className="w-full h-full object-cover shrink-0 mix-blend-multiply" 
                    />
                  ))}
                  {displayImages.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-black/30 text-sm">
                      عکسی برای این محصول ثبت نشده است
                    </div>
                  )}
                </div>

                {displayImages.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        currentImage === idx ? 'border-black scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* بخش اطلاعات داینامیک محصول */}
            <div className="md:col-span-5 relative" dir="rtl">
              <div className="md:sticky md:top-[120px] flex flex-col">
                
                {/* نام فروشگاه و دسته‌بندی */}
                <div className="flex items-center justify-between mb-3">
                  {storeId ? (
                    <Link 
                      href={`/store/${storeId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-black/60 hover:text-black bg-black/[0.04] hover:bg-black/[0.08] px-3 py-1.5 rounded-full transition-colors"
                    >
                      <StoreIcon size={14} />
                      <span>{storeName}</span>
                    </Link>
                  ) : (
                    <span className="text-sm text-black/50 tracking-widest font-bold">
                      {storeName}
                    </span>
                  )}

                  {product.category && (
                    <span className="text-xs font-mono text-black/40 uppercase">
                      {product.category}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* نمایش قیمت (به همراه قیمت خط‌خورده و درصد تخفیف در صورت وجود) */}
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-black/5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-2xl md:text-3xl font-black flex items-center gap-1.5 ${hasDiscount ? 'text-rose-600' : 'text-black'}`}>
                        {finalPrice.toLocaleString()} <span className="text-sm font-medium text-black/50">تومان</span>
                      </span>
                      {hasDiscount && calculatedPercent > 0 && (
                        <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-2 py-0.5 rounded-lg">
                          {calculatedPercent}%-
                        </span>
                      )}
                    </div>

                    {hasDiscount && (
                      <span className="text-sm text-black/40 line-through font-medium">
                        {originalPrice.toLocaleString()} تومان
                      </span>
                    )}
                  </div>

                  {product.stock !== undefined && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isOutOfStock 
                        ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isOutOfStock ? 'ناموجود' : `موجود در انبار (${product.stock} عدد)`}
                    </span>
                  )}
                </div>
                
                {/* نمایش توضیحات محصول در صفحه جزئیات */}
                {product.description && (
                  <div className="mb-8">
                    <h3 className="text-xs font-bold text-black/50 mb-2">درباره محصول:</h3>
                    <p className="text-[#555555] leading-relaxed text-sm md:text-base text-justify whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* انتخاب رنگ */}
                {availableColors.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm">رنگ: <span className="text-black/60 font-normal pr-1">{selectedColor}</span></span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            selectedColor === color 
                              ? 'border-black bg-black text-white shadow-sm' 
                              : 'border-black/10 text-black/70 hover:border-black/30 hover:bg-black/5 bg-white'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* انتخاب سایز / ابعاد */}
                {availableSizes.length > 0 && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm">سایز / ابعاد: <span className="text-black/60 font-normal pr-1">{selectedSize}</span></span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            selectedSize === size 
                              ? 'border-black bg-black text-white shadow-sm' 
                              : 'border-black/10 text-black/70 hover:border-black/30 hover:bg-black/5 bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* دکمه افزودن به سبد خرید */}
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded || isOutOfStock}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all mb-8 flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:cursor-not-allowed
                    ${isOutOfStock 
                      ? 'bg-zinc-200 text-zinc-500 shadow-none' 
                      : isAdded 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20 scale-[0.98]' 
                      : 'bg-black text-white hover:bg-black/90 hover:scale-[0.99] active:scale-95 shadow-black/20'
                    }
                  `}
                >
                  {isOutOfStock ? (
                    'اتمام موجودی'
                  ) : isAdded ? (
                    <><Check size={20} /> به سبد خرید اضافه شد</>
                  ) : (
                    <><ShoppingBag size={20} /> افزودن به سبد خرید</>
                  )}
                </button>

                {/* آکاردئون مشخصات فنی */}
                <div className="border-t border-black/10 mt-2">
                  <Accordion title="مشخصات کالا">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/50">کد کالا (SKU):</span>
                        <span className="font-mono font-semibold text-black">{product.sku || '—'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/50">دسته‌بندی:</span>
                        <span className="font-semibold text-black">{product.category || 'عمومی'}</span>
                      </div>
                      {product.unit && (
                        <div className="flex justify-between py-1 border-b border-black/5">
                          <span className="text-black/50">واحد فروش:</span>
                          <span className="font-semibold text-black">{product.unit}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1">
                        <span className="text-black/50">فروشنده:</span>
                        <span className="font-semibold text-black">{storeName}</span>
                      </div>
                    </div>
                  </Accordion>
                  <Accordion title="نحوه ارسال و تحویل">
                    پردازش و ارسال مستقیم از انبار غرفه «{storeName}» انجام می‌شود. زمان تحویل بسته به شهر مقصد و روش ارسال انتخابی در مرحله تسویه‌حساب محاسبه خواهد شد.
                  </Accordion>
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