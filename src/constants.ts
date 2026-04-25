export interface PrintArea {
  top: number;    // % from top
  left: number;   // % from left
  width: number;  // % of total width
  height: number; // % of total height
}

export interface ProductTemplate {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  printArea: PrintArea;
}

export interface LogoPlacement {
  x: number;      // % offset within print area
  y: number;      // % offset within print area
  scale: number;  // multiplier (1 = fit to print area)
  opacity: number; // 0-1
  rotation: number; // degrees
}

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: 't-shirt-white',
    name: 'Classic White T-Shirt',
    category: 'Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200',
    printArea: { top: 25, left: 32, width: 36, height: 40 }
  },
  {
    id: 'hoodie-black',
    name: 'Premium Black Hoodie',
    category: 'Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200',
    printArea: { top: 30, left: 35, width: 30, height: 35 }
  },
  {
    id: 'mug-white',
    name: 'Ceramic Coffee Mug',
    category: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed50?auto=format&fit=crop&q=80&w=1200',
    printArea: { top: 35, left: 20, width: 30, height: 30 }
  },
  {
    id: 'tote-bag',
    name: 'Canvas Tote Bag',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1544816153-12ba5d212a42?auto=format&fit=crop&q=80&w=1200',
    printArea: { top: 30, left: 25, width: 50, height: 50 }
  },
  {
    id: 'phone-case',
    name: 'iPhone Case',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1200',
    printArea: { top: 15, left: 25, width: 50, height: 70 }
  },
  {
    id: 'baseball-cap',
    name: 'Essential Baseball Cap',
    category: 'Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200',
    printArea: { top: 35, left: 35, width: 30, height: 20 }
  }
];
