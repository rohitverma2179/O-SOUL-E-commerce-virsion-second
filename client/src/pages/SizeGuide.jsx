import React from 'react';

const SizeGuide = () => {
  return (
    <div className="container-osoul max-w-2xl py-14">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Sizing</p>
        <h1 className="mt-2 font-serif text-4xl italic">Pick your usual size. Keep it simple.</h1>
        <p className="mt-4 text-sm text-muted-foreground italic leading-relaxed">
          O'Soul is made for relaxed everyday comfort. If you're between sizes, choose based on how much room you like.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        {[
          { size: "S", desc: "Closer everyday fit." },
          { size: "M", desc: "Most common regular fit." },
          { size: "L", desc: "More relaxed fit." },
          { size: "XL", desc: "Roomier comfort." },
          { size: "XXL", desc: "Maximum ease." }
        ].map((item) => (
          <div key={item.size} className="flex justify-between border-b border-border pb-3 text-sm italic">
            <span className="font-semibold text-foreground">{item.size}</span>
            <span className="text-muted-foreground">{item.desc}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-secondary/10 p-8 rounded-2xl border border-border">
        <h3 className="font-serif text-xl mb-6 italic">Quick Tips</h3>
        <ul className="space-y-4 text-sm text-muted-foreground italic leading-relaxed">
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>If you hate tightness, size up.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>If you like a sharper fit, size down.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>For boxy tees, usual size gives boxy fall.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>For harem pants, usual size gives relaxed drape.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>For shorts, choose the larger size if your thighs are fuller.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SizeGuide;
