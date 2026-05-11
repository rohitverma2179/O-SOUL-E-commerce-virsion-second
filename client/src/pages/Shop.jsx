import React from 'react';
import ProductCard from '../components/product/ProductCard';

import { allProducts } from '../data/productData';
const products = allProducts;

const Shop = () => {
  return (
    <div className="container-osoul py-10 md:py-14">
      <header className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">The First Drop</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl italic tracking-tight">Everything you actually need.</h1>
      </header>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar Filters */}
        <aside className="space-y-6 md:sticky md:top-24 md:self-start">
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Price</h4>
            <div className="text-xs text-muted-foreground">₹690 — ₹1000</div>
            <input type="range" min="690" max="1000" step="10" className="mt-2 w-full accent-charcoal" defaultValue="1000" />
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Color</h4>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Black</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Olive</button>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">S</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">M</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">L</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">XL</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">XXL</button>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Category</h4>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Men</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Women</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Unisex</button>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Type</h4>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Tees</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Joggers</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Shorts</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Hoodies</button>
              <button type="button" className="rounded-full border px-3 py-1 text-xs transition border-border hover:border-foreground/50">Harem Pants</button>
            </div>
          </div>
        </aside>

        {/* Product Grid Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{products.length} products</span>
            <select className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shop;
