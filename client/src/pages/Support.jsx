import React from 'react';

const Support = () => {
  return (
    <div className="container-osoul max-w-2xl py-14">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Contact</p>
      <h1 className="font-serif text-4xl italic">Customer support</h1>
      
      <p className="mt-6 text-sm text-foreground/80 leading-relaxed italic">
        We respond to most queries within one business day. Email is the fastest way to reach us with your order ID.
      </p>
      
      <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">Email us at</div>
        <a 
          href="mailto:hello@osoul.in" 
          className="text-2xl font-serif text-foreground hover:text-olive transition-colors underline underline-offset-4"
        >
          hello@osoul.in
        </a>
        <p className="mt-6 text-xs text-muted-foreground italic">
          Available Monday to Saturday · 10 AM to 6 PM IST
        </p>
      </div>

      <div className="mt-12 bg-secondary/10 p-8 rounded-2xl border border-border">
        <h3 className="font-serif text-xl mb-4 italic">Before you email</h3>
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          Please check our <a href="/faq" className="underline">FAQ</a> and <a href="/size-guide" className="underline">Size Guide</a> first. Many common questions about sizing, delivery times, and exchanges are answered there.
        </p>
      </div>
    </div>
  );
};

export default Support;
