import React from 'react';
import ComboCard from '../components/product/ComboCard';

const combos = [
  {
    id: 1,
    title: "Men's Everyday Combo",
    description: "The easiest daily outfit: soft tee, clean joggers, no overthinking.",
    originalPrice: "1,698",
    discountedPrice: "1,599",
    savings: "99",
    tiles: ["tile-charcoal", "tile-olive"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" }
    ]
  },
  {
    id: 2,
    title: "Men's Summer Combo",
    description: "For warm days when you want to feel light, comfortable, and still put-together.",
    originalPrice: "1,394",
    discountedPrice: "1,299",
    savings: "95",
    tiles: ["tile-charcoal", "tile-charcoal"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Shorts", slug: "mens-shorts", price: "695" }
    ]
  },
  {
    id: 3,
    title: "Men's Full Rotation Combo",
    description: "One tee, one jogger, one short. Your basic comfort rotation is sorted.",
    originalPrice: "2,393",
    discountedPrice: "2,199",
    savings: "194",
    tiles: ["tile-charcoal", "tile-olive", "tile-charcoal"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" },
      { name: "Men's Shorts", slug: "mens-shorts", price: "695" }
    ]
  },
  {
    id: 4,
    title: "Women's Soft Movement Combo",
    description: "Soft on top, free-flowing below. Easy comfort for slow days, travel, and everyday movement.",
    originalPrice: "1,798",
    discountedPrice: "1,699",
    savings: "99",
    tiles: ["tile-clay", "tile-olive"],
    items: [
      { name: "Women's Cropped Hoodie", slug: "womens-cropped-hoodie", price: "799" },
      { name: "Women's Harem Pants", slug: "womens-harem-pants", price: "999" }
    ]
  }
];

const Combos = () => {
  return (
    <div className="container-osoul py-10 md:py-14">
      <header className="mb-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Combos</p>
        <h1 className="mt-2 font-serif text-4xl">Build a comfort fit in one click.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Combos for the days you don't want to think too much about what to wear.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {combos.map(combo => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>
    </div>
  );
};

export default Combos;
