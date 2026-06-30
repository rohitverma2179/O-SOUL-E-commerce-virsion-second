import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import { fetchCatalog } from '../lib/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [maxPrice, setMaxPrice] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    fetchCatalog('products')
      .then(setProducts)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map((product) => Number(product.price));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  useEffect(() => {
    if (maxPrice === null && products.length) setMaxPrice(priceBounds.max);
  }, [maxPrice, priceBounds.max, products.length]);

  const options = useMemo(() => ({
    colors: [...new Set(products.flatMap((product) => product.colors || []))].sort(),
    sizes: [...new Set(products.flatMap((product) => product.sizes || []))],
    categories: [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    types: [...new Set(products.map((product) => product.type).filter(Boolean))].sort()
  }), [products]);

  const toggle = (value, setter) => setter((current) => current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]);

  const visibleProducts = useMemo(() => {
    const selectedMax = maxPrice ?? priceBounds.max;
    const filtered = products.filter((product) => (
      Number(product.price) <= selectedMax
      && (!colors.length || colors.some((color) => product.colors?.includes(color)))
      && (!sizes.length || sizes.some((size) => product.sizes?.includes(size)))
      && (!categories.length || categories.includes(product.category))
      && (!types.length || types.includes(product.type))
    ));

    if (sort === 'low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, maxPrice, priceBounds.max, colors, sizes, categories, types, sort]);

  const filterButton = (active) => `rounded-full border px-3 py-1 text-xs transition ${active
    ? 'border-foreground bg-foreground text-background'
    : 'border-border hover:border-foreground/50'}`;

  const renderOptions = (values, selected, setter) => values.map((value) => (
    <button key={value} type="button" onClick={() => toggle(value, setter)} className={filterButton(selected.includes(value))}>{value}</button>
  ));

  return (
    <div className="container-osoul py-10 md:py-14">
      <header className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">The First Drop</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl italic tracking-tight">Everything you actually need.</h1>
      </header>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="space-y-6 md:sticky md:top-24 md:self-start">
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Price</h4>
            <div className="text-xs text-muted-foreground">₹{priceBounds.min} — ₹{maxPrice ?? priceBounds.max}</div>
            <input type="range" min={priceBounds.min} max={priceBounds.max || 1} step="1" className="mt-2 w-full accent-charcoal" value={maxPrice ?? priceBounds.max} disabled={!products.length} onChange={(event) => setMaxPrice(Number(event.target.value))} />
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Color</h4>
            <div className="flex flex-wrap gap-1.5">{renderOptions(options.colors, colors, setColors)}</div>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Size</h4>
            <div className="flex flex-wrap gap-1.5">{renderOptions(options.sizes, sizes, setSizes)}</div>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Category</h4>
            <div className="flex flex-wrap gap-1.5">{renderOptions(options.categories, categories, setCategories)}</div>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Type</h4>
            <div className="flex flex-wrap gap-1.5">{renderOptions(options.types, types, setTypes)}</div>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{visibleProducts.length} products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>

          {loading && <p className="py-16 text-center text-sm text-muted-foreground">Loading products...</p>}
          {!loading && error && <p className="py-16 text-center text-sm text-clay">{error}</p>}
          {!loading && !error && !visibleProducts.length && <p className="py-16 text-center text-sm italic text-muted-foreground">No products match these filters.</p>}
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shop;
