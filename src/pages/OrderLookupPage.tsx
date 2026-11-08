import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getOrderByIdOrNumber } from '../lib/databaseService';
import { Order, OrderStatus } from '../types/database';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  AlertCircle,
  Phone,
  CakeSlice,
  MapPin,
} from 'lucide-react';

const ORDER_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

export const OrderLookupPage: React.FC = () => {
  const { settings, confirmedOrder } = useStore();
  const [query, setQuery] = useState(confirmedOrder?.order_number || '');
  const [order, setOrder] = useState<Order | null>(confirmedOrder || null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!confirmedOrder);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const found = await getOrderByIdOrNumber(query.trim());
      setOrder(found);
      setSearched(true);
      if (!found) {
        setErrorMsg(`No order found matching "${query.trim()}". Please verify your order reference.`);
      }
    } catch (err) {
      console.error('Order tracking search error:', err);
      setErrorMsg('Failed to check order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? ORDER_STEPS.indexOf(order.order_status) : -1;
  const isCancelled = order?.order_status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header and Lookup Bar */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 sm:p-10 shadow-xs text-center max-w-2xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto">
          <Package className="w-6 h-6 stroke-[1.8]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
            Live Order Tracking
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810]">
            Track Your Bakery Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5749] max-w-md mx-auto">
            Enter your order reference number (e.g. <strong>TSB-2026-1042</strong>) or registered phone number to check live preparation status.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. TSB-2026-1042"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-colors whitespace-nowrap"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Quick demo clickers for user convenience */}
        <div className="text-[11px] text-[#8C6D58] flex flex-wrap items-center justify-center gap-2 pt-2">
          <span>Sample Orders:</span>
          <button
            onClick={() => {
              setQuery('TSB-2026-1042');
            }}
            className="text-[#B45309] hover:underline font-mono"
          >
            TSB-2026-1042
          </button>
          <span>·</span>
          <button
            onClick={() => {
              setQuery('TSB-2026-1088');
            }}
            className="text-[#B45309] hover:underline font-mono"
          >
            TSB-2026-1088
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#DC2626]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Results */}
      {order && (
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in duration-300">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F2ECE1]">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#8C6D58]">
                Order Status
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#B45309]">
                  {order.order_number}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isCancelled
                      ? 'bg-[#FEF2F2] text-[#DC2626]'
                      : order.order_status === 'Delivered'
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  {order.order_status}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#5C4A3E] sm:text-right">
              <div>Placed on {new Date(order.created_at).toLocaleString()}</div>
              <div className="font-semibold text-[#2B1810]">
                Payment: <span className="text-[#B45309]">{order.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {!isCancelled && (
            <div className="py-4">
              <div className="relative">
                {/* Connecting Track */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-[#E5DCD0] rounded-full" />
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#F59E0B] to-[#15803D] rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100)
                    )}%`,
                  }}
                />

                {/* Step Circles */}
                <div className="relative flex justify-between">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-[#15803D] text-white shadow-md'
                              : 'bg-white border-2 border-[#D5C7B5] text-[#8C6D58]'
                          } ${isCurrent ? 'ring-4 ring-[#F59E0B]/30' : ''}`}
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs mt-2 font-medium text-center hidden sm:block ${
                            isCurrent
                              ? 'text-[#2B1810] font-bold'
                              : isDone
                              ? 'text-[#15803D]'
                              : 'text-[#8C6D58]'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Current Status Explanation */}
          <div className="bg-[#FAF5EE] rounded-2xl p-5 border border-[#E7DECD] flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div className="text-xs text-[#5C4A3E]">
              <span className="font-bold text-[#2B1810] block mb-0.5">
                Current Stage: {order.order_status}
              </span>
              {order.order_status === 'Pending' &&
                'Your order has been received by our bakery team and is waiting for baker confirmation.'}
              {order.order_status === 'Confirmed' &&
                'Your order is verified. Ingredients and baking batches have been allocated.'}
              {order.order_status === 'Preparing' &&
                'Our master pastry chefs and halwais are actively preparing and packing your fresh items.'}
              {order.order_status === 'Ready' &&
                'Your bakery box is packed, sealed, and waiting for the delivery rider.'}
              {order.order_status === 'Out for Delivery' &&
                'Rider is on the way with your order! Keep your phone handy for gate delivery.'}
              {order.order_status === 'Delivered' &&
                'Order has been successfully delivered. We hope you love every bite!'}
              {order.order_status === 'Cancelled' &&
                'This order was cancelled. Please contact our support hotline for queries.'}
            </div>
          </div>

          {/* Recipient & Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F2ECE1]">
            {/* Recipient Info */}
            <div className="space-y-2 text-xs text-[#5C4A3E]">
              <h3 className="font-serif text-sm font-bold text-[#2B1810]">Delivery Details</h3>
              <p>
                <strong>Customer:</strong> {order.customer_name}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
              <p>
                <strong>Address:</strong> {order.delivery_address}
              </p>
              {order.notes && (
                <p className="bg-[#FEF3C7]/40 p-2 rounded-lg text-[#78350F]">
                  <strong>Notes:</strong> {order.notes}
                </p>
              )}
            </div>

            {/* Items Summary */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#2B1810]">Ordered Items</h3>
              <div className="divide-y divide-[#F2ECE1] max-h-52 overflow-y-auto pr-1">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between text-xs">
                    <div>
                      <span className="font-medium text-[#2B1810]">{item.product_name}</span>
                      <span className="text-[#8C6D58] block text-[11px]">
                        {item.quantity} × Rs. {item.unit_price.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-bold text-[#2B1810] tabular-nums">
                      Rs. {item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E7DECD] flex justify-between text-sm font-bold text-[#2B1810]">
                <span>Total Amount:</span>
                <span className="text-[#B45309] font-serif text-base tabular-nums">
                  Rs. {order.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
