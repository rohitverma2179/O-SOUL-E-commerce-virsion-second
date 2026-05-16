import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import CartDrawer from './CartDrawer';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, LayoutGrid, Home } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  const { setIsCartOpen, cartCount } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      
      <CartDrawer />
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-3">
          <Link to="/" className="flex flex-col items-center py-3 text-[10px] uppercase tracking-wider hover:bg-secondary/50 transition-colors">
            <Home className="h-4 w-4 mb-1" />
            Home
          </Link>
          <Link to="/shop" className="flex flex-col items-center py-3 text-[10px] uppercase tracking-wider hover:bg-secondary/50 transition-colors">
            <LayoutGrid className="h-4 w-4 mb-1" />
            Shop
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center py-3 text-[10px] uppercase tracking-wider hover:bg-secondary/50 transition-colors relative"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4 mb-1" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-olive text-[8px] text-ivory">
                  {cartCount}
                </span>
              )}
            </div>
            Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
