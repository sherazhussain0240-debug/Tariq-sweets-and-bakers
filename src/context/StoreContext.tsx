import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  AdminProfile,
} from '../types/database';
import {
  getStoreSettings,
  getAdminSession,
  adminLogout as doAdminLogout,
} from '../lib/databaseService';
import { INITIAL_STORE_SETTINGS } from '../data/initialData';

export type AppView =
  | 'home'
  | 'shop'
  | 'checkout'
  | 'order-confirmed'
  | 'track-order'
  | 'admin-login'
  | 'admin-dashboard';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  view: AppView;
  setView: (view: AppView) => void;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Financials
  subtotal: number;
  deliveryFee: number;
  total: number;
  cartCount: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;

  // Active confirmed order
  confirmedOrder: Order | null;
  setConfirmedOrder: (order: Order | null) => void;

  // Admin
  adminUser: AdminProfile | null;
  setAdminUser: (admin: AdminProfile | null) => void;
  logoutAdmin: () => void;

  // Settings
  settings: StoreSettings;
  refreshSettings: () => Promise<void>;

  // Toasts
  notifications: ToastNotification[];
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissNotification: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const CART_STORAGE_KEY = 'tsb_shopping_cart';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(() => getAdminSession());
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Load cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [cart]);

  // Load store settings
  const refreshSettings = async () => {
    try {
      const s = await getStoreSettings();
      setSettings(s);
    } catch (e) {
      console.warn('Failed to load store settings:', e);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    notify(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const logoutAdmin = () => {
    doAdminLogout();
    setAdminUser(null);
    setView('home');
    notify('Logged out from Admin Dashboard', 'info');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = settings.free_delivery_threshold || 2500;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold && subtotal > 0;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : settings.delivery_charge || 180;
  const total = subtotal + deliveryFee;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <StoreContext.Provider
      value={{
        view,
        setView,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        deliveryFee,
        total,
        cartCount,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        confirmedOrder,
        setConfirmedOrder,
        adminUser,
        setAdminUser,
        logoutAdmin,
        settings,
        refreshSettings,
        notifications,
        notify,
        dismissNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
