import React, { useRef, useEffect } from 'react';
import { ProductTemplate, LogoPlacement } from '../constants';

interface MockupCanvasProps {
  product: ProductTemplate;
  logoUrl: string | null;
  placement: LogoPlacement;
  width?: number;
  height?: number;
  className?: string;
  onExportReady?: (canvas: HTMLCanvasElement) => void;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  product,
  logoUrl,
  placement,
  width = 600,
  height = 600,
  className,
  onExportReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const productImage = new Image();
    productImage.crossOrigin = 'anonymous';
    productImage.src = product.imageUrl;

    const logoImage = new Image();
    if (logoUrl) {
      logoImage.crossOrigin = 'anonymous';
      logoImage.src = logoUrl;
    }

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw product
      ctx.drawImage(productImage, 0, 0, canvas.width, canvas.height);

      if (logoUrl && logoImage.complete) {
        ctx.save();
        
        // Calculate print area dimensions in pixels
        const paX = (product.printArea.left / 100) * canvas.width;
        const paY = (product.printArea.top / 100) * canvas.height;
        const paW = (product.printArea.width / 100) * canvas.width;
        const paH = (product.printArea.height / 100) * canvas.height;

        // Clip to print area (optional, depending on if we want to allow overflow)
        // ctx.rect(paX, paY, paW, paH);
        // ctx.clip();

        // Logo dimensions
        const logoAspect = logoImage.width / logoImage.height;
        let drawW, drawH;

        if (logoAspect > paW / paH) {
          drawW = paW * placement.scale;
          drawH = drawW / logoAspect;
        } else {
          drawH = paH * placement.scale;
          drawW = drawH * logoAspect;
        }

        // Center within print area + offset
        const centerX = paX + paW / 2 + (placement.x / 100) * paW;
        const centerY = paY + paH / 2 + (placement.y / 100) * paH;

        ctx.translate(centerX, centerY);
        ctx.rotate((placement.rotation * Math.PI) / 180);
        ctx.globalAlpha = placement.opacity;

        // Multiply composite for realistic look on some surfaces (optional)
        // ctx.globalCompositeOperation = 'multiply'; 

        ctx.drawImage(logoImage, -drawW / 2, -drawH / 2, drawW, drawH);
        
        ctx.restore();
      }

      if (onExportReady) {
        onExportReady(canvas);
      }
    };

    productImage.onload = render;
    if (logoUrl) {
      logoImage.onload = render;
    } else {
      render();
    }
  }, [product, logoUrl, placement, width, height]);

  return (
    <canvas
      id={`mockup-${product.id}`}
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
};
