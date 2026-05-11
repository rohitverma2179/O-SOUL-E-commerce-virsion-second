import React, { useEffect } from 'react';

const SizeGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-4xl py-14 md:py-24">
        <header className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Size Guide</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight">Pick your size. <span className="italic text-olive">Not theirs.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground italic leading-relaxed">
            O'Soul is cut for Indian body proportions — not imported templates. If you've been sizing up your whole life, you might not have to here.
          </p>
        </header>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm mb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Size</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">What it feels like</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Choose this if...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                { s: "S", feel: "Close everyday fit", if: "You like clothes that sit close without being tight" },
                { s: "M", feel: "Regular comfortable fit", if: "Most people. Most days. This is the standard pick." },
                { s: "L", feel: "More relaxed, easy fit", if: "You like room to move and a looser drape" },
                { s: "XL", feel: "Roomy comfort fit", if: "Maximum ease. Or if your thighs are fuller and you want true comfort" },
                { s: "XXL", feel: "Maximum ease", if: "Wide, relaxed fit all through" }
              ].map((item) => (
                <tr key={item.s} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-5 font-serif text-xl italic text-foreground">{item.s}</td>
                  <td className="px-6 py-5 text-sm font-medium text-foreground/80 italic">{item.feel}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground italic">{item.if}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Decision Guide */}
        <div className="grid gap-12 md:grid-cols-2 mb-20">
          <div>
            <h3 className="font-serif text-2xl italic mb-6">Size Decision Guide</h3>
            <ul className="space-y-6 text-sm text-muted-foreground italic leading-relaxed">
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If you hate feeling clothes on your body <span className="text-foreground">→ size up one.</span></span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If you like clothes that know they're there but don't fight you <span className="text-foreground">→ your usual size.</span></span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If your thighs are wider than your waist would suggest <span className="text-foreground">→ try L before XL.</span> The thigh room is already built in.</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-2xl italic mb-6 invisible md:visible">_</h3>
            <ul className="space-y-6 text-sm text-muted-foreground italic leading-relaxed">
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If you're between sizes <span className="text-foreground">→ size up.</span> The fit is relaxed by design.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>For boxy tees <span className="text-foreground">→ your usual size</span> gives the intended boxy fall. Sizing up makes it oversized.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>For shorts <span className="text-foreground">→ if fuller thighs, size up.</span> The waist will still sit well.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer DM CTA */}
        <div className="rounded-2xl bg-foreground p-10 md:p-14 text-center text-background">
          <p className="font-serif text-2xl md:text-3xl italic leading-tight">
            Still not sure? DM us your height and waist. <br className="hidden md:block" />
            We'll tell you exactly which size to pick.
          </p>
          <div className="mt-8">
            <a 
              href="https://instagram.com/osoul.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-md bg-background px-10 text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-background/90 transition-all"
            >
              DM on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
