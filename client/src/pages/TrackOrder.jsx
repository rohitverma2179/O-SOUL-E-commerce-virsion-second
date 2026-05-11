import React, { useEffect } from 'react';
import { Search } from 'lucide-react';

const TrackOrder = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-2xl py-14 md:py-24">
        <header className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Orders</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl italic tracking-tight">Track your order.</h1>
          <p className="mt-6 text-lg text-muted-foreground italic leading-relaxed">
            Enter your order details to see where your O'Soul piece is right now.
          </p>
        </header>
        
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Order ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. #12345" 
                  className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm focus:border-olive focus:outline-none transition-colors italic"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email or Phone</label>
                <input 
                  type="text" 
                  placeholder="The one used at checkout" 
                  className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm focus:border-olive focus:outline-none transition-colors italic"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full h-14 rounded-md bg-foreground text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-charcoal/10"
            >
              <Search className="h-4 w-4" />
              Track →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
