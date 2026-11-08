import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, setSelectedCategorySlug, settings } = useStore();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#23150E] text-[#D5C7B5] pt-14 pb-10 border-t border-[#382419]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3D281C]">
          {/* Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#B45309] flex items-center justify-center text-[#2B1810] font-serif font-bold italic text-base">
                T
              </div>
              <span className="font-serif text-lg font-bold text-[#FFFDF9] tracking-tight">
                TARIQ SWEETS & BAKERS
              </span>
            </div>
            <p className="text-xs text-[#BFAFA0] leading-relaxed">
              Crafting premium confectionery since 1984. Renowned for our signature Belgian chocolate fudge cakes, authentic royal desi ghee mithai, crunchy nan khatai, and warm artisanal breakfast bakery.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F59E0B] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halal & Pure Dairy Ingredients</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#FFFDF9] tracking-wider uppercase mb-4">
              Bakery Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleCategoryClick('sweets')}
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Traditional Sweets (Mithai)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('cakes')}
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Artisan Cakes & Pastries
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('biscuits')}
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Nan Khatai & Biscuits
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('snacks')}
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Flaky Chicken Patties & Savories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('breads')}
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Fresh Daily Loaves & Breads
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Orders */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#FFFDF9] tracking-wider uppercase mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setView('track-order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Track Your Order Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Browse Full Price Menu
                </button>
              </li>
              <li>
                <span className="text-[#8C6D58]">Payment Options:</span> Cash on Delivery, Bank Transfer, JazzCash
              </li>
              <li>
                <span className="text-[#8C6D58]">City Delivery:</span> Free over Rs. {settings.free_delivery_threshold?.toLocaleString()}
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {
                    setView('admin-login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#D97706] hover:underline"
                >
                  Administrator Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#FFFDF9] tracking-wider uppercase mb-4">
              Visit & Contact
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-[#BFAFA0]">
              <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#BFAFA0]">
              <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-[#FFFDF9]">
                {settings.phone}
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#BFAFA0]">
              <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span>{settings.opening_hours}</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C6D58] gap-4">
          <p>© {new Date().getFullYear()} Tariq Sweets and Bakers. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Baked with <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-current" /> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};
