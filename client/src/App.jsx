import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import Combos from './pages/Combos';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import FitTests from './pages/FitTests';
import FindMyFit from './pages/FindMyFit';
import Gallery from './pages/Gallery';
import SizeGuide from './pages/SizeGuide';
import FAQ from './pages/FAQ';
import FounderNote from './pages/FounderNote';
import ExchangePolicy from './pages/ExchangePolicy';
import Support from './pages/Support';
import TrackOrder from './pages/TrackOrder';
import UserDashboard from './pages/UserDashboard';
import ScrollToTop from './components/common/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';
import UserManagement from './pages/Admin/UserManagement';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminSignup from './pages/Admin/AdminSignup';
import CatalogManagement from './pages/Admin/CatalogManagement';
import PopupManagement from './pages/Admin/PopupManagement';
import FooterManagement from './pages/Admin/FooterManagement';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* User Routes (Wrapped in Layout using Outlet) */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="men" element={<CategoryPage categoryName="men" />} />
            <Route path="women" element={<CategoryPage categoryName="women" />} />
            <Route path="unisex" element={<CategoryPage categoryName="unisex" />} />
            <Route path="combos" element={<Combos />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            
            {/* Static Information Pages */}
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="size-guide" element={<SizeGuide />} />
            <Route path="founder" element={<FounderNote />} />
            <Route path="fit-tests" element={<FitTests />} />
            <Route path="find-my-fit" element={<FindMyFit />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="exchange" element={<ExchangePolicy />} />
            <Route path="support" element={<Support />} />
            <Route path="track" element={<TrackOrder />} />

            {/* Auth & Checkout */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="account" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          </Route>

          {/* Admin Panel Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<Navigate to="/admin/catalog" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="catalog" element={<CatalogManagement />} />
            <Route path="popup" element={<PopupManagement />} />
            <Route path="footer" element={<FooterManagement />} />
          </Route>

          {/* Redirect for catch-all or default admin path */}
          <Route path="/admin/*" element={<Navigate to="/admin/catalog" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
