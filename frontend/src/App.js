import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from './components/Toaster';

import Landing from './pages/Landing';
import Architecture from './pages/Architecture';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

import CustomerLayout from './layouts/CustomerLayout';
import CustomerHome from './pages/customer/Home';
import NearbyStores from './pages/customer/NearbyStores';
import StoreDetails from './pages/customer/StoreDetails';
import ProductDetails from './pages/customer/ProductDetails';
import CustomerSearch from './pages/customer/Search';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import Orders from './pages/customer/Orders';
import OrderTracking from './pages/customer/OrderTracking';
import Profile from './pages/customer/Profile';
import Wishlist from './pages/customer/Wishlist';

import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorOrders from './pages/vendor/Orders';
import Inventory from './pages/vendor/Inventory';
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';
import VendorAnalytics from './pages/vendor/Analytics';
import Sentinel from './pages/vendor/Sentinel';
import StoreProfile from './pages/vendor/StoreProfile';
import VendorSettings from './pages/vendor/Settings';

import AdminLayout from './layouts/AdminLayout';
import Executive from './pages/admin/Executive';
import LiveStream from './pages/admin/LiveStream';
import DemandMap from './pages/admin/DemandMap';
import VendorManagement from './pages/admin/VendorManagement';
import VendorApproval from './pages/admin/VendorApproval';
import InventoryHealth from './pages/admin/InventoryHealth';
import PlatformAnalytics from './pages/admin/PlatformAnalytics';
import Simulator from './pages/admin/Simulator';
import AdminSettings from './pages/admin/Settings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function RequireRole({ role, children }) {
  const { state } = useApp();
  // Wait for Supabase / localStorage auth to initialize before deciding redirects.
  // Without this guard, users with valid sessions see a flash to /auth on reload.
  if (!state.authReady) return null;
  if (!state.session) return <Navigate to={`/auth?role=${role}`} replace />;
  if (state.session.role !== role) return <Navigate to={`/${state.session.role}`} replace />;
  return children;
}

function ThemeBoot() {
  const { state } = useApp();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <ThemeBoot />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/customer" element={<RequireRole role="customer"><CustomerLayout /></RequireRole>}>
            <Route index element={<CustomerHome />} />
            <Route path="nearby" element={<NearbyStores />} />
            <Route path="store/:storeId" element={<StoreDetails />} />
            <Route path="product/:productId" element={<ProductDetails />} />
            <Route path="search" element={<CustomerSearch />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/success/:orderId" element={<OrderSuccess />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order/:orderId" element={<OrderTracking />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>

          <Route path="/vendor" element={<RequireRole role="vendor"><VendorLayout /></RequireRole>}>
            <Route index element={<VendorDashboard />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/add" element={<AddProduct />} />
            <Route path="inventory/edit/:productId" element={<EditProduct />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="sentinel" element={<Sentinel />} />
            <Route path="store" element={<StoreProfile />} />
            <Route path="settings" element={<VendorSettings />} />
          </Route>

          <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
            <Route index element={<Executive />} />
            <Route path="stream" element={<LiveStream />} />
            <Route path="demand" element={<DemandMap />} />
            <Route path="vendors" element={<VendorManagement />} />
            <Route path="approvals" element={<VendorApproval />} />
            <Route path="inventory-health" element={<InventoryHealth />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="simulator" element={<Simulator />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AppProvider>
  );
}
