'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Search, Menu, Plus } from 'lucide-react';

// --- MOCK DATA ---
const SPATIAL_MALLS = [
  {
    id: 1,
    title: 'Aura District',
    subtitle: 'Avant-Garde & High Fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'The Monolith',
    subtitle: 'Minimalist Essentials',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Lumina Space',
    subtitle: 'Future Wear & Tech',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2187&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Echo Pavilion',
    subtitle: 'Sustainable Luxury',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
  }
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Obsidian Chronograph',
    price: '$1,200',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Silk Cascade Scarf',
    price: '$350',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1974&auto=format&fit=crop',
  }
];

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white flex justify-between items-center p-6 md:p-10 pointer-events-none">
    <div className="flex items-center gap-6 pointer-events-auto cursor-pointer hover:opacity-70 transition-opacity">
      <Menu size={24} strokeWidth={1.5} />
      <span className="text-xs uppercase tracking-[0.3em] hidden md:block mt-1 font-medium">Menu</span>
    </div>
    
    <div className="text-2xl tracking-tighter font-semibold pointer-events-auto cursor-pointer">
      ØMNI<span className="font-light">SPACE</span>
    </div>

    <div className="flex items-center gap-6 pointer-events-auto">
      <Search size={20} strokeWidth={1.5} className="cursor-pointer hover:opacity-70 transition-opacity" />
      <ShoppingBag size={20} strokeWidth={1.5} className="cursor-pointer hover:opacity-70 transition-opacity" />
    </div>
  </nav>
);

