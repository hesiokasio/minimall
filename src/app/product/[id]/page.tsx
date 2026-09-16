'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Container from '../../../components/layout/Container';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

import { fetchProductById } from '../../../data/mockData';
import { Product } from '../../../types';

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

// 🔴 تغییر اول: نوع params رو به Promise تغییر دادیم
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 🔴 تغییر دوم: با استفاده از React.use، آیدی رو از دلِ پارامترها بیرون کشیدیم
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('Standard');
  const sizes = ['Small', 'Standard', 'Large'];
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart } = useCart(); 
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      // 🔴 تغییر سوم: حالا از متغیر جدید productId استفاده می‌کنیم
      const data = await fetchProductById(productId);
      if (data) {
        setProduct(data);
      }
      setIsLoading(false);
    };
    getProduct();
  }, [productId]); // 🔴 اینجا هم productId جایگزین شد

  const displayImages = product?.images || (product?.image ? [product.image] : []);
  const nextImage = () => setCurrentImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));

  const handleAddToCart = () => {
    if (!product) return; 
    addToCart({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
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
          <h1 className="text-2xl font-bold">Product not found</h1>
          <a href="/" className="text-sm underline underline-offset-4 hover:opacity-70 transition-opacity">Return to Home</a>
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
            
            <div className="md:col-span-7 flex flex-col">
              <div className="relative w-full aspect-[4/5] md:aspect-square bg-[#f4f3f0] rounded-2xl overflow-hidden group">
                <div 
                  className="flex w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentImage * 100}%)` }}
                >
                  {displayImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`${product.name} - View ${idx + 1}`} className="w-full h-full object-cover shrink-0 mix-blend-multiply" />
                  ))}
                </div>

                {displayImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm hover:scale-105 active:scale-95">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm hover:scale-105 active:scale-95">
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      {displayImages.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentImage(idx)} className={`transition-all duration-300 rounded-full ${currentImage === idx ? 'w-6 h-2 bg-black' : 'w-2 h-2 bg-black/20 hover:bg-black/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-5 relative">
              <div className="md:sticky md:top-[120px] flex flex-col">
                
                <span className="text-sm text-[#717171] uppercase tracking-widest font-semibold mb-3">{product.category || 'Shop'}</span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
                <span className="text-2xl font-medium mb-6 block">{product.price}</span>
                <p className="text-[#717171] leading-relaxed mb-8">{product.description || 'No description available for this product.'}</p>

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