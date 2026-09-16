'use client';

import React, { createContext, useContext, useState } from 'react';

// ۱. تعریف می‌کنیم که هر محصول در سبد خرید چه اطلاعاتی دارد
export interface CartItem {
  id: string; // شناسه یکتا (مثلاً ترکیب اسم و سایز)
  productId: string;
  name: string;
  price: string;
  image: string;
  size: string;
  quantity: number; // تعداد
}

interface CartContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[]; // لیست محصولات
  addToCart: (item: CartItem) => void; // تابع اضافه کردن
  removeFromCart: (id: string) => void; // تابع حذف کردن
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // منطق هوشمند برای اضافه کردن محصول
  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      // اگر این کالا با همین سایز قبلاً تو سبد بود، فقط تعدادش رو ببر بالا
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // وگرنه به عنوان یک کالای جدید اضافه‌اش کن
      return [...prev, newItem];
    });
  };

  // منطق حذف محصول
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ isCartOpen, openCart, closeCart, cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};