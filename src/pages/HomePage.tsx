import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types/database';
import { getProducts, getCategories } from '../lib/databaseService';
import {
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  HeartHandshake,
  Star,
  Quote,
  Clock,
  MapPin,
  Phone,
  CakeSlice,
  CheckCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setView, setSelectedCategorySlug, settings } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(cats.filter((c) => c.is_active));
        setFeaturedProducts(prods.filter((p) => p.is_featured).slice(0, 4));
        setBestSellers(prods.slice(0, 4));
      } catch (e) {
        console.error('Failed to load home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reviews = [
    {
      name: 'Farhan Zaidi',
      role: 'Family Customer since 2011',
      rating: 5,
      comment:
        'Tariq Sweets has been our family staple for every Eid and wedding. Their Desi Ghee Gulab Jamun are unmatched anywhere in the city—soft, fragrant, and perfectly balanced sugar.',
    },
    {
      name: 'Dr. Sarah Bilal',
      role: 'Regular Weekend Customer',
      rating: 5,
      comment:
        'The Belgian Chocolate Fudge Cake is on par with London patisseries. Super rich ganache, moist crumb, and delivered warm and pristine within 40 minutes of ordering.',
    },
    {
      name: 'Kamran Aslam',
      role: 'Corporate Catering Partner',
      rating: 5,
      comment:
        'We ordered 80 boxes of Nan Khatai and Chicken Patties for our annual company meeting. The packaging was royal and the taste was unanimously praised by all our guests.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Large Hero Section */}
      <section className="relative overflow-hidden bg-[#24150F] text-[#FFFDF9]">
        {/* Ambient warm glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#B45309]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brand copy and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#F59E0B] bg-[#3B2216] px-3.5 py-1.5 rounded-full border border-[#523322]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handcrafted Royal Bakery & Pure Desi Ghee Mithai</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFDF9] leading-[1.12]">
                Freshly Baked Happiness, <br className="hidden sm:inline" />
                <span className="text-[#F59E0B] italic font-serif">Every Day!</span>
              </h1>

              <p className="text-base sm:text-lg text-[#E3D3C4] leading-relaxed max-w-xl">
                Welcome to <strong>Tariq Sweets and Bakers</strong>. From decadent Belgian chocolate cakes to melt-in-the-mouth desi ghee gulab jamun and crispy golden patties, we combine heirloom recipes with artisanal mastery.
              </p>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-[#B45309]/25 hover:from-[#B45309] hover:to-[#92400E] transition-all active:scale-[0.98]"
                >
                  Order Now <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setSelectedCategorySlug('sweets');
                    setView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-4 rounded-xl bg-[#3D2619] hover:bg-[#4E3121] text-[#FEF3C7] font-semibold text-sm border border-[#5E3C29] transition-all"
                >
                  Traditional Mithai
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="pt-8 border-t border-[#3E271B] grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#F59E0B] tabular-nums">
                    40+
                  </span>
                  <span className="text-xs text-[#BFAFA0]">Years of Legacy</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#F59E0B] tabular-nums">
                    100%
                  </span>
                  <span className="text-xs text-[#BFAFA0]">Pure Desi Ghee</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#F59E0B] tabular-nums">
                    45m
                  </span>
                  <span className="text-xs text-[#BFAFA0]">Fresh Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Showcase Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#543625] bg-[#3B2216]">
                <img
                  src="/src/assets/images/hero_tariq_bakery_1794132727960.jpg"
                  alt="Tariq Sweets and Bakers fresh display counter"
                  className="w-full h-full object-cover aspect-[4/3] lg:aspect-[1/1] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-left p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F59E0B]">
                    Fresh Out Of The Oven
                  </span>
                  <p className="font-serif text-sm sm:text-base font-bold text-white mt-0.5">
                    Signature Chocolate Fudge & Pure Desi Ghee Mithai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories with Pictures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E7DECD] gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#B45309] mb-1">
              Curated Collections
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810]">
              Browse by Category
            </h2>
          </div>
          <button
            onClick={() => {
              setView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-[#B45309] hover:text-[#92400E] flex items-center gap-1"
          >
            Explore Full Menu <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className="group cursor-pointer rounded-2xl bg-[#FFFDF9] border border-[#EBE3D5] overflow-hidden hover:border-[#D4AF37] hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] w-full bg-[#F5EFE6] overflow-hidden relative">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-base font-bold text-white drop-shadow-sm">
                    {cat.name}
                  </h3>
                </div>
              </div>
              <div className="p-3.5 text-xs text-[#6B5749]">
                <p className="line-clamp-2 leading-relaxed">{cat.description}</p>
                <div className="mt-2 text-[#B45309] font-semibold text-[11px] flex items-center gap-1 group-hover:underline">
                  View Items <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E7DECD] gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#B45309] mb-1">
              Handcrafted Specialities
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810]">
              Featured Baker's Creations
            </h2>
          </div>
          <button
            onClick={() => {
              setView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-[#B45309] hover:text-[#92400E] flex items-center gap-1"
          >
            See All Items <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-[#EFE8DC] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Special Offers & Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#3B2216] via-[#2B1810] to-[#451A03] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-[#5A3825]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
              Special City Delivery Offer
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#FFFDF9] leading-tight">
              Enjoy Free Delivery on all orders above Rs. {settings.free_delivery_threshold?.toLocaleString()}!
            </h3>
            <p className="text-sm text-[#E2D2C2] leading-relaxed">
              Order your favorite assortment of Desi Ghee Gulab Jamun, Belgian Fudge Cake, and fresh Chicken Patties delivered straight to your doorstep warm and secure.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#F59E0B] text-[#2B1810] font-bold text-sm hover:bg-[#D97706] transition-colors shadow-md"
              >
                Claim Free Delivery
              </button>
              <button
                onClick={() => {
                  setView('track-order');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-transparent border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
              >
                Track An Existing Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best-Selling Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E7DECD] gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#B45309] mb-1">
              Customer Favorites
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810]">
              Best-Selling Sweets & Savories
            </h2>
          </div>
          <button
            onClick={() => {
              setView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-[#B45309] hover:text-[#92400E] flex items-center gap-1"
          >
            View Entire Menu <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className="bg-[#FAF5EE] py-16 border-y border-[#EBE3D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
              The Tariq Promise
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810] mt-1">
              Why Discerning Customers Choose Us
            </h2>
            <p className="text-sm text-[#665449] mt-2">
              Four decades of continuous commitment to culinary purity, traditional recipes, and warm hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E7DECD] text-left space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                <Award className="w-6 h-6 stroke-[1.7]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1810]">Pure 100% Desi Ghee</h3>
              <p className="text-xs text-[#6B5749] leading-relaxed">
                We use genuine butter ghee from verified dairy farms for all our traditional mithai and nan khatai, guaranteeing authentic aroma.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E7DECD] text-left space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                <Clock className="w-6 h-6 stroke-[1.7]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1810]">Baked 3x Daily</h3>
              <p className="text-xs text-[#6B5749] leading-relaxed">
                Patties, croissants, breads, and tea cakes are pulled from our stone ovens morning, noon, and evening to ensure maximum crispness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E7DECD] text-left space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                <Truck className="w-6 h-6 stroke-[1.7]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1810]">Express City Delivery</h3>
              <p className="text-xs text-[#6B5749] leading-relaxed">
                Our insulated delivery couriers deliver orders fast, keeping hot savory pastries warm and confectionery chilled.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E7DECD] text-left space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                <HeartHandshake className="w-6 h-6 stroke-[1.7]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B1810]">Generations of Trust</h3>
              <p className="text-xs text-[#6B5749] leading-relaxed">
                Serving over 50,000 satisfied families for weddings, Eid celebrations, corporate events, and daily afternoon tea.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
            Patron Testimonials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810] mt-1">
            Loved by Confectionery Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-[#FFFDF9] border border-[#E7DECD] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#5C4A3E] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1]">
                <h4 className="font-serif text-sm font-bold text-[#2B1810]">{rev.name}</h4>
                <span className="text-[11px] text-[#8C6D58]">{rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Contact & Order Pickup Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#E7DECD] p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
                Visit Our Flagship Bakery
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810]">
                Experience Fresh Baking in Person
              </h3>
              <p className="text-xs sm:text-sm text-[#665449] leading-relaxed">
                Step into our fragrant baking hall to witness fresh cakes being iced, mithai being rolled in pure desi ghee, and hot chicken patties arriving fresh from the stone ovens.
              </p>
              <div className="space-y-2 pt-2 text-xs text-[#5C4A3E]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B45309]" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B45309]" />
                  <span>{settings.opening_hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#B45309]" />
                  <span>Order Hotline: {settings.phone}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
              <button
                onClick={() => {
                  setView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#2B1810] text-[#FEF3C7] font-semibold text-sm hover:bg-[#451A03] transition-colors text-center shadow-md"
              >
                Order for Home Delivery
              </button>
              <button
                onClick={() => {
                  setView('track-order');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 px-6 rounded-xl bg-[#FAF5EE] text-[#451A03] font-semibold text-xs border border-[#E7DECD] hover:bg-[#F2ECE1] transition-colors text-center"
              >
                Check Active Order Status
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
