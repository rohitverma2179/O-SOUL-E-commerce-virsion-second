import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { id, name, price, originalPrice, shortDescription, tileClass, bestFor, tags, slug } = product;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  let defaultSize = product.sizes?.[0] || 'One size';
  let defaultColor = product.colors?.[0] || 'Default';

  if (product.variants && product.variants.length > 0) {
    const availableVariant = product.variants.find((v) => v.stock > 0);
    if (availableVariant) {
      defaultSize = availableVariant.size;
      defaultColor = availableVariant.color;
    }
  }

  const handleAddToCart = () => {
    if (!user) return navigate('/login', { state: { from: location } });
    if (product.stock < 1) return;
    addToCart(product, defaultSize, defaultColor);
  };

  const handleBuyNow = () => {
    if (!user) return navigate('/login', { state: { from: location } });
    if (product.stock < 1) return;
    addToCart(product, defaultSize, defaultColor);
    navigate('/checkout');
  };

  return (
    <article className="group flex flex-col w-full">
      <Link to={`/products/${slug}`} className="block w-full text-inherit no-underline">
        <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-md ${tileClass} transition-transform duration-500 group-hover:scale-[1.02]`} aria-hidden="true">
          {product.image && (
            <OptimizedImage 
              src={product.image} 
              alt={product.alt || name} 
              aspectRatio=""
              className="absolute inset-0 h-full w-full"
            />
          )}
          <div 
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay" 
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-charcoal/30 to-transparent">
            <div className="text-[10px] uppercase tracking-[0.18em] text-ivory/70">O'Soul</div>
            <div className="mt-1 font-serif text-lg leading-tight text-ivory">{name}</div>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="font-serif text-base leading-tight text-foreground hover:underline underline-offset-4 block truncate">
              {name}
            </span>
            <div className="mt-1 flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xs">
                  {i < (product.rating || 5) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <div className="mt-1 text-sm flex items-center gap-2 flex-wrap">
              <span className="text-muted-foreground font-semibold">₹{price}</span>
              {originalPrice && Number(originalPrice) > Number(price) && (
                <span className="text-xs text-muted-foreground/60 line-through font-normal">₹{originalPrice}</span>
              )}
            </div>
          </div>
          {/* <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${product.stock > 0 ? 'bg-olive/10 text-olive' : 'bg-clay/10 text-clay'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div> */}
        </div>

        <p className="mt-2 text-sm  text-muted-foreground line-clamp-2">{shortDescription}</p>
        <p className="mt-2 text-xs text-muted-foreground">Best for: {bestFor}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags?.map((tag) => (
            <span key={tag} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground/70">
              {tag}
            </span>
          ))}
        </div>
      </Link>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button 
          type="button" 
          onClick={handleAddToCart} 
          disabled={product.stock < 1} 
          className="flex h-10 items-center justify-center rounded-md border border-foreground bg-background text-[11px] sm:text-xs md:text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40 px-1"
        >
          Add to Cart
        </button>
        <button 
          type="button" 
          onClick={handleBuyNow} 
          disabled={product.stock < 1} 
          className="flex h-10 items-center justify-center rounded-md bg-foreground text-[11px] sm:text-xs md:text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-40 px-1"
        >
          Buy Now
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
