import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Category,
  Product,
  Order,
  OrderStatus,
  StoreSettings,
} from '../types/database';
import {
  getCategories,
  getProducts,
  getOrders,
  getStoreSettings,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
  updateStoreSettings,
  uploadProductImage,
} from '../lib/databaseService';
import {
  testSupabaseConnection,
  saveStoredSupabaseConfig,
  getStoredSupabaseConfig,
} from '../lib/supabase';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  TrendingUp,
  DollarSign,
  Search,
  Upload,
  Database,
  Copy,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'categories' | 'orders' | 'settings' | 'supabase';

export const AdminDashboard: React.FC = () => {
  const { adminUser, logoutAdmin, notify, refreshSettings } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Core Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settingsData, setSettingsData] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    unit: 'per kg',
    image_url: '',
    is_available: true,
    is_featured: false,
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true,
  });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Supabase Configuration State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    loadAllData();
    const config = getStoredSupabaseConfig();
    if (config) {
      setSupabaseUrl(config.url);
      setSupabaseAnonKey(config.anonKey);
    }
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [cats, prods, ords, setts] = await Promise.all([
        getCategories(),
        getProducts(),
        getOrders(),
        getStoreSettings(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setOrders(ords);
      setSettingsData(setts);
    } catch (e) {
      console.error('Failed to load admin data:', e);
      notify('Failed to refresh data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Product Handlers ---
  const handleOpenAddProduct = () => {
    setProductFormData({
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      price: '',
      unit: 'per kg',
      image_url: '/src/assets/images/hero_tariq_bakery_1794132727960.jpg',
      is_available: true,
      is_featured: false,
    });
    setEditingProduct(null);
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      category_id: prod.category_id,
      description: prod.description,
      price: prod.price.toString(),
      unit: prod.unit,
      image_url: prod.image_url,
      is_available: prod.is_available,
      is_featured: prod.is_featured,
    });
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceNum = parseFloat(productFormData.price) || 0;
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: productFormData.name,
          category_id: productFormData.category_id,
          description: productFormData.description,
          price: priceNum,
          unit: productFormData.unit,
          image_url: productFormData.image_url,
          is_available: productFormData.is_available,
          is_featured: productFormData.is_featured,
        });
        notify(`Updated "${productFormData.name}" successfully!`);
      } else {
        await createProduct({
          name: productFormData.name,
          category_id: productFormData.category_id,
          description: productFormData.description,
          price: priceNum,
          unit: productFormData.unit,
          image_url: productFormData.image_url,
          is_available: productFormData.is_available,
          is_featured: productFormData.is_featured,
        });
        notify(`Added new product "${productFormData.name}"!`);
      }
      setIsAddProductOpen(false);
      loadAllData();
    } catch (err) {
      notify('Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the bakery catalog?`)) {
      try {
        await deleteProduct(id);
        notify(`Deleted "${name}"`);
        loadAllData();
      } catch {
        notify('Failed to delete product', 'error');
      }
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        notify('Uploading image...', 'info');
        const url = await uploadProductImage(file);
        setProductFormData((prev) => ({ ...prev, image_url: url }));
        notify('Image uploaded successfully!');
      } catch {
        notify('Failed to upload image', 'error');
      }
    }
  };

  // --- Category Handlers ---
  const handleOpenAddCategory = () => {
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '/src/assets/images/cat_cakes_pastries_1794132729068.jpg',
      is_active: true,
    });
    setEditingCategory(null);
    setIsAddCategoryOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: cat.image_url,
      is_active: cat.is_active,
    });
    setIsAddCategoryOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug =
        categoryFormData.slug.trim() ||
        categoryFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryFormData.name,
          slug,
          description: categoryFormData.description,
          image_url: categoryFormData.image_url,
          is_active: categoryFormData.is_active,
        });
        notify(`Updated category "${categoryFormData.name}"`);
      } else {
        await createCategory({
          name: categoryFormData.name,
          slug,
          description: categoryFormData.description,
          image_url: categoryFormData.image_url,
          is_active: categoryFormData.is_active,
        });
        notify(`Created category "${categoryFormData.name}"`);
      }
      setIsAddCategoryOpen(false);
      loadAllData();
    } catch {
      notify('Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const prodsInCat = products.filter((p) => p.category_id === id);
    if (prodsInCat.length > 0) {
      alert(`Cannot delete "${name}" because it still contains ${prodsInCat.length} products. Reassign or delete those products first.`);
      return;
    }
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await deleteCategory(id);
        notify(`Deleted category "${name}"`);
        loadAllData();
      } catch {
        notify('Failed to delete category', 'error');
      }
    }
  };

  // --- Order Status Handler ---
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      notify(`Order updated to "${status}"`);
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails((prev) => (prev ? { ...prev, order_status: status } : null));
      }
      loadAllData();
    } catch {
      notify('Failed to update order status', 'error');
    }
  };

  // --- Settings Handlers ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsData) return;
    try {
      await updateStoreSettings(settingsData);
      await refreshSettings();
      notify('Store business settings saved successfully!');
    } catch {
      notify('Failed to save store settings', 'error');
    }
  };

  // --- Supabase Config Handlers ---
  const handleSaveSupabaseConfig = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      saveStoredSupabaseConfig(null);
      notify('Supabase credentials cleared. Using local persistence engine.');
      setSupabaseTestStatus(null);
      loadAllData();
      return;
    }

    setSupabaseTestStatus('Testing connection...');
    const result = await testSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
    if (result.success) {
      saveStoredSupabaseConfig({
        url: supabaseUrl.trim(),
        anonKey: supabaseAnonKey.trim(),
      });
      setSupabaseTestStatus('Connected! ' + result.message);
      notify('Supabase connected successfully!');
      loadAllData();
    } else {
      setSupabaseTestStatus('Connection failed: ' + result.message);
      notify('Failed to connect to Supabase: ' + result.message, 'error');
    }
  };

  const copySchemaSql = async () => {
    try {
      const resp = await fetch('/supabase/schema.sql');
      const text = await resp.text();
      await navigator.clipboard.writeText(text);
      setCopiedSql(true);
      notify('Copied complete Supabase SQL Schema to clipboard!');
      setTimeout(() => setCopiedSql(false), 2500);
    } catch (e) {
      notify('Could not auto-copy. You can find the file at /supabase/schema.sql', 'info');
    }
  };

  // Statistics
  const totalRevenue = orders
    .filter((o) => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;
  const completedOrdersCount = orders.filter((o) => o.order_status === 'Delivered').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.order_status === orderFilter;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.category_name && p.category_name.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-[#F7F4EC] pb-20">
      {/* Top Admin Bar */}
      <div className="bg-[#2B1810] text-[#FEF3C7] border-b border-[#451A03] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F59E0B] text-[#2B1810] font-serif font-bold italic flex items-center justify-center">
              T
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                Tariq Sweets Admin Console
              </span>
              <span className="block text-xs text-[#E3D3C4]">
                Signed in as <strong>{adminUser?.full_name || 'Administrator'}</strong> ({adminUser?.role || 'superadmin'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3D2619] hover:bg-[#4E3121] text-xs font-semibold text-[#FEF3C7] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-[#FFFDF9] border-b border-[#E7DECD] px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-2.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#2B1810] text-[#FEF3C7]'
                : 'text-[#6B5749] hover:text-[#2B1810] hover:bg-[#F5EFE6]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap relative ${
              activeTab === 'orders'
                ? 'bg-[#2B1810] text-[#FEF3C7]'
                : 'text-[#6B5749] hover:text-[#2B1810] hover:bg-[#F5EFE6]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Customer Orders
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#2B1810] text-[#FEF3C7]'
                : 'text-[#6B5749] hover:text-[#2B1810] hover:bg-[#F5EFE6]'
            }`}
          >
            <Package className="w-4 h-4" /> Products Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#2B1810] text-[#FEF3C7]'
                : 'text-[#6B5749] hover:text-[#2B1810] hover:bg-[#F5EFE6]'
            }`}
          >
            <FolderTree className="w-4 h-4" /> Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#2B1810] text-[#FEF3C7]'
                : 'text-[#6B5749] hover:text-[#2B1810] hover:bg-[#F5EFE6]'
            }`}
          >
            <Settings className="w-4 h-4" /> Store Settings
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'bg-[#15803D] text-white'
                : 'text-[#15803D] hover:bg-[#DCFCE7]'
            }`}
          >
            <Database className="w-4 h-4" /> Supabase Database
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E7DECD] shadow-xs space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#8C6D58]">
                  Total Orders
                </span>
                <div className="font-serif text-3xl font-bold text-[#2B1810] tabular-nums">
                  {orders.length}
                </div>
                <div className="text-xs text-[#15803D] font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Live customer orders
                </div>
              </div>

              <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E7DECD] shadow-xs space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#8C6D58]">
                  Pending Kitchen Orders
                </span>
                <div className="font-serif text-3xl font-bold text-[#D97706] tabular-nums">
                  {pendingOrdersCount}
                </div>
                <div className="text-xs text-[#8C6D58]">Awaiting baker confirmation</div>
              </div>

              <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E7DECD] shadow-xs space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#8C6D58]">
                  Delivered Orders
                </span>
                <div className="font-serif text-3xl font-bold text-[#15803D] tabular-nums">
                  {completedOrdersCount}
                </div>
                <div className="text-xs text-[#8C6D58]">Successfully completed</div>
              </div>

              <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E7DECD] shadow-xs space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#8C6D58]">
                  Total Order Value
                </span>
                <div className="font-serif text-3xl font-bold text-[#B45309] tabular-nums">
                  Rs. {totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-[#8C6D58]">Gross sales across orders</div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
                <h2 className="font-serif text-lg font-bold text-[#2B1810]">
                  Recent Customer Orders
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#B45309] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] text-[#8C6D58] uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total (PKR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF5EE]/50">
                        <td className="py-3 px-4 font-mono font-bold text-[#B45309]">
                          {ord.order_number}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#2B1810]">
                          {ord.customer_name}
                        </td>
                        <td className="py-3 px-4 text-[#6B5749]">{ord.phone}</td>
                        <td className="py-3 px-4 text-[#6B5749]">
                          {ord.items?.length || 0} items
                        </td>
                        <td className="py-3 px-4 font-bold tabular-nums text-[#2B1810]">
                          Rs. {ord.total_amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              ord.order_status === 'Delivered'
                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                : ord.order_status === 'Pending'
                                ? 'bg-[#FEF3C7] text-[#B45309]'
                                : ord.order_status === 'Cancelled'
                                ? 'bg-[#FEF2F2] text-[#DC2626]'
                                : 'bg-[#EFF6FF] text-[#1D4ED8]'
                            }`}
                          >
                            {ord.order_status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setSelectedOrderDetails(ord);
                              setActiveTab('orders');
                            }}
                            className="text-[#B45309] hover:underline font-semibold"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#2B1810]">Order Management</h1>
                <p className="text-xs text-[#6B5749]">
                  Review live customer orders, update kitchen status, and inspect delivery addresses.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  'all',
                  'Pending',
                  'Confirmed',
                  'Preparing',
                  'Ready',
                  'Out for Delivery',
                  'Delivered',
                  'Cancelled',
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      orderFilter === st
                        ? 'bg-[#2B1810] text-[#FEF3C7]'
                        : 'bg-[#FFFDF9] text-[#6B5749] border border-[#E7DECD] hover:border-[#B45309]'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table & Detail Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div
                className={`${
                  selectedOrderDetails ? 'lg:col-span-7' : 'lg:col-span-12'
                } bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] overflow-hidden shadow-xs`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5EE] text-[#8C6D58] uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4">Order Ref</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Address</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE1]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#8C6D58]">
                            No orders matching the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr
                            key={ord.id}
                            onClick={() => setSelectedOrderDetails(ord)}
                            className={`cursor-pointer transition-colors ${
                              selectedOrderDetails?.id === ord.id
                                ? 'bg-[#FEF3C7]/40'
                                : 'hover:bg-[#FAF5EE]/60'
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-bold text-[#B45309]">
                              {ord.order_number}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-[#2B1810] block">
                                {ord.customer_name}
                              </span>
                              <span className="text-[11px] text-[#8C6D58]">{ord.phone}</span>
                            </td>
                            <td className="py-3 px-4 text-[#6B5749] max-w-xs truncate">
                              {ord.delivery_address}
                            </td>
                            <td className="py-3 px-4 font-bold tabular-nums text-[#2B1810]">
                              Rs. {ord.total_amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  ord.order_status === 'Delivered'
                                    ? 'bg-[#DCFCE7] text-[#15803D]'
                                    : ord.order_status === 'Pending'
                                    ? 'bg-[#FEF3C7] text-[#B45309]'
                                    : ord.order_status === 'Cancelled'
                                    ? 'bg-[#FEF2F2] text-[#DC2626]'
                                    : 'bg-[#EFF6FF] text-[#1D4ED8]'
                                }`}
                              >
                                {ord.order_status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderDetails(ord);
                                }}
                                className="text-[#B45309] hover:underline font-semibold"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Detail Panel */}
              {selectedOrderDetails && (
                <div className="lg:col-span-5 bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between pb-3 border-b border-[#F2ECE1]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C6D58]">
                        Order Details
                      </span>
                      <h3 className="font-mono text-xl font-bold text-[#B45309]">
                        {selectedOrderDetails.order_number}
                      </h3>
                      <span className="text-xs text-[#8C6D58]">
                        Placed on {new Date(selectedOrderDetails.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="text-xs text-[#8C6D58] hover:text-[#2B1810]"
                    >
                      Close
                    </button>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-[#FAF5EE] p-4 rounded-2xl text-xs space-y-1.5 text-[#5C4A3E]">
                    <p>
                      <strong>Customer:</strong> {selectedOrderDetails.customer_name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrderDetails.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedOrderDetails.delivery_address}
                    </p>
                    <p>
                      <strong>Payment:</strong> {selectedOrderDetails.payment_method}
                    </p>
                    {selectedOrderDetails.notes && (
                      <p className="bg-[#FEF3C7] p-2 rounded text-[#78350F]">
                        <strong>Instructions:</strong> {selectedOrderDetails.notes}
                      </p>
                    )}
                  </div>

                  {/* Order Status Changer */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1.5">
                      Update Order Status
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          'Pending',
                          'Confirmed',
                          'Preparing',
                          'Ready',
                          'Out for Delivery',
                          'Delivered',
                          'Cancelled',
                        ] as OrderStatus[]
                      ).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selectedOrderDetails.id, status)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedOrderDetails.order_status === status
                              ? 'bg-[#2B1810] text-[#FEF3C7] shadow-sm'
                              : 'bg-white border border-[#D5C7B5] text-[#5C4A3E] hover:border-[#B45309]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="space-y-2 pt-2 border-t border-[#F2ECE1]">
                    <span className="font-semibold text-xs text-[#2B1810] block">Ordered Items</span>
                    <div className="divide-y divide-[#F2ECE1] max-h-48 overflow-y-auto pr-1">
                      {selectedOrderDetails.items?.map((item) => (
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

                    <div className="pt-3 border-t border-[#E7DECD] flex justify-between text-sm font-bold text-[#2B1810]">
                      <span>Total Amount:</span>
                      <span className="text-[#B45309] font-serif text-base tabular-nums">
                        Rs. {selectedOrderDetails.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#2B1810]">Product Catalog</h1>
                <p className="text-xs text-[#6B5749]">
                  Manage items, update prices in PKR, upload photos, and toggle availability.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9 pr-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-xs text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] text-[#8C6D58] uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Photo</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (PKR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FAF5EE]/50">
                        <td className="py-2.5 px-4">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg bg-[#F5EFE6]"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="font-semibold text-sm text-[#2B1810] block">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-[#8C6D58] line-clamp-1 max-w-xs">
                            {prod.description}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[#6B5749] font-medium">
                          {prod.category_name}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-sm text-[#2B1810] tabular-nums">
                          Rs. {prod.price.toLocaleString()}{' '}
                          <span className="text-[10px] text-[#8C6D58] font-normal">
                            ({prod.unit})
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.is_available
                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                : 'bg-[#FEF2F2] text-[#DC2626]'
                            }`}
                          >
                            {prod.is_available ? 'Available' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          {prod.is_featured ? (
                            <span className="text-[#B45309] font-bold text-[11px]">★ Featured</span>
                          ) : (
                            <span className="text-[#9E8E80] text-[11px]">Regular</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-[#5C4A3E] hover:text-[#B45309] rounded hover:bg-[#F2ECE1]"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-[#DC2626] hover:text-[#991B1B] rounded hover:bg-[#FEF2F2]"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#2B1810]">
                  Category Management
                </h1>
                <p className="text-xs text-[#6B5749]">
                  Add, edit, and organize product categories and their showcase banners.
                </p>
              </div>

              <button
                onClick={handleOpenAddCategory}
                className="px-4 py-2 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-[#FFFDF9] rounded-2xl border border-[#E7DECD] overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/9] w-full bg-[#F5EFE6] overflow-hidden relative">
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                          {count} {count === 1 ? 'Product' : 'Products'}
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h3 className="font-serif text-base font-bold text-[#2B1810]">{cat.name}</h3>
                        <p className="text-xs text-[#6B5749] line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                        <span className="text-[10px] text-[#8C6D58] block font-mono">
                          Slug: /{cat.slug}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                      <span
                        className={`font-semibold ${
                          cat.is_active ? 'text-[#15803D]' : 'text-[#DC2626]'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-1.5 text-[#5C4A3E] hover:text-[#B45309] rounded hover:bg-[#F2ECE1]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 text-[#DC2626] hover:text-[#991B1B] rounded hover:bg-[#FEF2F2]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: STORE BUSINESS SETTINGS */}
        {activeTab === 'settings' && settingsData && (
          <div className="max-w-3xl bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-[#F2ECE1]">
              <h1 className="font-serif text-2xl font-bold text-[#2B1810]">Business Settings</h1>
              <p className="text-xs text-[#6B5749] mt-0.5">
                Configure store contact details, city delivery charges, and announcements.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Bakery Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={settingsData.store_name}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, store_name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                    Contact Phone / Order Hotline
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsData.phone}
                    onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                    City Delivery Charge (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={settingsData.delivery_charge}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        delivery_charge: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Free Delivery Threshold (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={settingsData.free_delivery_threshold}
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      free_delivery_threshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Bakery Physical Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={settingsData.address}
                  onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  required
                  value={settingsData.opening_hours}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, opening_hours: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div className="pt-2 border-t border-[#F2ECE1]">
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Top Promotional Announcement Banner
                </label>
                <input
                  type="text"
                  value={settingsData.promo_banner_text}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, promo_banner_text: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
                <label className="flex items-center gap-2 mt-2 text-xs text-[#2B1810] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsData.promo_banner_active}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, promo_banner_active: e.target.checked })
                    }
                    className="text-[#B45309] rounded"
                  />
                  <span>Show Announcement Banner on Website</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-colors"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: SUPABASE DATABASE CONFIGURATION & SQL EXPORT */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE1]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] uppercase tracking-wider mb-1">
                    <Database className="w-4 h-4" /> Supabase Integration Suite
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-[#2B1810]">
                    PostgreSQL Database & Storage Connection
                  </h1>
                </div>

                <button
                  onClick={copySchemaSql}
                  className="px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-semibold hover:bg-[#166534] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedSql ? 'Schema Copied!' : 'Copy Full SQL Schema'}
                </button>
              </div>

              {/* Status Callout */}
              <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E7DECD] text-xs text-[#5C4A3E] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2B1810]">Live Connection Status:</span>
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                      supabaseTestStatus?.includes('Connected') || getStoredSupabaseConfig()
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {supabaseTestStatus || (getStoredSupabaseConfig() ? 'Active Supabase Connection' : 'Browser Resilient Storage (Fallback Ready)')}
                  </span>
                </div>
                <p className="leading-relaxed">
                  All customer orders, product catalog modifications, and price changes are automatically synchronized. You can connect your direct Supabase project below or copy the SQL schema script.
                </p>
              </div>

              {/* Credentials Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-xs font-mono text-[#2B1810] focus:ring-2 focus:ring-[#15803D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-xs font-mono text-[#2B1810] focus:ring-2 focus:ring-[#15803D]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveSupabaseConfig}
                    className="px-5 py-2.5 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03] transition-colors"
                  >
                    Save & Test Connection
                  </button>
                  <button
                    onClick={() => {
                      setSupabaseUrl('');
                      setSupabaseAnonKey('');
                      saveStoredSupabaseConfig(null);
                      notify('Reset to default local persistence');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF5EE] text-[#5C4A3E] text-xs font-semibold hover:bg-[#EBE3D5] transition-colors"
                  >
                    Clear Credentials
                  </button>
                </div>
              </div>

              {/* Quick Setup Instructions */}
              <div className="pt-6 border-t border-[#F2ECE1] space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#2B1810]">
                  How to provision this database in Supabase:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-[#5C4A3E] leading-relaxed">
                  <li>
                    Open your Supabase project at{' '}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#15803D] underline inline-flex items-center gap-0.5"
                    >
                      supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Go to <strong>SQL Editor</strong> in the left sidebar.</li>
                  <li>Click <strong>"Copy Full SQL Schema"</strong> button above and paste into the SQL editor.</li>
                  <li>Click <strong>"Run"</strong> to execute. It creates all 7 relational tables, Row Level Security (RLS) rules, storage bucket, and seeds products!</li>
                  <li>Copy your Project URL and Anon Key from <strong>Project Settings → API</strong> into the fields above.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1] mb-5">
              <h2 className="font-serif text-xl font-bold text-[#2B1810]">
                {editingProduct ? 'Edit Product' : 'Add New Bakery Product'}
              </h2>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-xs text-[#8C6D58] hover:text-[#2B1810]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, name: e.target.value })
                  }
                  placeholder="e.g. Desi Ghee Gulab Jamun"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={productFormData.category_id}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, category_id: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-xs font-medium text-[#2B1810]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                    Price in PKR (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productFormData.price}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, price: e.target.value })
                    }
                    placeholder="1400"
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Unit Specification
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.unit}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, unit: e.target.value })
                  }
                  placeholder="per kg / per box / per 2 lbs"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={productFormData.description}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, description: e.target.value })
                  }
                  placeholder="Ingredients, taste profile, and preparation notes..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              {/* Image Input & File Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Product Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productFormData.image_url}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, image_url: e.target.value })
                    }
                    placeholder="Image URL or upload file below..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-xs text-[#2B1810]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#FAF5EE] border border-[#D5C7B5] text-xs font-semibold text-[#5C4A3E] hover:bg-[#EBE3D5] cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#2B1810] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.is_available}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, is_available: e.target.checked })
                    }
                    className="text-[#B45309] rounded"
                  />
                  <span>Available for Order</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#2B1810] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.is_featured}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, is_featured: e.target.checked })
                    }
                    className="text-[#B45309] rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5EE] text-[#5C4A3E] text-xs font-semibold hover:bg-[#EBE3D5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03]"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD / EDIT MODAL */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] max-w-lg w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1] mb-5">
              <h2 className="font-serif text-xl font-bold text-[#2B1810]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-xs text-[#8C6D58] hover:text-[#2B1810]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, name: e.target.value })
                  }
                  placeholder="e.g. Traditional Sweets"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  value={categoryFormData.slug}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                  }
                  placeholder="e.g. sweets"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={categoryFormData.description}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1810] uppercase mb-1">
                  Category Banner Image URL
                </label>
                <input
                  type="text"
                  value={categoryFormData.image_url}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, image_url: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C7B5] bg-white text-xs text-[#2B1810]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat_active"
                  checked={categoryFormData.is_active}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })
                  }
                  className="text-[#B45309] rounded"
                />
                <label
                  htmlFor="cat_active"
                  className="text-xs font-semibold text-[#2B1810] cursor-pointer"
                >
                  Active on Storefront
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5EE] text-[#5C4A3E] text-xs font-semibold hover:bg-[#EBE3D5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2B1810] text-[#FEF3C7] text-xs font-semibold hover:bg-[#451A03]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
