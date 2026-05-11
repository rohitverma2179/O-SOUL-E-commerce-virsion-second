import React, { useEffect } from 'react';
import ComboCard from '../components/product/ComboCard';
import { allCombos } from '../data/comboData';

const Combos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background">
      <div className="container-osoul py-12 md:py-20">
        <header className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Combos</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">Build your comfort fit in one click.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground italic">
            Less thinking. One outfit sorted. A little saved.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {allCombos.map(combo => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Combos;
