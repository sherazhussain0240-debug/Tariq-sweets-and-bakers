import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category } from '../types/database';
import { getProducts, getCategories } from '../lib/databaseService';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, CakeSlice } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { selectedCategorySlug, setSelectedCategorySlug } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShopData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(cats.filter((c) => c.is_active));
        setProducts(prods);
      } catch (e) {
        console.error('Failed to load shop items:', e);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, []);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategorySlug !== 'all') {
          const cat = categories.find((c) => c.slug === selectedCategorySlug);
          if (cat && p.category_id !== cat.id) {
            return false;
          }
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.category_name && p.category_name.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [products, categories, selectedCategorySlug, searchQuery, sortBy]);

  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
            Online Bakery Menu
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2B1810]">
            {activeCategory ? activeCategory.name : 'All Fresh Delicacies'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5749] leading-relaxed">
            {activeCategory
              ? activeCategory.description
              : 'Explore our complete menu of traditional Pakistani mithai, artisan cakes, tea cookies, flaky patties, and daily bakery specialties.'}
          </p>
        </div>

        {/* Search and Sort Toolbar */}
        <div className="mt-6 pt-6 border-t border-[#F2ECE1] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes, gulab jamun, patties, cookies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810] placeholder-[#9E8E80] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8C6D58] hover:text-[#2B1810]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="sm:col-span-4 flex items-center gap-2 justify-end">
            <span className="text-xs text-[#8C6D58] font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-xs font-medium text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Segmented Filter Tabs (Interactive Filter Controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategorySlug('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategorySlug === 'all'
              ? 'bg-[#2B1810] text-[#FEF3C7] shadow-sm'
              : 'bg-[#FFFDF9] text-[#5C4A3E] border border-[#E7DECD] hover:border-[#B45309]'
          }`}
        >
          All Items ({products.length})
        </button>

        {categories.map((cat) => {
          const count = products.filter((p) => p.category_id === cat.id).length;
          const isActive = selectedCategorySlug === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#2B1810] text-[#FEF3C7] shadow-sm'
                  : 'bg-[#FFFDF9] text-[#5C4A3E] border border-[#E7DECD] hover:border-[#B45309]'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-[#EFE8DC] animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E7DECD] p-12 text-center max-w-md mx-auto my-12">
          <CakeSlice className="w-12 h-12 text-[#C49B38] mx-auto mb-3 stroke-[1.5]" />
          <h3 className="font-serif text-lg font-bold text-[#2B1810]">No baked items found</h3>
          <p className="text-xs text-[#8C6D58] mt-1 leading-relaxed">
            We couldn't find anything matching your search. Try another keyword or switch categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategorySlug('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
