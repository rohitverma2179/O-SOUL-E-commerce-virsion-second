import React, { useState } from 'react';
import { Menu, ShoppingBag, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import SearchModal from './SearchModal';
import MobileMenu from './MobileMenu';
import logo from "../../assets/logo.png"

const Navbar = () => {
  const { setIsCartOpen, cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="container-osoul flex h-16 items-center justify-between">
          {/* Left: Mobile Menu & Desktop Nav */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMenuOpen(true)}
              type="button" 
              className="md:hidden -ml-2 p-2 hover:text-foreground/80 transition-colors" 
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-7 md:flex">
              <Link to="/shop" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Shop</Link>
              <Link to="/about" className="text-sm text-foreground/80 hover:text-foreground transition-colors">About</Link>
              {/* <Link to="/men" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Men</Link>
              <Link to="/women" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Women</Link> */}
              <Link to="/combos" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Combos</Link>
              <Link to="/find-my-fit" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Find My Fit</Link>
              <Link to="/fit-tests" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Fit Tests</Link>
              <a href="/#reviews" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Reviews</a>
            </nav>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-tight">
            <img src={logo} alt="osoul" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-foreground/80 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <Link to="/login" className="hidden md:block p-2 hover:text-foreground/80 transition-colors" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              type="button" 
              className="relative p-2 hover:text-foreground/80 transition-colors" 
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-olive text-[9px] text-ivory font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navbar;
