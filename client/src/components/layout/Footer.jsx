import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-osoul py-12">
        <p className="font-serif text-2xl">If it makes you adjust, it failed.</p>
        
        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="font-serif text-sm">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products/mens-boxy-tee" className="hover:text-foreground transition-colors">Men's Boxy Tee</Link></li>
              <li><Link to="/products/mens-joggers" className="hover:text-foreground transition-colors">Men's Joggers</Link></li>
              <li><Link to="/products/mens-shorts" className="hover:text-foreground transition-colors">Men's Shorts</Link></li>
              <li><Link to="/products/unisex-boxy-tee" className="hover:text-foreground transition-colors">Unisex Boxy Tee</Link></li>
              <li><Link to="/combos" className="hover:text-foreground transition-colors">Combos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm">Help</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/size-guide" className="hover:text-foreground transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/exchange" className="hover:text-foreground transition-colors">Exchange Support</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors">Customer Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm">Brand</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/founder" className="hover:text-foreground transition-colors">Founder Note</Link></li>
              <li><Link to="/fit-tests" className="hover:text-foreground transition-colors">Fit Tests</Link></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm">O'Soul</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              No More Adjusting. Everyday comfort that still looks clean.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 O'Soul. All rights reserved.</span>
          <span>Secure Razorpay checkout · Easy exchange support</span>
        </div>
      </div>
      
      <div className="h-16 md:hidden" aria-hidden="true" />
    </footer>
  );
};

export default Footer;
