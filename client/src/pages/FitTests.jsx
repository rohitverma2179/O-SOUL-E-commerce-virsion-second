import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PlayCircle } from 'lucide-react';

const FitTests = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tests = [
    {
      num: "01",
      title: "The Chair Test",
      action: "Sit down. Cross your legs. Lean forward. Stay seated for twenty minutes.",
      check: "crotch pull, waistband fold, fabric tension at the thigh, comfort after extended sitting. This is the test that most pants fail. It's the first one we run.",
      quote: "If it pulls when you sit, it failed.",
      tile: "tile-charcoal"
    },
    {
      num: "02",
      title: "The Walk Test",
      action: "Fast walk. Stairs. Uneven ground. Without stopping to adjust.",
      check: "does the fabric move with the body or resist it? Does the waistband stay in place? Do the seams pull? Does the silhouette change when you pick up speed?",
      tile: "tile-olive"
    },
    {
      num: "03",
      title: "The Pocket Test",
      action: "Phone in pocket. Keys in pocket. Walk, sit, stand.",
      check: "pocket bulge, fabric pull from weight, silhouette distortion. A pocket that makes the shorts look like a storage unit is a failed pocket.",
      tile: "tile-sand"
    },
    {
      num: "04",
      title: "The Waistband Recovery Test",
      action: "10 full wears. 5 machine washes. Then — does the waistband sit where it started?",
      check: "elastic recovery, post-wash stability, roll resistance. Most waistbands start failing by week two. The O'Soul standard requires them to still perform after 10 wears and 5 washes.",
      tile: "tile-clay"
    },
    {
      num: "05",
      title: "The Fabric Test",
      action: "Stretch. Release. Repeat. In heat. Then wash. Then wear again.",
      check: "cling resistance, breathability, drape after stretch, post-wash shape retention. The fabric either keeps performing or it doesn't go into production.",
      tile: "tile-charcoal"
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-4xl py-14 md:py-24">
        <header className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">The O'Soul Movement Index</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight leading-tight">If it can't pass this, <br /><span className="italic text-olive font-normal">it doesn't ship.</span></h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground italic leading-relaxed">
            Standing fit is easy. Every pair of pants looks fine when you're still. O'Soul is tested for what happens after that.
          </p>
        </header>

        <div className="mb-20 border-l-2 border-olive/20 pl-8 md:pl-12">
          <p className="max-w-2xl text-lg text-foreground/80 leading-relaxed italic">
            Before any O'Soul piece is approved for production, it goes through five real-life movement tests. Not on a mannequin. Not in a studio. On a person, doing the actual things people do in their day.
          </p>
        </div>

        <div className="space-y-10">
          {tests.map((test) => (
            <div key={test.num} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-olive/20">
              <div className="grid md:grid-cols-12">
                <div className={`md:col-span-4 aspect-square ${test.tile} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-ivory/50" />
                  </div>
                  <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                </div>
                <div className="md:col-span-8 p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-olive/60 font-bold">Test {test.num}</span>
                    <span className="h-px w-8 bg-olive/20"></span>
                  </div>
                  <h3 className="font-serif text-3xl italic text-foreground mb-6">{test.title}</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">The Action</p>
                      <p className="text-base text-foreground italic leading-relaxed">{test.action}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">What we're checking</p>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">{test.check}</p>
                    </div>
                    {test.quote && (
                      <div className="pt-4 border-t border-border/40">
                        <p className="text-sm font-serif italic text-olive">"{test.quote}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 space-y-8 border-t border-border pt-16">
          <p className="max-w-3xl text-lg text-foreground/80 leading-relaxed italic">
            Every piece in the first drop passed all five tests. Not easily — the jogger sample failed the chair test in the first round and went back for a rise adjustment. The shorts went through three pocket iterations before they stopped bulging.
          </p>
          <p className="font-serif text-2xl md:text-3xl italic text-olive leading-tight">
            Small batch. Because this is the process. <br className="hidden md:block" />
            And the process takes time.
          </p>
          <div className="pt-8">
            <Link to="/shop" className="inline-flex h-14 items-center rounded-md bg-foreground px-12 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-xl shadow-charcoal/10">
              Shop The First Drop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitTests;
