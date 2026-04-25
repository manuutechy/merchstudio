import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Laptop, Palette, LayoutGrid, List, Sliders, ChevronRight, Share2, Download, Brush } from 'lucide-react';
import { PRODUCT_TEMPLATES, ProductTemplate, LogoPlacement } from './constants';
import { LogoUpload } from './components/LogoUpload';
import { MockupCanvas } from './components/MockupCanvas';
import { EditorModal } from './components/EditorModal';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, LogoPlacement>>({});
  const [selectedProduct, setSelectedProduct] = useState<ProductTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getPlacement = (productId: string): LogoPlacement => {
    return placements[productId] || { x: 0, y: 0, scale: 0.8, opacity: 1, rotation: 0 };
  };

  const handleApplyPlacement = (placement: LogoPlacement) => {
    if (!selectedProduct) return;
    setPlacements({ ...placements, [selectedProduct.id]: placement });
    setIsEditorOpen(false);
  };

  const handleExport = (product: ProductTemplate, placement: LogoPlacement) => {
     const canvas = document.querySelector(`#mockup-${product.id}`) as HTMLCanvasElement;
     if (!canvas) return;

     // Simple PNG download
     const link = document.createElement('a');
     link.download = `mockup-${product.id}.png`;
     link.href = canvas.toDataURL('image/png', 1.0);
     link.click();
     
     confetti({
       particleCount: 100,
       spread: 70,
       origin: { y: 0.6 }
     });
  };

  const handleExportAll = () => {
    // Export combined PDF
    const pdf = new jsPDF();
    let currentLine = 20;

    PRODUCT_TEMPLATES.forEach((product, index) => {
      const canvas = document.querySelector(`#mockup-${product.id}`) as HTMLCanvasElement;
      if (canvas) {
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        if (index > 0) pdf.addPage();
        pdf.text(product.name, 20, 20);
        pdf.addImage(imgData, 'JPEG', 20, 30, 170, 170);
      }
    });

    pdf.save('merch-mockups.pdf');
    confetti({
       particleCount: 150,
       spread: 80,
       origin: { y: 0.5 }
     });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Brush size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">MerchStudio</h1>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Professional Mockup Generator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportAll}
            disabled={!logoUrl}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm shadow-xl shadow-gray-200"
          >
            <Download size={16} />
            Export Catalog (PDF)
          </button>
          <div className="w-px h-6 bg-gray-200 hidden md:block" />
          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-76px)]">
        {/* Sidebar */}
        <aside className="w-full lg:w-[380px] border-r border-gray-100 p-8 flex flex-col gap-8 bg-white lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] overflow-y-auto">
          <section>
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-widest mb-4">1. Upload Logo</h3>
            <LogoUpload onUpload={(url) => setLogoUrl(url || null)} currentLogoUrl={logoUrl} />
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-widest mb-4">2. Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setPlacements({})}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors text-left group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Palette size={18} className="text-indigo-600" />
                </div>
                <div>
                   <p className="font-semibold text-sm">Reset Placement</p>
                   <p className="text-xs text-gray-500">Return all logos to center</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors text-left group">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Laptop size={18} className="text-emerald-600" />
                </div>
                <div>
                   <p className="font-semibold text-sm">Preview in Scene</p>
                   <p className="text-xs text-gray-500">View in lifestyle environments</p>
                </div>
              </button>
            </div>
          </section>

          <div className="mt-auto pt-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
               <p className="text-sm font-medium text-indigo-900 mb-2">Pro Tip</p>
               <p className="text-xs text-indigo-700/80 leading-relaxed">
                 Use SVG logos for the highest print quality. You can adjust placement for each product individually.
               </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-1">Mockup Catalog</h2>
              <p className="text-gray-500">Choose a product to customize and fine-tune</p>
            </div>

            <div className="flex items-center bg-white p-1 rounded-full border border-gray-100 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-full transition-all",
                  viewMode === 'grid' ? "bg-gray-900 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-full transition-all",
                  viewMode === 'list' ? "bg-gray-900 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <motion.div 
            layout
            className={cn(
              "grid gap-8",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}
          >
            {PRODUCT_TEMPLATES.map((product) => (
              <motion.div
                layout
                key={product.id}
                whileHover={{ y: -5 }}
                className={cn(
                  "group relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300",
                  viewMode === 'grid' ? "flex flex-col" : "flex flex-row h-64"
                )}
              >
                <div className={cn(
                  "relative aspect-square bg-[#F3F4F6] flex items-center justify-center overflow-hidden",
                  viewMode === 'grid' ? "w-full" : "w-64 flex-shrink-0"
                )}>
                  <MockupCanvas
                    product={product}
                    logoUrl={logoUrl}
                    placement={getPlacement(product.id)}
                    width={800}
                    height={800}
                  />
                  {!logoUrl && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-white/20 backdrop-blur-[2px]">
                      <ShoppingBag size={48} strokeWidth={1} className="mb-2" />
                      <p className="text-xs font-medium uppercase tracking-widest">Waiting for logo</p>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-indigo-600 shadow-sm border border-indigo-50">
                      RETAIL READY
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.category}</p>
                    </div>
                    <button 
                       onClick={() => {
                         setSelectedProduct(product);
                         setIsEditorOpen(true);
                       }}
                       disabled={!logoUrl}
                       className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white disabled:opacity-0 transition-all shadow-sm"
                    >
                      <Sliders size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <span className="text-xs font-semibold text-gray-400">High-Res Print Area</span>
                    <button 
                       onClick={() => handleExport(product, getPlacement(product.id))}
                       disabled={!logoUrl}
                       className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group/btn disabled:opacity-0"
                    >
                      Export PNG
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {isEditorOpen && selectedProduct && (
          <EditorModal
            product={selectedProduct}
            logoUrl={logoUrl}
            initialPlacement={getPlacement(selectedProduct.id)}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleApplyPlacement}
            onExport={handleExport}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
