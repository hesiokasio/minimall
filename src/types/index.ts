export interface Mall {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
}

export interface HotspotData {
  x: string;
  y: string;
  title: string;
  price: string;
}

export interface Product {
  id: string | number;
  name: string;
  price: string | number;
  image: string;
  hotspots?: HotspotData[];
}

export interface Brand {
  id: string | number;
  name: string;
  tagline: string;
  image: string;
}

export interface Product {
  id: string | number;
  name: string;
  price: string | number;
  image: string;
}

export interface Store {
  id: string | number;
  name: string;
  tagline: string;
  coverImage: string;
  products: Product[];
}

export interface Floor {
  id: string;
  title: string;
  stores: Store[];
}

export interface MallInteriorData {
  mallId: string | number;
  floors: Floor[];
}