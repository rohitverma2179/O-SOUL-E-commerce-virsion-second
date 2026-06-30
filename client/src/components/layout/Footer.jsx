import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../lib/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    tagline: 'No More Adjusting.',
    quote: 'If it makes you adjust, it failed.',
    instagramUrl: 'https://instagram.com/osoul.in',
    copyrightText: '© 2026 O\'Soul. All rights reserved.',
    copyrightSubtext: 'Everyday comfort that still looks clean.',
    trustLabel1: 'Secure Razorpay checkout',
    trustLabel2: 'Easy exchange support'
  });

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/footer`);
        const data = await response.json();
        if (data.success && data.data) {
          setSettings({
            tagline: data.data.tagline || 'No More Adjusting.',
            quote: data.data.quote || 'If it makes you adjust, it failed.',
            instagramUrl: data.data.instagramUrl || 'https://instagram.com/osoul.in',
            copyrightText: data.data.copyrightText || '© 2026 O\'Soul. All rights reserved.',
            copyrightSubtext: data.data.copyrightSubtext || 'Everyday comfort that still looks clean.',
            trustLabel1: data.data.trustLabel1 || 'Secure Razorpay checkout',
            trustLabel2: data.data.trustLabel2 || 'Easy exchange support'
          });
        }
      } catch (error) {
        console.log("Using default footer layout fallbacks");
      }
    };
    fetchFooterSettings();
  }, []);

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-osoul py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand Info */}
          <div className="md:col-span-4">
            <Link to="/" className="font-serif text-2xl tracking-tighter uppercase font-bold text-foreground">O'Soul</Link>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">{settings.tagline}</p>
            <p className="mt-8 font-serif text-3xl md:text-4xl italic text-foreground leading-tight">
              {settings.quote}
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-foreground mb-6">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground italic">
                <li><Link to="/products/mens-boxy-tee-with-pocket" className="hover:text-olive transition-colors">Men's Boxy Tee</Link></li>
                <li><Link to="/men" className="hover:text-olive transition-colors">Men</Link></li>
                <li><Link to="/women" className="hover:text-olive transition-colors">Women</Link></li>
                <li><Link to="/gallery" className="hover:text-olive transition-colors">Gallery</Link></li>
                <li><Link to="/products/unisex-boxy-tee" className="hover:text-olive transition-colors">Unisex Boxy Tee</Link></li>
                <li><Link to="/combos" className="hover:text-olive transition-colors font-medium text-foreground/80">Combos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-foreground mb-6">Help</h4>
              <ul className="space-y-3 text-sm text-muted-foreground italic">
                <li><Link to="/size-guide" className="hover:text-olive transition-colors">Size Guide</Link></li>
                <li><Link to="/faq" className="hover:text-olive transition-colors">FAQ</Link></li>
                <li><Link to="/exchange" className="hover:text-olive transition-colors">Exchange Support</Link></li>
                <li><Link to="/support" className="hover:text-olive transition-colors">Customer Support</Link></li>
                <li><Link to="/track" className="hover:text-olive transition-colors">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-foreground mb-6">Brand</h4>
              <ul className="space-y-3 text-sm text-muted-foreground italic">
                <li><Link to="/about" className="hover:text-olive transition-colors">About O'Soul</Link></li>
                <li><Link to="/founder" className="hover:text-olive transition-colors">Founder Note</Link></li>
                <li><Link to="/fit-tests" className="hover:text-olive transition-colors">Fit Tests</Link></li>
                <li><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-olive transition-colors font-medium text-foreground/80">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-10 md:flex-row">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            {settings.copyrightText} <span className="mx-2 opacity-30">|</span> {settings.copyrightSubtext}
          </div>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            <span>{settings.trustLabel1}</span>
            <span>{settings.trustLabel2}</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Padding */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </footer>
  );
};

export default Footer;
