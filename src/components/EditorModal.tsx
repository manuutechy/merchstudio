import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sliders, Download, Zap } from 'lucide-react';
import { ProductTemplate, LogoPlacement } from '../constants';
import { MockupCanvas } from './MockupCanvas';
import { optimizePlacement } from '../services/geminiService';

interface EditorModalProps {
  product: ProductTemplate;
  logoUrl: string | null;
  initialPlacement: LogoPlacement;
  isOpen: boolean;
  onClose: () => void;
  onSave: (placement: LogoPlacement) => void;
  onExport: (product: ProductTemplate, placement: LogoPlacement) => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  product,
  logoUrl,
  initialPlacement,
  isOpen,
  onClose,
  onSave,
  onExport
}) => {
  const [placement, setPlacement] = useState<LogoPlacement>(initialPlacement);
  const [isOptimizing, setIsOptimizing] = useState(false);

  if (!isOpen) return null;

  const handleAIResize = async () => {
    if (!logoUrl) return;
    setIsOptimizing(true);
    try {
      const optimized = await optimizePlacement("User logo", product);
      setPlacement(optimized);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-5xl h-[90vh] flex flex-col md:flex-row"
      >
        {/* Preview Area */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="w-full max-w-[500px] aspect-square bg-white shadow-2xl rounded-xl overflow-hidden">
            <MockupCanvas
              product={product}
              logoUrl={logoUrl}
              placement={placement}
              width={1200}
              height={1200}
            />
          </div>
        </div>

        {/* Controls Area */}
        <div className="w-full md:w-[350px] border-r border-gray-100 flex flex-col p-8 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
            <p className="text-gray-500 text-sm">{product.category}</p>
          </div>

          <div className="space-y-8 flex-1">
            {/* AI Optimization Button */}
            <button
               onClick={handleAIResize}
               disabled={isOptimizing || !logoUrl}
               className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              <Zap size={18} className={isOptimizing ? "animate-pulse" : ""} />
              {isOptimizing ? "Analyzing logo..." : "AI Optimize Placement"}
            </button>

            <div className="space-y-6">
               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span>Scale</span>
                   <span className="text-gray-400">{(placement.scale * 100).toFixed(0)}%</span>
                 </div>
                 <input
                   type="range"
                   min="0.1"
                   max="2.0"
                   step="0.01"
                   value={placement.scale}
                   onChange={(e) => setPlacement({ ...placement, scale: parseFloat(e.target.value) })}
                   className="w-full accent-indigo-600"
                 />
               </div>

               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span>Horizontal (X)</span>
                   <span className="text-gray-400">{placement.x}%</span>
                 </div>
                 <input
                   type="range"
                   min="-50"
                   max="50"
                   value={placement.x}
                   onChange={(e) => setPlacement({ ...placement, x: parseInt(e.target.value) })}
                   className="w-full accent-indigo-600"
                 />
               </div>

               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span>Vertical (Y)</span>
                   <span className="text-gray-400">{placement.y}%</span>
                 </div>
                 <input
                   type="range"
                   min="-50"
                   max="50"
                   value={placement.y}
                   onChange={(e) => setPlacement({ ...placement, y: parseInt(e.target.value) })}
                   className="w-full accent-indigo-600"
                 />
               </div>

               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span>Rotation</span>
                   <span className="text-gray-400">{placement.rotation}Â°</span>
                 </div>
                 <input
                   type="range"
                   min="-180"
                   max="180"
                   value={placement.rotation}
                   onChange={(e) => setPlacement({ ...placement, rotation: parseInt(e.target.value) })}
                   className="w-full accent-indigo-600"
                 />
               </div>

               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span>Opacity</span>
                   <span className="text-gray-400">{(placement.opacity * 100).toFixed(0)}%</span>
                 </div>
                 <input
                   type="range"
                   min="0"
                   max="1"
                   step="0.01"
                   value={placement.opacity}
                   onChange={(e) => setPlacement({ ...placement, opacity: parseFloat(e.target.value) })}
                   className="w-full accent-indigo-600"
                 />
               </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={() => onSave(placement)}
              className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
            >
              Apply
            </button>
            <button
               onClick={() => onExport(product, placement)}
               className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-100 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
