import React from 'react';
import { Product } from '../types';
import { Leaf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#0ea5e9]/20 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
    >
      {/* Top Organic Badge */}
      {product.organic && (
        <div className="absolute top-3 left-3 z-10 font-sans pointer-events-none">
          <span className="px-2.5 py-1 bg-[#22c55e] text-white font-bold text-[9px] uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1">
            <Leaf className="w-3 h-3 text-white" /> Organic
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f0f9ff]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Card Content - Only Name & Price in BDT */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <h3 
          className="font-serif font-bold text-[#0f172a] text-sm leading-tight line-clamp-2"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="pt-2.5 mt-2.5 border-t border-[#0ea5e9]/15 flex items-center justify-between">
          <span className="text-sm sm:text-base font-serif font-black text-[#22c55e]">
            ৳{Math.round(product.price).toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </div>
  );
};

