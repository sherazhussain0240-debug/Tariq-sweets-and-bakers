import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { PromoBanner } from './components/PromoBanner';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmedPage } from './pages/OrderConfirmedPage';
import { OrderLookupPage } from './pages/OrderLookupPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { view, adminUser } = useStore();

  const renderActiveView = () => {
    switch (view) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmed':
        return <OrderConfirmedPage />;
      case 'track-order':
        return <OrderLookupPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin-dashboard':
        return adminUser ? <AdminDashboard /> : <AdminLoginPage />;
      default:
        return <HomePage />;
    }
  };

  const isAdminView = view === 'admin-dashboard' && adminUser;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#2B1810]">
      {!isAdminView && (
        <>
          <PromoBanner />
          <Navbar />
        </>
      )}

      <main className="flex-1">
        {renderActiveView()}
      </main>

      {!isAdminView && <Footer />}

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
