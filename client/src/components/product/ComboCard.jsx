import React from 'react';
import { Link } from 'react-router-dom';

const ComboCard = ({ combo }) => {
  const { title, description, originalPrice, discountedPrice, savings, tiles, items } = combo;

  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-muted-foreground line-through">₹{originalPrice}</div>
          <div className="font-serif text-lg">₹{discountedPrice}</div>
          <div className="text-xs text-olive font-medium">Save ₹{savings}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {tiles.map((tile, idx) => (
          <div key={idx} className={`relative w-full overflow-hidden rounded-md ${tile} aspect-square`} aria-hidden="true">
            <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-md border border-border bg-background p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">
                {idx + 1}. <Link to={`/products/${item.slug}`} className="hover:underline">{item.name}</Link>
              </div>
              <div className="text-xs text-muted-foreground">₹{item.price}</div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Color</div>
                <div className="flex gap-1.5">
                  <button type="button" className="rounded-full border px-2.5 py-1 text-[11px] border-border hover:border-foreground/50 transition-colors">Black</button>
                  <button type="button" className="rounded-full border px-2.5 py-1 text-[11px] border-border hover:border-foreground/50 transition-colors">Olive</button>
                </div>
              </div>
              <div>
                <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Size</div>
                <div className="flex flex-wrap gap-1">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button key={size} type="button" className="h-7 min-w-8 rounded-md border px-1.5 text-[11px] border-border hover:border-foreground/50 transition-colors">{size}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="mt-5 h-11 w-full rounded-md bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90">
        Add Combo to Cart
      </button>
    </article>
  );
};

export default ComboCard;
