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
          <p>
            some days, the reason you don’t feel like yourself has nothing to do with your mood.
          </p>

          <p className="text-xl text-foreground not-italic font-normal">
            it’s what you’re wearing.
          </p>

          <p>
            the fit feels off.<br />
            you keep adjusting it without thinking.<br />
            and little by little, something as simple as bottoms starts deciding how present you feel in your own day.
          </p>

          <p>
            i felt that more often than i should have.
          </p>

          <p>
            and i kept wondering why something we wear for hours is treated like it doesn’t matter enough to get right.
          </p>

          <p className="text-xl text-foreground not-italic font-normal">
            that’s where o’soul began.
          </p>

          <p>
            with one simple thought <br />
            the clothes closest to you should never make you feel like you have to adjust yourself to fit into them.
          </p>

          <p>
            not to make more clothes.<br />
            but to make bottoms that respect your body, your movement, and the way real days actually feel.
          </p>

          <p className="font-serif text-2xl text-foreground italic leading-tight mt-12 mb-12">
            they should respect you as you are.
          </p>

          <div className="pt-12 border-t border-border mt-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">— manan</p>
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
