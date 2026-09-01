import { Mall, Product, Brand } from '../types';

export const SPATIAL_MALLS: Mall[] = [
  { id: 1, title: 'Aura District', subtitle: 'Avant-Garde & High Fashion', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: 'The Monolith', subtitle: 'Minimalist Essentials', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop' },
  { id: 3, title: 'Lumina Space', subtitle: 'Future Wear & Tech', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2187&auto=format&fit=crop' },
  { id: 4, title: 'Echo Pavilion', subtitle: 'Sustainable Luxury', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' }
];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Obsidian Chronograph', price: '$1,200', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop' },
  { id: 2, name: 'Silk Cascade Scarf', price: '$350', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, name: 'Form Study Chair', price: '$680', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2069&auto=format&fit=crop' },
  { id: 4, name: 'Ceramic Vessel Set', price: '$140', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, name: 'Linen Lounge Pillow', price: '$85', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1974&auto=format&fit=crop' }
];

export const FEATURED_BRANDS: Brand[] = [
  { 
    id: 1, 
    name: 'Promer', 
    tagline: 'Industrial Grade Architecture & Materials', 
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    name: 'Lumina', 
    tagline: 'Minimalist Lighting Concepts', 
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5e8d?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    name: 'Aura', 
    tagline: 'Avant-Garde Apparel', 
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' 
  }
];