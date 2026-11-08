import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Clock,
  Phone,
  MapPin,
  ArrowRight,
  Printer,
  Share2,
} from 'lucide-react';

export const OrderConfirmedPage: React.FC = () => {
  const { confirmedOrder, setView, settings } = useStore();

  useEffect(() => {
    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#B45309', '#15803D', '#F59E0B'],
      });
    } catch (e) {
      // Ignore if canvas confetti not supported
    }
  }, []);

  if (!confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2B1810]">No Recent Order Found</h2>
        <p className="text-xs text-[#6B5749]">
          You can track your order using your order number on our tracking page.
        </p>
        <button
          onClick={() => setView('track-order')}
          className="px-6 py-2.5 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03]"
        >
          Go to Order Tracking
        </button>
      </div>
    );
  }

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Salam Tariq Sweets! I just placed order #${confirmedOrder.order_number} for Rs. ${confirmedOrder.total_amount}. Customer: ${confirmedOrder.customer_name}.`
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Banner */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#15803D]">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1810]">
            Thank You, {confirmedOrder.customer_name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#665449] max-w-md mx-auto">
            Your fresh bakery order has been registered in our kitchen queue. Our pastry chefs are preparing your items.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="inline-block bg-[#FAF5EE] border border-[#D5C7B5] px-6 py-3 rounded-2xl text-center">
          <span className="text-[11px] font-semibold text-[#8C6D58] uppercase tracking-wider block">
            Order Reference Number
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#B45309] tracking-wider select-all">
            {confirmedOrder.order_number}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#15803D] text-white text-xs font-semibold hover:bg-[#166534] transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" /> WhatsApp Confirmation
          </a>

          <button
            onClick={() => setView('track-order')}
            className="px-5 py-2.5 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Package className="w-3.5 h-3.5" /> Track Live Order Status
          </button>
        </div>
      </div>

      {/* Itemized Order Receipt Snapshot */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-4">
          <h2 className="font-serif text-lg font-bold text-[#2B1810]">Receipt Summary</h2>
          <span className="text-xs text-[#8C6D58]">
            Date: {new Date(confirmedOrder.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Customer & Delivery details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5C4A3E] bg-[#FAF5EE] p-4 rounded-2xl">
          <div>
            <span className="font-semibold text-[#2B1810] block mb-0.5">Delivery Destination:</span>
            <p>{confirmedOrder.delivery_address}</p>
            <p className="mt-1">Recipient Phone: {confirmedOrder.phone}</p>
          </div>
          <div>
            <span className="font-semibold text-[#2B1810] block mb-0.5">Payment Method:</span>
            <p className="font-medium text-[#B45309]">{confirmedOrder.payment_method}</p>
            <p className="mt-1">
              Order Status:{' '}
              <span className="font-semibold text-[#15803D]">{confirmedOrder.order_status}</span>
            </p>
          </div>
        </div>

        {confirmedOrder.notes && (
          <div className="text-xs bg-[#FEF3C7]/40 border border-[#FDE68A] p-3 rounded-xl text-[#78350F]">
            <strong>Special Note:</strong> {confirmedOrder.notes}
          </div>
        )}

        {/* Items Table */}
        <div className="divide-y divide-[#F2ECE1]">
          {confirmedOrder.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div>
                <span className="font-serif font-bold text-[#2B1810]">{item.product_name}</span>
                <span className="text-[#8C6D58] block text-xs">
                  {item.quantity} × Rs. {item.unit_price.toLocaleString()}
                </span>
              </div>
              <span className="font-serif font-bold text-[#2B1810] tabular-nums">
                Rs. {item.subtotal.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Financials Breakdown */}
        <div className="pt-4 border-t border-[#E7DECD] space-y-1.5 text-xs text-[#5C4A3E]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#2B1810] tabular-nums">
              Rs. {confirmedOrder.subtotal_amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-semibold text-[#2B1810] tabular-nums">
              {confirmedOrder.delivery_fee === 0
                ? 'FREE'
                : `Rs. ${confirmedOrder.delivery_fee.toLocaleString()}`}
            </span>
          </div>
          <div className="pt-2 border-t border-[#E7DECD] flex justify-between text-base font-bold text-[#2B1810]">
            <span className="font-serif">Total Amount (PKR)</span>
            <span className="font-serif text-xl text-[#B45309] tabular-nums">
              Rs. {confirmedOrder.total_amount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            setView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs font-semibold text-[#B45309] hover:underline inline-flex items-center gap-1"
        >
          Return to Bakery Catalog <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
