import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, ShoppingBag, Check, ShieldCheck, Sparkles, CakeSlice } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    if (!selectedProduct.is_available) return;
    addToCart(selectedProduct, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelectedProduct(null);
    }, 900);
  };

  const totalPrice = selectedProduct.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FFFDF9] rounded-2xl shadow-2xl border border-[#E7DECD] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#2B1810] hover:bg-white flex items-center justify-center shadow-md transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-[#F5EFE6] overflow-hidden min-h-[260px]">
            {!imageError && selectedProduct.image_url ? (
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <CakeSlice className="w-12 h-12 text-[#C49B38] mb-3 stroke-[1.5]" />
                <span className="font-serif text-lg font-bold text-[#78350F]">
                  {selectedProduct.name}
                </span>
              </div>
            )}

            {selectedProduct.is_featured && (
              <div className="absolute top-4 left-4 bg-[#B45309] text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm">
                Chef's Special
              </div>
            )}
          </div>

          {/* Right: Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Unit */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309] mb-2">
                <span>{selectedProduct.category_name || 'Artisan Bakery'}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8C6D58] normal-case">{selectedProduct.unit}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810] leading-tight">
                {selectedProduct.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#2B1810] tabular-nums">
                  Rs. {selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-sm text-[#8C6D58] font-medium">/ {selectedProduct.unit}</span>
              </div>

              <p className="mt-4 text-sm text-[#5C4A3E] leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Quality & Freshness Guarantee */}
              <div className="mt-6 pt-5 border-t border-[#F2ECE1] space-y-2 text-xs text-[#6B5749]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  <span>100% Halal, Pure Desi Ghee & Fresh Dairy Ingredients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>Handcrafted fresh on the day of delivery</span>
                </div>
              </div>
            </div>

            {/* Stepper and Add to Bag */}
            <div className="pt-4 border-t border-[#F2ECE1] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#2B1810]">Select Quantity</span>
                <div className="flex items-center border border-[#D5C7B5] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#2B1810] hover:bg-[#F5EFE6] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold tabular-nums text-[#2B1810]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-[#2B1810] hover:bg-[#F5EFE6] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-[#8C6D58]">
                <span>Item Total:</span>
                <span className="font-bold text-[#2B1810] tabular-nums font-serif text-lg">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedProduct.is_available}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                  !selectedProduct.is_available
                    ? 'bg-[#E5DCD0] text-[#9E8E80] cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-[#15803D] text-white shadow-[#15803D]/20'
                    : 'bg-gradient-to-r from-[#D97706] to-[#B45309] text-white hover:from-[#B45309] hover:to-[#92400E] shadow-[#B45309]/30'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Your Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add {quantity} to Bag (Rs. {totalPrice.toLocaleString()})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
