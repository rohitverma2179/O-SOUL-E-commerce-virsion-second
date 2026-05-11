import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw, ArrowRight } from 'lucide-react';

const ExchangePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-2xl py-14 md:py-24">
        <header className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Exchanges</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl italic tracking-tight">Exchange support, without the friction.</h1>
          <p className="mt-6 text-lg text-muted-foreground italic leading-relaxed">
            If the fit isn't right, let's fix it. That's the point of the exchange — not to make returning things difficult, but to make sure you end up with something that works.
          </p>
        </header>
        
        <div className="mt-10 bg-secondary/10 p-10 rounded-2xl border border-border">
          <h3 className="font-serif text-xl italic mb-8">What to do next:</h3>
          <ul className="space-y-6 text-base text-foreground/80 italic leading-relaxed">
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive">01</span>
              <span>Keep your order ID ready.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive">02</span>
              <span>Tell us the product and size you received.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive">03</span>
              <span>Tell us what felt off — too tight, too loose, waistband issue, anything.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive">04</span>
              <span>We'll guide you through the next step from there.</span>
            </li>
          </ul>

          <div className="mt-12">
            <Link 
              to="/support" 
              className="inline-flex h-12 items-center gap-3 rounded-md bg-foreground px-10 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-lg shadow-charcoal/10"
            >
              Contact Customer Support <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangePolicy;
