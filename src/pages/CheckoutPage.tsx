import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { createOrder, OrderPayload } from '../lib/databaseService';
import { PaymentMethod } from '../types/database';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  User,
  FileText,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    total,
    clearCart,
    setConfirmedOrder,
    setView,
    notify,
    settings,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2B1810]">Your bag is currently empty</h2>
        <p className="text-xs sm:text-sm text-[#6B5749]">
          Please select your favorite sweets, cakes, or snacks before checking out.
        </p>
        <button
          onClick={() => setView('shop')}
          className="px-6 py-3 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-colors"
        >
          Return to Bakery Menu
        </button>
      </div>
    );
  }

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errors.fullName = 'Please enter your full name (minimum 3 characters)';
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid Pakistani contact number (e.g. 0300-1234567)';
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      errors.deliveryAddress = 'Please specify your complete street and house delivery address';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      notify('Please correct the highlighted fields in the form', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload: OrderPayload = {
        customer_name: fullName.trim(),
        phone: phone.trim(),
        delivery_address: deliveryAddress.trim(),
        notes: notes.trim(),
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await createOrder(payload);
      setConfirmedOrder(createdOrder);
      clearCart();
      setView('order-confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Order submission failed:', err);
      notify('Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back to menu */}
      <button
        onClick={() => setView('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6D58] hover:text-[#2B1810] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-[#F2ECE1]">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
              Express Delivery
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810] mt-1">
              Checkout Details
            </h1>
            <p className="text-xs text-[#6B5749] mt-1">
              No account required. Please provide your delivery information so our drivers can deliver your order fresh.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#2B1810] uppercase tracking-wide mb-1.5">
                Full Name <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Farooq"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition-all ${
                    validationErrors.fullName ? 'border-[#DC2626]' : 'border-[#D5C7B5]'
                  }`}
                />
              </div>
              {validationErrors.fullName && (
                <p className="text-[11px] text-[#DC2626] mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-[#2B1810] uppercase tracking-wide mb-1.5">
                Contact Mobile Number <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567 or +92 321 9876543"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition-all ${
                    validationErrors.phone ? 'border-[#DC2626]' : 'border-[#D5C7B5]'
                  }`}
                />
              </div>
              {validationErrors.phone ? (
                <p className="text-[11px] text-[#DC2626] mt-1">{validationErrors.phone}</p>
              ) : (
                <p className="text-[11px] text-[#8C6D58] mt-1">
                  Our dispatch rider will call this number before arrival.
                </p>
              )}
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-semibold text-[#2B1810] uppercase tracking-wide mb-1.5">
                Complete Delivery Address <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#8C6D58]" />
                <textarea
                  required
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House / Flat No., Street, Block/Sector, Area / Colony name..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition-all ${
                    validationErrors.deliveryAddress ? 'border-[#DC2626]' : 'border-[#D5C7B5]'
                  }`}
                />
              </div>
              {validationErrors.deliveryAddress && (
                <p className="text-[11px] text-[#DC2626] mt-1">{validationErrors.deliveryAddress}</p>
              )}
            </div>

            {/* Special Instructions (e.g. cake writing) */}
            <div>
              <label className="block text-xs font-semibold text-[#2B1810] uppercase tracking-wide mb-1.5">
                Special Bakery Instructions (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 w-4 h-4 text-[#8C6D58]" />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please write 'Happy 25th Anniversary' on the cake, extra chutney with patties, or call upon gate arrival."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition-all"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#2B1810] uppercase tracking-wide mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`cursor-pointer p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#B45309] bg-[#FEF3C7]/40 ring-1 ring-[#B45309]'
                      : 'border-[#E7DECD] bg-white hover:border-[#D5C7B5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-[#B45309] focus:ring-[#B45309]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#2B1810]">
                      <Banknote className="w-4 h-4 text-[#B45309]" /> Cash on Delivery (COD)
                    </div>
                    <p className="text-[11px] text-[#6B5749] mt-0.5">
                      Pay cash to courier rider upon receiving fresh bakery items.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('Bank Transfer / JazzCash / EasyPaisa')}
                  className={`cursor-pointer p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                    paymentMethod === 'Bank Transfer / JazzCash / EasyPaisa'
                      ? 'border-[#B45309] bg-[#FEF3C7]/40 ring-1 ring-[#B45309]'
                      : 'border-[#E7DECD] bg-white hover:border-[#D5C7B5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Bank Transfer / JazzCash / EasyPaisa'}
                    onChange={() => setPaymentMethod('Bank Transfer / JazzCash / EasyPaisa')}
                    className="mt-1 text-[#B45309] focus:ring-[#B45309]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#2B1810]">
                      <CreditCard className="w-4 h-4 text-[#B45309]" /> Online / JazzCash / Bank
                    </div>
                    <p className="text-[11px] text-[#6B5749] mt-0.5">
                      Transfer directly via JazzCash, EasyPaisa, or Online Banking.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#B45309]/20 hover:from-[#B45309] hover:to-[#92400E] transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Recording Order in Database...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Confirm & Place Order (Rs. {total.toLocaleString()})
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Trust Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#2B1810] mb-4 pb-3 border-b border-[#F2ECE1]">
              Order Summary ({cart.length} items)
            </h3>

            {/* List of items */}
            <div className="divide-y divide-[#F2ECE1] max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-bold text-[#2B1810] truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-xs text-[#8C6D58]">
                      Qty: {item.quantity} × Rs. {item.product.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="font-serif text-sm font-bold text-[#2B1810] tabular-nums shrink-0">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="mt-4 pt-4 border-t border-[#E7DECD] space-y-2 text-xs text-[#5C4A3E]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#2B1810] tabular-nums">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-[#2B1810] tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-[#15803D]">FREE</span>
                  ) : (
                    `Rs. ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-[#E7DECD] flex justify-between items-baseline text-base font-bold text-[#2B1810]">
                <span className="font-serif text-lg">Total Payable</span>
                <span className="font-serif text-2xl text-[#B45309] tabular-nums">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Hygiene Guarantee */}
          <div className="bg-[#FAF5EE] rounded-2xl border border-[#E7DECD] p-5 space-y-3 text-xs text-[#6B5749]">
            <div className="flex items-center gap-2 font-semibold text-[#2B1810]">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Tariq Sweets Fresh Delivery Guarantee</span>
            </div>
            <p className="leading-relaxed">
              Every box of confectionery is hygienically heat-sealed in tamper-proof gold foil boxes. Cakes are packed in sturdy double-corrugated protective carriers.
            </p>
            <div className="pt-2 border-t border-[#E5DCD0] flex items-center justify-between text-[11px] text-[#8C6D58]">
              <span>Customer Help: {settings.phone}</span>
              <span className="text-[#15803D] font-bold">Fast City Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
