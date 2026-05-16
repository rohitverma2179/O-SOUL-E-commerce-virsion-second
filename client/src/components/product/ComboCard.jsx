import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';

const ComboCard = ({ combo }) => {
  const { title, description, originalPrice, discountedPrice, savings, tiles, items } = combo;

  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl tracking-tight">{combo.title}</h3>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted-foreground line-through">₹{combo.originalPrice}</div>
            <div className="font-serif text-xl text-foreground">₹{combo.discountedPrice}</div>
            <div className="mt-1 inline-block rounded-full bg-olive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-olive">Save ₹{combo.savings}</div>
          </div>
        </div>
        <p className="mt-2 font-serif text-lg italic text-olive/80 leading-tight">{combo.headline}</p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{combo.description}</p>
        {(combo.proofLine || combo.valueLine) && (
          <p className="mt-3 text-xs font-medium text-foreground/70 italic border-l-2 border-olive/20 pl-3">
            {combo.proofLine || combo.valueLine}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {combo.images?.map((img, idx) => (
          <div key={idx} className={`relative w-full overflow-hidden rounded-lg bg-secondary aspect-square shadow-sm transition-transform hover:scale-[1.02]`} aria-hidden="true">
            <OptimizedImage
              src={img} 
              alt={combo.alts ? combo.alts[idx] : `${combo.title} item ${idx + 1}`} 
              className="h-full w-full"
            />
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
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
