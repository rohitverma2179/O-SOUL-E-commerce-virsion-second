import React from 'react';

const ExchangePolicy = () => {
  return (
    <div className="container-osoul max-w-2xl py-14">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Policy</p>
      <h1 className="mt-2 font-serif text-4xl italic">Exchange support</h1>
      
      <p className="mt-6 text-sm text-foreground/80 leading-relaxed italic">
        If the size doesn't work, we support easy size exchanges as per policy. Reach out within 7 days of delivery with your order ID and the size you'd like instead.
      </p>
      
      <div className="mt-10 bg-secondary/10 p-8 rounded-2xl border border-border">
        <ul className="space-y-4 text-sm text-muted-foreground italic leading-relaxed">
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>Item must be unused, with original tags intact.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>One free size exchange per order.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>Reverse pickup arranged where serviceable by our partners.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>Exchange subject to stock availability of the requested size.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExchangePolicy;
