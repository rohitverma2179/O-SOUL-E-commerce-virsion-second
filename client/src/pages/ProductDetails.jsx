import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/productData';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

const ProductDetails = () => {
  const { slug } = useParams();
  const product = allProducts.find(p => p.slug === slug);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  if (!product) {
    return (
      <div className="container-osoul py-20 text-center">
        <h1 className="font-serif text-3xl">Product Not Found</h1>
        <Link to="/shop" className="mt-5 inline-block text-sm underline underline-offset-4">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // We'll call addToCart multiple times based on quantity for now, 
    // or we can update CartContext to handle quantity in addToCart.
    // Let's assume we want to add the specific quantity.
    for(let i=0; i<quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
  };

  return (
    <div className="container-osoul py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Product Images Placeholder */}
        <div className="space-y-3">
          <div className={`relative w-full overflow-hidden rounded-md tile-${product.tile} aspect-[4/5]`} aria-hidden="true">
            <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-ivory/70">O'Soul</div>
              <div className="mt-1 font-serif text-lg leading-tight text-ivory">{product.name}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className={`relative w-full overflow-hidden rounded-md tile-${product.tile} aspect-square`} aria-hidden="true"></div>
            <div className={`relative w-full overflow-hidden rounded-md tile-${product.tile} aspect-square opacity-90`} aria-hidden="true"></div>
            <div className={`relative w-full overflow-hidden rounded-md tile-${product.tile} aspect-square opacity-80`} aria-hidden="true"></div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.category} · {product.type}
          </p>
          <h1 className="mt-2 font-serif text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-lg font-medium">₹{product.price}</span>
            {product.inStock && (
              <span className="rounded-full bg-olive/10 px-2 py-0.5 text-[11px] font-medium text-olive">In stock</span>
            )}
            {product.onSale && (
              <span className="rounded-full bg-clay/10 px-2 py-0.5 text-[11px] font-medium text-clay">On sale</span>
            )}
          </div>

          <p className="mt-5 italic text-foreground/80">{product.emotional}</p>
          <p className="mt-2 text-sm text-foreground/80">{product.short}</p>

          <div className="mt-6 space-y-6">
            {/* Color selection */}
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Color: {selectedColor}</div>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${selectedColor === color ? 'border-foreground bg-secondary/50' : 'border-border hover:border-foreground/50'}`}
                  >
                    <span className={`h-3 w-3 rounded-full ${color === 'Black' ? 'bg-zinc-900' : 'bg-olive'}`}></span>
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Size: {selectedSize}</span>
                <button className="text-xs underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground transition-colors">Size advice</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-11 rounded-md border px-3 text-sm transition ${selectedSize === size ? 'border-foreground bg-secondary/50 font-medium' : 'border-border hover:border-foreground/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Quantity</div>
              <div className="inline-flex items-center rounded-md border border-border">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-secondary/50 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2.5rem] text-center text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-secondary/50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button 
              onClick={handleAddToCart}
              className="h-12 rounded-md border border-foreground text-sm font-medium transition hover:bg-foreground hover:text-background flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Bag
            </button>
            <button className="h-12 rounded-md bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90">
              Buy Now
            </button>
          </div>
          <p className="mt-4 text-[11px] text-center text-muted-foreground italic">
            Secure Razorpay checkout · Easy exchange support
          </p>

          {/* Product Details List */}
          <div className="mt-12 space-y-4 border-t border-border pt-6">
            {[
              { label: "Fit", value: product.details.fit },
              { label: "Fabric feel", value: product.details.fabric },
              { label: "Best for", value: product.bestFor },
              { label: "Care", value: product.details.care },
              { label: "Size advice", value: product.details.sizeAdvice },
            ].map((detail, idx) => (
              <div key={idx} className="border-b border-border pb-3 last:border-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{detail.label}</div>
                <p className="mt-1 text-sm text-foreground/85">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
