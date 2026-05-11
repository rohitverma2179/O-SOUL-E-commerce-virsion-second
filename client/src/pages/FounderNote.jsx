import React from 'react';
import { Link } from 'react-router-dom';

const FounderNote = () => {
  return (
    <div className="container-osoul max-w-2xl py-16">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Founder note</p>
      <h1 className="mt-2 font-serif text-4xl italic">Why O'Soul exists.</h1>
      
      <div className="mt-8 space-y-6 text-base text-foreground/85 leading-relaxed italic">
        <p>Most people don't need more clothes. They need clothes that don't keep bothering them.</p>
        <p>O'Soul exists for that feeling: wearing something soft, clean, and easy enough that you stop thinking about it.</p>
        
        <p className="font-serif text-2xl text-foreground mt-8">
          "No more fixing. No more fuss. Just clothes that let you move through your day."
        </p>
        
        <p className="text-sm text-muted-foreground not-italic mt-10">
          — Manan Sadhwani, Founder, O'Soul
        </p>
      </div>

      <div className="mt-12">
        <Link to="/shop" className="inline-flex h-12 items-center rounded-md bg-foreground px-10 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all">
          Shop The First Drop
        </Link>
      </div>
    </div>
  );
};

export default FounderNote;
