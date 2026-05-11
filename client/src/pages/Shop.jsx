import React from 'react';
import ProductCard from '../components/product/ProductCard';

const products = [
  {
    id: 1,
    slug: 'mens-boxy-tee-with-pocket',
    name: "Men's Boxy Tee With Pocket",
    price: 699,
    shortDescription: "The tee you can throw on and still feel sorted.",
    description: "Relaxed, soft, and easy to repeat. The pocket adds function without making the tee feel busy.",
    bestFor: "College · errands · casual outings · daily layering",
    tileClass: "tile-charcoal",
    tags: ["Boxy fit", "Pocket detail", "Easy fall", "Soft feel"],
    category: "Men",
    type: "Tees"
  },
  {
    id: 2,
    slug: 'mens-joggers',
    name: "Men's Joggers",
    price: 999,
    shortDescription: "For days when jeans feel like too much.",
    description: "Soft joggers that keep you comfortable without making you look like you gave up.",
    bestFor: "Travel · college · cafés · lounging · daily movement",
    tileClass: "tile-olive",
    tags: ["Soft waistband", "Relaxed thigh", "Clean taper", "Everyday comfort"],
    category: "Men",
    type: "Joggers"
  },
  {
    id: 3,
    slug: 'mens-shorts',
    name: "Men's Shorts",
    price: 695,
    shortDescription: "Warm-day comfort without the thigh fight.",
    description: "Easy shorts for walks, errands, home, and casual days when you want comfort without constant pulling.",
    bestFor: "Summer · home · walks · errands · college",
    tileClass: "tile-charcoal",
    tags: ["Easy thigh room", "Soft waistband", "Clean pocket", "Daily comfort"],
    category: "Men",
    type: "Shorts"
  },
  {
    id: 4,
    slug: 'unisex-boxy-tee',
    name: "Unisex Boxy Tee",
    price: 690,
    shortDescription: "One easy tee. Many repeat days.",
    description: "A clean boxy tee that works across moods, routines, and outfits.",
    bestFor: "Daily wear · layering · college · errands · relaxed fits",
    tileClass: "tile-sand",
    tags: ["Unisex fit", "Boxy fall", "Soft fabric", "Easy styling"],
    category: "Unisex",
    type: "Tees"
  },
  {
    id: 5,
    slug: 'womens-cropped-hoodie',
    name: "Women's Cropped Hoodie",
    price: 799,
    shortDescription: "Soft comfort that still feels styled.",
    description: "A cropped hoodie for days when you want ease without losing shape.",
    bestFor: "Layering · travel · lounging · cafés · casual outings",
    tileClass: "tile-clay",
    tags: ["Cropped fit", "Soft feel", "Easy layering", "Clean shape"],
    category: "Women",
    type: "Hoodies"
  },
  {
    id: 6,
    slug: 'womens-harem-pants',
    name: "Women's Harem Pants",
    price: 999,
    shortDescription: "Freedom without the sloppy look.",
    description: "Relaxed harem pants that move softly, drape cleanly, and let your body breathe.",
    bestFor: "Travel · home · slow days · creative work · casual outings",
    tileClass: "tile-olive",
    tags: ["Soft drape", "Roomy rise", "Relaxed movement", "No-cling feel"],
    category: "Women",
    type: "Harem Pants"
  }
];

const Shop = () => {
  return (
    <div className="container-osoul py-10 md:py-14">
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Shop</p>
        <h1 className="mt-2 font-serif text-4xl">Everything in the first drop.</h1>
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