const Hero = () => {
  const carouselRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setDragConstraints(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, []);

  return (
    <section className="relative h-screen w-full bg-[#f4f3f0] overflow-hidden flex flex-col justify-center">
      {/* Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[15vw] leading-none font-bold tracking-tighter text-[#eae8e1] whitespace-nowrap">
          SPATIAL COMMERCE
        </h1>
      </div>

      <div className="z-10 w-full pl-6 md:pl-20 mt-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-[1px] bg-black"></div>
          <span className="uppercase text-xs tracking-[0.2em] font-medium text-black/60">
            Select a Destination
          </span>
        </div>

        <motion.div ref={carouselRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -dragConstraints }}
            dragElastic={0.1}
            className="flex gap-6 md:gap-10 pb-10"
          >
            {SPATIAL_MALLS.map((mall) => (
              <motion.div
                key={mall.id}
                className="relative min-w-[85vw] md:min-w-[45vw] lg:min-w-[35vw] h-[55vh] md:h-[65vh] rounded-[2rem] overflow-hidden group"
                whileHover={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Image Background */}
                <img
                  src={mall.image}
                  alt={mall.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  draggable={false}
                />
                
                {/* Default Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 pointer-events-none" />

                {/* Glassmorphism Hover Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center pointer-events-none"
                >
                  <motion.button 
                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center gap-3 font-medium tracking-wide pointer-events-auto hover:bg-white hover:text-black transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ENTER MALL <ArrowRight size={18} />
                  </motion.button>
                </motion.div>

                {/* Card Content (Visible by default, fades on hover) */}
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full transition-opacity duration-500 group-hover:opacity-0 pointer-events-none">
                  <p className="text-white/80 text-sm tracking-[0.2em] uppercase mb-2">
                    {mall.subtitle}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                    {mall.title}
                  </h2>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Hotspot = ({ x, y, title, price }) => (
  <div 
    className="absolute group z-20 cursor-pointer"
    style={{ top: y, left: x }}
  >
    {/* Pulsing Dot */}
    <span className="relative flex h-6 w-6 items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
    </span>

    {/* Tooltip */}
    <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-2 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl flex flex-col items-center min-w-[120px] border border-white">
        <span className="text-xs font-semibold text-black tracking-wide whitespace-nowrap">{title}</span>
        <span className="text-[10px] text-black/60 font-medium">{price}</span>
      </div>
    </div>
  </div>
);

const BentoGrid = () => {
  return (
    <section className="bg-[#f4f3f0] px-4 md:px-10 py-20 md:py-32">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1a1a1a]">
              CURATED <br />
              <span className="text-black/30">EDITIONS</span>
            </h2>
          </div>
          <p className="text-black/60 max-w-sm text-sm leading-relaxed font-medium">
            Discover our meticulously selected editorial pieces. 
            Interact with the canvas to explore hidden details and exclusive collections.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[400px] gap-4 md:gap-6">
          
          {/* Large Shoppable Media (Spans 2 cols, 2 rows) */}
          <motion.div 
            className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group bg-gray-200"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
              alt="Editorial Model" 
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
            
            {/* Hotspots */}
            <Hotspot x="45%" y="30%" title="Oversized Coat" price="$890" />
            <Hotspot x="60%" y="65%" title="Leather Tote" price="$450" />
            <Hotspot x="35%" y="80%" title="Platform Boots" price="$320" />

            {/* Label */}
            <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full flex items-center gap-2">
              <Plus size={16} />
              <span className="text-xs uppercase tracking-[0.1em] font-semibold">Interactive Editorial</span>
            </div>
          </motion.div>

          {/* Small Product Cards */}
          {PRODUCTS.map((product, idx) => (
            <motion.div 
              key={product.id}
              className="bg-white rounded-[2rem] p-6 flex flex-col justify-between group cursor-pointer border border-black/5 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 + 0.2 }}
            >
              <div className="w-full h-[60%] rounded-2xl overflow-hidden bg-[#f4f3f0] mb-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50 mb-2">New Arrival</p>
                <h3 className="text-xl font-medium tracking-tight mb-1">{product.name}</h3>
                <p className="text-sm font-semibold">{product.price}</p>
              </div>
            </motion.div>
          ))}

          {/* Wide Promo Banner (Spans 2 cols) */}
          <motion.div 
            className="md:col-span-2 relative rounded-[2rem] overflow-hidden bg-[#1a1a1a] text-white p-10 flex flex-col justify-center items-start group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="absolute inset-0 opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" alt="Texture" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative z-10 w-full">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-4">Limited Edition</p>
              <h3 className="text-4xl md:text-5xl font-light tracking-tighter mb-8 leading-tight">
                AUTUMN <br/><span className="font-bold">SYMPHONY</span>
              </h3>
              
              <button className="group/btn flex items-center gap-4 text-sm font-medium uppercase tracking-widest border-b border-white/30 pb-2 hover:border-white transition-colors">
                Explore Collection
                <motion.span 
                  className="inline-block"
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </motion.span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#1a1a1a] text-white py-20 px-6 md:px-10 overflow-hidden relative">
    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-0 relative z-10">
      <div>
        <div className="text-3xl tracking-tighter font-semibold mb-6">
          ØMNI<span className="font-light">SPACE</span>
        </div>
        <p className="text-white/50 text-sm max-w-xs font-light">
          Defining the next era of digital commerce through spatial interfaces and curated editorial experiences.
        </p>
      </div>
      
      <div className="flex gap-16 md:gap-32">
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white/40 mb-2">Connect</span>
          {['Instagram', 'Twitter', 'LinkedIn'].map(link => (
            <a key={link} href="#" className="text-sm font-light hover:text-white/70 transition-colors">{link}</a>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white/40 mb-2">Legal</span>
          {['Privacy Policy', 'Terms of Service', 'Returns'].map(link => (
            <a key={link} href="#" className="text-sm font-light hover:text-white/70 transition-colors">{link}</a>
          ))}
        </div>
      </div>
    </div>
    
    {/* Giant Background Text */}
    <div className="absolute bottom-[-5%] left-0 w-full overflow-hidden flex justify-center opacity-[0.03] pointer-events-none select-none">
      <h1 className="text-[25vw] font-bold tracking-tighter leading-none whitespace-nowrap">
        2036
      </h1>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#f4f3f0] text-[#1a1a1a] font-sans selection:bg-black selection:text-white">
      {/* Noise overlay for premium texture */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <Navbar />
      <Hero />
      <BentoGrid />
      <Footer />
    </div>
  );
}