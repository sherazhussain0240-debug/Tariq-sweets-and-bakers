import React, { useState } from 'react';
import { Product } from '../types/database';
import { useStore } from '../context/StoreContext';
import { Plus, Check, Eye, CakeSlice } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.is_available) return;
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-[#FFFDF9] rounded-2xl border border-[#EBE3D5] overflow-hidden hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#B45309]/5 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Slot - 65% height on clean neutral surface */}
      <div className="relative aspect-[4/3] w-full bg-[#F5EFE6] overflow-hidden">
        {!imageError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF5EE] to-[#F0E6D6] p-4 text-center">
            <CakeSlice className="w-10 h-10 text-[#C49B38] mb-2 stroke-[1.5]" />
            <span className="text-xs font-serif font-medium text-[#78350F]">{product.name}</span>
          </div>
        )}

        {/* Subtle status tag (No badge spam) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          {!product.is_available ? (
            <span className="bg-[#2B1810]/90 backdrop-blur-sm text-[#FEF3C7] text-[11px] font-medium px-2.5 py-1 rounded-md">
              Sold Out Today
            </span>
          ) : product.is_featured ? (
            <span className="bg-[#B45309]/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
              Chef's Pick
            </span>
          ) : null}
        </div>

        {/* Quick View Overlay on hover */}
        <div className="absolute inset-0 bg-[#2B1810]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#2B1810] text-xs font-medium shadow-md">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Unit unboxed metadata */}
          <div className="flex items-center gap-2 text-xs text-[#8C6D58] mb-1.5 font-medium tracking-wide">
            <span className="uppercase text-[11px] font-semibold text-[#B45309]">
              {product.category_name || 'Bakery Confectionery'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.unit}</span>
          </div>

          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2B1810] line-clamp-1 group-hover:text-[#B45309] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#665449] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing Baseline and Quick Add */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8C6D58] block">Price</span>
            <div className="font-serif text-lg sm:text-xl font-bold text-[#2B1810] tabular-nums tracking-tight">
              Rs. {product.price.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.is_available}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap ${
              !product.is_available
                ? 'bg-[#E5DCD0] text-[#9E8E80] cursor-not-allowed'
                : addedAnimation
                ? 'bg-[#15803D] text-white'
                : 'bg-[#2B1810] text-[#FEF3C7] hover:bg-[#451A03] hover:shadow-md'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
