import React, { useEffect, useState } from 'react';
import ComboCard from '../components/product/ComboCard';
import { fetchCatalog } from '../lib/api';

const Combos = () => {
  const [uploadedCombos, setUploadedCombos] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCatalog('combos').then(setUploadedCombos).catch(() => setUploadedCombos([]));
  }, []);

  const combos = uploadedCombos;

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
          {combos.map(combo => (
            <ComboCard key={combo._id || combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Combos;
