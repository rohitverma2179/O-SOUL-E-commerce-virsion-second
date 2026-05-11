import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, price, shortDescription, tileClass, bestFor, tags, slug } = product;

  return (
    <article className="group flex flex-col">
      <Link to={`/products/${slug}`} className="block overflow-hidden rounded-md">
        <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-md ${tileClass} transition-transform duration-500 group-hover:scale-[1.02]`} aria-hidden="true">
          <div 
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay" 
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}
          />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-ivory/70">O'Soul</div>
            <div className="mt-1 font-serif text-lg leading-tight text-ivory">{name}</div>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to={`/products/${slug}`} className="font-serif text-base leading-tight text-foreground hover:underline underline-offset-4">
            {name}
          </Link>
          <div className="mt-1 text-sm text-muted-foreground">₹{price}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-olive/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-olive">In stock</span>
          <span className="rounded-full bg-clay/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-clay">On sale</span>
        </div>
      </div>

      <p className="mt-2 text-sm italic text-muted-foreground">{shortDescription}</p>
      <p className="mt-1 text-sm text-foreground/80">{product.description}</p>
      <p className="mt-2 text-xs text-muted-foreground">Best for: {bestFor}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground/70">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className="h-10 rounded-md border border-foreground bg-background text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background">
          Add to Cart
        </button>
        <button type="button" className="h-10 rounded-md bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90">
          Buy Now
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
