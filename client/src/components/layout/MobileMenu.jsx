import React from 'react';
import { X, ChevronRight, User, Package, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstagramIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-background p-6 shadow-2xl transition-transform">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={onClose} className="font-serif text-2xl tracking-tight">O'Soul</Link>
          <button
            onClick={onClose}
            className="p-2 hover:text-foreground/80 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-10 space-y-6">
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Shop by Category</div>
            <div className="grid gap-2">
              <Link
                to="/shop"
                onClick={onClose}
                className="flex items-center justify-between rounded-lg bg-secondary/40 px-4 py-4 text-base font-medium"
              >
                All Products <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                to="/find-my-fit"
                onClick={onClose}
                className="flex items-center justify-between rounded-lg bg-olive/10 border border-olive/20 px-4 py-4 text-base font-semibold text-olive"
              >
                Find My Fit <ChevronRight className="h-4 w-4 text-olive" />
              </Link>
              <a
                href="/#reviews"
                onClick={onClose}
                className="flex items-center justify-between rounded-lg bg-secondary/40 px-4 py-4 text-base font-medium"
              >
                Customer Reviews <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/men" onClick={onClose} className="rounded-lg border border-border px-4 py-3 text-sm font-medium">Men</Link>
                <Link to="/women" onClick={onClose} className="rounded-lg border border-border px-4 py-3 text-sm font-medium">Women</Link>
                <Link to="/unisex" onClick={onClose} className="rounded-lg border border-border px-4 py-3 text-sm font-medium">Unisex</Link>
                <Link to="/combos" onClick={onClose} className="rounded-lg border border-border px-4 py-3 text-sm font-medium">Combos</Link>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Essentials</div>
            <div className="space-y-3">
              <Link to="/login" onClick={onClose} className="flex items-center gap-3 text-sm font-medium">
                <User className="h-4 w-4" /> My Account
              </Link>
              <Link to="/track" onClick={onClose} className="flex items-center gap-3 text-sm font-medium">
                <Package className="h-4 w-4" /> Track Order
              </Link>
              <Link to="/support" onClick={onClose} className="flex items-center gap-3 text-sm font-medium">
                <HelpCircle className="h-4 w-4" /> Help & Support
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm font-medium text-muted-foreground"
            >
              <InstagramIcon className="h-4 w-4" /> Follow us on Instagram
            </a>
          </div>
        </nav>


        <div className="absolute bottom-10 left-6 right-6">
          <p className="text-[11px] text-muted-foreground ">"If it makes you adjust, it failed."</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
