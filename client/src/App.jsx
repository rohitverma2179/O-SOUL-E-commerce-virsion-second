import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import Combos from './pages/Combos';
import ProductDetails from './pages/ProductDetails';
import InformationPage from './pages/InformationPage';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import FitTests from './pages/FitTests';
import SizeGuide from './pages/SizeGuide';
import FAQ from './pages/FAQ';
import FounderNote from './pages/FounderNote';
import ExchangePolicy from './pages/ExchangePolicy';
import Support from './pages/Support';
import TrackOrder from './pages/TrackOrder';
import { CartProvider } from './context/CartContext';



function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/men" element={<CategoryPage categoryName="men" />} />
          <Route path="/women" element={<CategoryPage categoryName="women" />} />
          <Route path="/unisex" element={<CategoryPage categoryName="unisex" />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          
          {/* Static Information Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/founder" element={<FounderNote />} />
          <Route path="/fit-tests" element={<FitTests />} />
          <Route path="/exchange" element={<ExchangePolicy />} />
          <Route path="/support" element={<Support />} />
          <Route path="/track" element={<TrackOrder />} />

          {/* Auth & Checkout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
}

export default App;
