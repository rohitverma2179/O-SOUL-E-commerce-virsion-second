import React from 'react';
import { Link } from 'react-router-dom';

const FitTests = () => {
  const tests = [
    { id: "01", label: "Sit test", tile: "tile-charcoal" },
    { id: "02", label: "Walk test", tile: "tile-charcoal" },
    { id: "03", label: "Waistband test", tile: "tile-charcoal" },
    { id: "04", label: "Pocket test", tile: "tile-charcoal" },
    { id: "05", label: "Drape test", tile: "tile-charcoal" },
    { id: "06", label: "Repeat test", tile: "tile-charcoal" },
  ];

  return (
    <div className="container-osoul py-14">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Fit tests</p>
        <h1 className="mt-2 font-serif text-4xl italic">Comfort should show when you move.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground italic leading-relaxed">
          Sitting, walking, pockets, waistbands, and daily wear. Real movement, not styled stills.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
        {tests.map((test) => (
          <div key={test.id} className={`relative aspect-[4/5] overflow-hidden rounded-md ${test.tile} group cursor-pointer`}>
            <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:opacity-0" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
              <span className="text-[10px] uppercase tracking-wider opacity-60 font-medium">{test.id}</span>
              <div className="mt-1 font-serif text-xl italic">{test.label}</div>
            </div>
            {/* Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/shop" className="inline-flex h-12 items-center rounded-md bg-foreground px-10 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all">
          Shop The First Drop
        </Link>
      </div>
    </div>
  );
};

export default FitTests;
