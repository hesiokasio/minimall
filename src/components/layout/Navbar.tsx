import React from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white flex justify-between items-center p-6 md:p-10 pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto cursor-pointer hover:opacity-70 transition-opacity">
        <Menu size={24} strokeWidth={1.5} />
        <span className="text-xs uppercase tracking-[0.3em] hidden md:block mt-1 font-medium">Menu</span>
      </div>
      
      <div className="text-2xl tracking-tighter font-semibold pointer-events-auto cursor-pointer">
        MINI<span className="font-light">MALL</span>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        <Search size={20} strokeWidth={1.5} className="cursor-pointer hover:opacity-70 transition-opacity" />
        <ShoppingBag size={20} strokeWidth={1.5} className="cursor-pointer hover:opacity-70 transition-opacity" />
      </div>
    </nav>
  );
};

export default Navbar;