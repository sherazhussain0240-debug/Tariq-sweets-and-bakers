import React, { useState } from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { ShoppingBag, Search, ShieldCheck, Menu, X, Clock, Phone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { view, setView, setSelectedCategorySlug, cartCount, setIsCartOpen, adminUser } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (newView: AppView, categorySlug?: string) => {
    if (categorySlug !== undefined) {
      setSelectedCategorySlug(categorySlug);
    }
    setView(newView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E7DECD] transition-all">
        {/* Main 1-Row 3-Zone Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#B45309] flex items-center justify-center text-[#2B1810] font-bold shadow-sm shadow-[#F59E0B]/20">
              <span className="font-serif text-lg italic font-bold">T</span>
            </div>
            <div className="whitespace-nowrap">
              <span className="block font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2B1810] group-hover:text-[#B45309] transition-colors">
                TARIQ SWEETS & BAKERS
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-[#8C6D58]">
                EST. 1984 · PURE DESI GHEE & ARTISAN BAKING
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#451A03]">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#B45309] transition-colors whitespace-nowrap shrink-0 ${
                view === 'home' ? 'text-[#B45309] font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('shop', 'all')}
              className={`hover:text-[#B45309] transition-colors whitespace-nowrap shrink-0 ${
                view === 'shop' ? 'text-[#B45309] font-semibold' : ''
              }`}
            >
              Browse Catalog
            </button>
            <button
              onClick={() => navigateTo('shop', 'sweets')}
              className="hover:text-[#B45309] transition-colors whitespace-nowrap shrink-0"
            >
              Sweets (Mithai)
            </button>
            <button
              onClick={() => navigateTo('shop', 'cakes')}
              className="hover:text-[#B45309] transition-colors whitespace-nowrap shrink-0"
            >
              Artisan Cakes
            </button>
            <button
              onClick={() => navigateTo('shop', 'snacks')}
              className="hover:text-[#B45309] transition-colors whitespace-nowrap shrink-0"
            >
              Savory Snacks
            </button>
            <button
              onClick={() => navigateTo('track-order')}
              className={`hover:text-[#B45309] transition-colors whitespace-nowrap shrink-0 ${
                view === 'track-order' ? 'text-[#B45309] font-semibold' : ''
              }`}
            >
              Track Order
            </button>
          </nav>

          {/* Zone 3: Primary Action & Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick search affordance */}
            <button
              onClick={() => navigateTo('shop', 'all')}
              className="p-2 text-[#451A03] hover:text-[#B45309] hover:bg-[#F4ECE1] rounded-full transition-colors hidden sm:flex items-center"
              title="Search Products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin dashboard button */}
            {adminUser ? (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2B1810] text-[#FEF3C7] hover:bg-[#451A03] transition-colors whitespace-nowrap shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">Admin Portal</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('admin-login')}
                className="text-xs text-[#8C6D58] hover:text-[#2B1810] px-2 py-1 transition-colors whitespace-nowrap hidden sm:inline-block"
              >
                Admin Login
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white hover:from-[#B45309] hover:to-[#92400E] shadow-sm shadow-[#B45309]/30 transition-all active:scale-95 whitespace-nowrap"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#2B1810] text-[#FEF3C7] text-xs font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2B1810] hover:bg-[#F4ECE1] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFDF9] border-b border-[#E7DECD] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2 text-base font-medium text-[#451A03]">
              <button
                onClick={() => navigateTo('home')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F4ECE1]"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('shop', 'all')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F4ECE1]"
              >
                All Products Catalog
              </button>
              <button
                onClick={() => navigateTo('shop', 'sweets')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F4ECE1]"
              >
                Traditional Sweets (Mithai)
              </button>
              <button
                onClick={() => navigateTo('shop', 'cakes')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F4ECE1]"
              >
                Artisan Cakes & Pastries
              </button>
              <button
                onClick={() => navigateTo('shop', 'biscuits')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F4ECE1]"
              >
                Biscuits & Nan Khatai
              </button>
              <button
                onClick={() => navigateTo('shop', 'snacks')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F4ECE1]"
              >
                Savory Snacks & Patties
              </button>
              <button
                onClick={() => navigateTo('track-order')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F4ECE1]"
              >
                Track Live Order
              </button>
              <div className="pt-2 border-t border-[#E7DECD] flex items-center justify-between text-xs text-[#8C6D58] px-3">
                <button onClick={() => navigateTo('admin-login')} className="hover:text-[#2B1810]">
                  Admin Dashboard Login
                </button>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +92 300 8472910
                </span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
