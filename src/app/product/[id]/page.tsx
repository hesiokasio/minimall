'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Container from '../../../components/layout/Container';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
// ۱. وارد کردن مغز متفکر
import { useCart } from '../../../context/CartContext'; 

const MOCK_PRODUCT = {
  id: '1',
  name: 'Obsidian Chronograph',
  price: '$1,200',
  description: 'A minimalist timepiece crafted from brushed titanium and featuring a deep obsidian dial. Engineered for precision and designed for the modern aesthetic.',
  category: 'Watches',
  images: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&q=80'
  ]
};

const Accordion = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/10 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-medium text-[#222222] hover:text-black transition-colors"
      >
        {title}
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-3' : 'max-h-0'}`}>
        <p className="text-[#717171] text-sm leading-relaxed pr-6">{children}</p>
      </div>
    </div>
  );
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState('Standard');
  const sizes = ['Small', 'Standard', 'Large'];

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => setCurrentImage((prev) => (prev === MOCK_PRODUCT.images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? MOCK_PRODUCT.images.length - 1 : prev - 1));

  // ۲. فقط تابع "اضافه کردن" را از مغز متفکر می‌گیریم
  const { addToCart } = useCart(); 
  // یک متغیر برای تغییر رنگ دکمه به مدت ۲ ثانیه
  const [isAdded, setIsAdded] = useState(false);

  // ۳. تابعی که با کلیک روی دکمه اجرا می‌شود
  const handleAddToCart = () => {
    addToCart({
      id: `${MOCK_PRODUCT.id}-${selectedSize}`, // برای اینکه سایزهای مختلف جدا ثبت شوند
      productId: MOCK_PRODUCT.id,
      name: MOCK_PRODUCT.name,
      price: MOCK_PRODUCT.price,
      image: MOCK_PRODUCT.images[0],
      size: selectedSize,
      quantity: 1,
    });

    // دکمه را سبز کن و بعد از ۲ ثانیه برگردان به حالت اول
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen text-[#222222] font-sans bg-white flex flex-col selection:bg-black selection:text-white">
      <Navbar />

      <main className="flex-grow w-full py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            
            {/* ستون چپ: گالری اسلایدر */}
            <div className="md:col-span-7 flex flex-col">
              <div className="relative w-full aspect-[4/5] md:aspect-square bg-[#f4f3f0] rounded-2xl overflow-hidden group">
                <div 
                  className="flex w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentImage * 100}%)` }}
                >
                  {MOCK_PRODUCT.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${MOCK_PRODUCT.name} - View ${idx + 1}`} className="w-full h-full object-cover shrink-0 mix-blend-multiply" />
                  ))}
                </div>

                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm hover:scale-105 active:scale-95">
                  <ChevronLeft size={24} />
                </button>

                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm hover:scale-105 active:scale-95">
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {MOCK_PRODUCT.images.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentImage(idx)} className={`transition-all duration-300 rounded-full ${currentImage === idx ? 'w-6 h-2 bg-black' : 'w-2 h-2 bg-black/20 hover:bg-black/50'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* ستون راست: اطلاعات */}
            <div className="md:col-span-5 relative">
              <div className="md:sticky md:top-[120px] flex flex-col">
                
                <span className="text-sm text-[#717171] uppercase tracking-widest font-semibold mb-3">{MOCK_PRODUCT.category}</span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{MOCK_PRODUCT.name}</h1>
                <span className="text-2xl font-medium mb-6 block">{MOCK_PRODUCT.price}</span>
                <p className="text-[#717171] leading-relaxed mb-8">{MOCK_PRODUCT.description}</p>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-sm">Size / Fit</span>
                    <button className="text-sm text-[#717171] underline underline-offset-4 hover:text-black">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-black/10 text-black hover:border-black/40'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ۴. دکمه هوشمند که با کلیک سبز می‌شود */}
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`w-full py-4 rounded-full font-semibold text-lg transition-all mb-8 flex items-center justify-center gap-2 cursor-pointer
                    ${isAdded ? 'bg-[#222222] text-white scale-[0.99]' : 'bg-black text-white hover:bg-black/90 hover:scale-[0.99] active:scale-95'}
                  `}
                >
                  {isAdded ? 'Added ✓' : 'Add to Cart'}
                </button>

                <div className="border-t border-black/10">
                  <Accordion title="Materials & Care">Crafted from aerospace-grade titanium with a sapphire crystal face. Water-resistant up to 50 meters. Wipe clean with a microfiber cloth.</Accordion>
                  <Accordion title="Shipping & Returns">Complimentary express shipping on all orders. Returns accepted within 14 days in original packaging.</Accordion>
                  <Accordion title="Warranty">Covered by a 2-year international warranty against manufacturing defects.</Accordion>
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