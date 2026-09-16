'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
// ۱. وصل شدن به مغز متفکر
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  // ۲. گرفتن لیست محصولات و تابع حذف از کانتکست
  const { cartItems, removeFromCart } = useCart();

  // ۳. تابع هوشمند برای محاسبه جمع کل قیمت‌ها
  const calculateSubtotal = () => {
    const total = cartItems.reduce((acc, item) => {
      // تبدیل قیمت متنی (مثل "$1,200") به عدد ریاضی (1200) برای ضرب در تعداد
      const priceNumber = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
      return acc + (priceNumber * item.quantity);
    }, 0);
    
    // برگرداندن عدد نهایی به فرمت پول با علامت دلار و کاما
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(total);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* پس‌زمینه تاریک */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* پنل کشویی */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[420px] h-full bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* هدر کشو */}
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#222222]">
                <ShoppingBag size={20} />
                Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#222222]">
                <X size={20} />
              </button>
            </div>

            {/* محتوای سبد خرید */}
            <div className="flex-grow p-6 overflow-y-auto">
              {/* اگر سبد خالی بود این پیام را نشان بده */}
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#717171]">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* رندر کردن محصولات واقعی */}
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div 
                        layout 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.9 }} 
                        key={item.id} 
                        className="flex gap-4 group"
                      >
                        <div className="w-20 h-24 bg-[#f4f3f0] rounded-xl overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        
                        <div className="flex flex-col justify-center w-full">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-[15px] text-[#222222] pr-2">{item.name}</h3>
                            {/* دکمه سطل زباله / حذف */}
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-black/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <span className="text-[#717171] text-sm mt-1">
                            Size: {item.size} {item.quantity > 1 && <span className="font-semibold text-black ml-1">(x{item.quantity})</span>}
                          </span>
                          <span className="font-semibold mt-2 text-[#222222]">{item.price}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* فوتر (فقط وقتی نمایش داده می‌شود که سبد خالی نباشد) */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-black/5 bg-white">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-[#717171]">Subtotal</span>
                  <span className="font-bold text-xl text-[#222222]">{calculateSubtotal()}</span>
                </div>
                <button className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-black/90 active:scale-95 transition-all">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;