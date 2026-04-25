import React, { useState, useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoUploadProps {
  onUpload: (url: string) => void;
  currentLogoUrl: string | null;
}

const ACCEPTED_TYPES: Accept = {
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  'image/webp': ['.webp'],
};

export const LogoUpload: React.FC<LogoUploadProps> = ({ onUpload, currentLogoUrl }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: false,
  } as any);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden",
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300 bg-white",
          currentLogoUrl ? "aspect-square" : "p-8"
        )}
      >
        <input {...getInputProps()} />
        
        {currentLogoUrl ? (
          <div className="w-full h-full relative">
            <img src={currentLogoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <RefreshCw className="text-white animate-spin-slow" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <Upload size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-tight">Click to upload logo</p>
              <p className="text-xs text-gray-500 mt-1">PNG, SVG or WebP</p>
            </div>
          </div>
        )}
        
        {isUploading && (
           <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
      </div>

      {currentLogoUrl && (
        <button
          onClick={() => onUpload('')}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium py-2 rounded-xl transition-colors"
        >
          <X size={14} />
          Remove logo
        </button>
      )}
    </div>
  );
};

const RefreshCw = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
