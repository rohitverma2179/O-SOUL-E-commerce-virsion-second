import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const FounderNote = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-2xl py-14 md:py-24">
        <header className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Founder's Note</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight italic">Why O'Soul exists.</h1>
        </header>
        
        <div className="mt-10 space-y-8 text-lg text-foreground/80 leading-relaxed italic font-light">
          <p className="font-serif text-3xl md:text-4xl text-foreground italic leading-tight mb-12">
            "I used to think the problem was my body."
          </p>

          <p>
            Every pair of jeans that dug in when I sat. Every jogger that pulled across the thigh when I walked fast. Every waistband that rolled by hour three. I kept buying new ones hoping this time it would be different. It never was. And because it never was, I quietly assumed I was the wrong shape.
          </p>

          <p>
            Then someone pointed out what I couldn't see: <span className="text-foreground font-normal">the pattern was wrong.</span> The pants weren't built for the way Indian bodies actually are — the waist-to-hip ratio, the thigh circumference, the fact that we sit cross-legged and commute in heat and go from a café to a client to dinner in the same pair of trousers.
          </p>

          <p>
            Once I understood that, I couldn't stop seeing it. Every adjustment I made throughout the day was a small failure I'd accepted as normal. Pulling the waistband before sitting. Shifting after standing. Avoiding certain movements to avoid certain embarrassments.
          </p>

          <p>
            O'Soul is my answer to that. Not a perfect answer — a first drop of six products, tested as carefully as I know how, built around the idea that <span className="text-foreground font-normal">fit is a design problem, not a body problem.</span>
          </p>

          <p>
            If you buy something and it doesn't work — tell me. That feedback is how this gets better.
          </p>

          <p className="font-serif text-2xl text-foreground border-l-2 border-olive/30 pl-8 py-4 my-12">
            "But if it works? If you put it on, move through your day, and realise at the end of it that you never once thought about your clothes — that's the whole thing."
          </p>

          <p>
            That's what I'm building toward.
          </p>

          <div className="pt-12 border-t border-border mt-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">— Manan Sadhwani</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Founder, O'Soul</p>
          </div>
        </div>

        <div className="mt-20">
          <Link to="/shop" className="inline-flex h-12 items-center rounded-md bg-foreground px-10 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-lg shadow-charcoal/10">
            Shop The First Drop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FounderNote;
