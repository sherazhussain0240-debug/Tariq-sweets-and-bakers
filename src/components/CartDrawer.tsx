import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, CakeSlice } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    setView,
  } = useStore();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col border-l border-[#E7DECD] transform transition-transform duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E7DECD] flex items-center justify-between bg-[#FFFDF9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#2B1810]">Your Bakery Bag</h2>
                <span className="text-xs text-[#8C6D58]">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#8C6D58] hover:text-[#2B1810] rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-[#FAF5EE] px-5 py-3 border-b border-[#E7DECD]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2B1810] mb-1.5">
              <Truck className="w-4 h-4 text-[#D97706] shrink-0" />
              {amountNeededForFreeDelivery > 0 ? (
                <span>
                  Add <strong className="text-[#B45309]">Rs. {amountNeededForFreeDelivery.toLocaleString()}</strong> more for{' '}
                  <span className="text-[#15803D]">FREE City Delivery</span>!
                </span>
              ) : (
                <span className="text-[#15803D] font-bold">
                  🎉 Congratulations! You have unlocked FREE Delivery!
                </span>
              )}
            </div>
            <div className="w-full bg-[#E5DCD0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#F59E0B] to-[#15803D] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#D97706] mb-4">
                  <CakeSlice className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2B1810]">Your bag is empty</h3>
                <p className="text-xs text-[#8C6D58] mt-1 max-w-xs leading-relaxed">
                  Treat yourself to our warm desi ghee gulab jamun, signature chocolate fudge cakes, or freshly baked patties.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setView('shop');
                  }}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-all"
                >
                  Explore Bakery Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-white border border-[#EBE3D5] shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-18 rounded-lg bg-[#F5EFE6] overflow-hidden shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-[#2B1810] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#9E8E80] hover:text-[#DC2626] p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#8C6D58] block">
                        Rs. {item.product.price.toLocaleString()} ({item.product.unit})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D5C7B5] rounded-lg bg-[#FAF5EE]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#2B1810] hover:bg-[#EBE3D5] rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold tabular-nums text-[#2B1810]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-[#2B1810] hover:bg-[#EBE3D5] rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-sm font-bold text-[#2B1810] tabular-nums">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E7DECD] bg-[#FFFDF9] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5C4A3E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2B1810] tabular-nums">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-[#2B1810] tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-[#15803D]">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E7DECD] flex justify-between text-base font-bold text-[#2B1810]">
                  <span className="font-serif">Total (PKR)</span>
                  <span className="font-serif text-lg text-[#B45309] tabular-nums">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#B45309]/20 hover:from-[#B45309] hover:to-[#92400E] transition-all active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-[#8C6D58] hover:text-[#2B1810] transition-colors py-1"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
