import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/productData';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingBag, CheckCircle2, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import OptimizedImage from '../components/common/OptimizedImage';

const ProductDetails = () => {
  const { slug } = useParams();
  const product = allProducts.find(p => p.slug === slug);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [openObjection, setOpenObjection] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="container-osoul py-20 text-center">
        <h1 className="font-serif text-3xl">Product Not Found</h1>
        <Link to="/shop" className="mt-5 inline-block text-sm underline underline-offset-4">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
  };

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-secondary/10">
        <div className="container-osoul py-4">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            <Link to="/" className="hover:text-foreground">O'Soul</Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <Link to={`/${product.category.toLowerCase()}`} className="hover:text-foreground">{product.category}</Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-osoul py-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Product Images & Features */}
          <div className="lg:col-span-7 space-y-8">
            <div className={`relative w-full overflow-hidden rounded-2xl bg-secondary aspect-[4/5] shadow-sm`}>
              {product.image && (
                <OptimizedImage 
                  src={product.image} 
                  alt={product.name} 
                  aspectRatio="aspect-[4/5]"
                  priority={true}
                  className="h-full w-full"
                />
              )}
              <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
            </div>
            
            {/* Feature Tags Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.featureTags?.map((tag, idx) => (
                <div key={idx} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-olive/30 hover:shadow-sm">
                  <div className="rounded-full bg-olive/10 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-olive" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium italic">{tag}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{product.type}</span>
                <span className="h-px w-8 bg-border"></span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">{product.name}</h1>
              
              <div className="mt-6 flex items-center gap-5">
                <span className="text-3xl font-serif text-foreground">₹{product.price}</span>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-olive">In Stock · On Sale</span>
                </div>
              </div>

              <div className="mt-10 space-y-6 border-l-2 border-olive/20 pl-8">
                <p className="font-serif text-2xl italic text-foreground leading-tight">
                  "{product.emotionalHook}"
                </p>
                <p className="text-base text-muted-foreground leading-relaxed italic">
                  {product.shortDescription}
                </p>
                {product.fitDetail && (
                  <p className="text-sm font-bold text-olive/80 uppercase tracking-widest">
                    The Fit Truth: <span className="normal-case italic font-medium ml-1 text-foreground/80">{product.fitDetail}</span>
                  </p>
                )}
              </div>

              <div className="mt-12 space-y-10">
                {/* Size selection */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Size: <span className="text-foreground ml-1">{selectedSize}</span></span>
                    <Link to="/size-guide" className="text-xs font-bold uppercase tracking-widest text-olive/70 hover:text-olive transition-colors">Size Guide</Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 min-w-14 rounded-md border text-sm transition-all duration-200 ${selectedSize === size ? 'border-foreground bg-foreground text-background font-bold shadow-lg' : 'border-border hover:border-foreground/40 text-foreground/70 bg-card'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground/60 italic">Pick your usual size. Sizing up is recommended for extra room.</p>
                </div>

                {/* Color selection */}
                <div>
                  <div className="mb-4 text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Color: <span className="text-foreground ml-1">{selectedColor}</span></div>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button 
                        key={color} 
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex h-11 items-center gap-3 rounded-full border px-5 text-sm transition-all ${selectedColor === color ? 'border-foreground bg-secondary/50 font-bold' : 'border-border hover:border-foreground/30 text-muted-foreground'}`}
                      >
                        <span className={`h-3 w-3 rounded-full shadow-inner ${color === 'Black' ? 'bg-zinc-900' : color === 'Olive' ? 'bg-olive' : 'bg-stone-400'}`}></span>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-14 items-center rounded-md border border-border bg-card">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 hover:text-olive transition-colors"><Minus className="h-4 w-4" /></button>
                    <span className="min-w-[2rem] text-center font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-5 hover:text-olive transition-colors"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-14 rounded-md bg-foreground text-background font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-foreground/90 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-charcoal/10"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-6 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
                  <span>Secure Razorpay Checkout</span>
                  <span className="h-1 w-1 rounded-full bg-border"></span>
                  <span>Easy Exchange Support</span>
                </div>
              </div>

              {/* Technical Details Accordion */}
              <div className="mt-16 space-y-px border-t border-border pt-12">
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-6">Technical Details</h4>
                {[
                  { title: "Fit & Pattern", content: product.fitDetail },
                  { title: "Fabric Feel", content: product.details.fabric },
                  { title: "Best For", content: product.bestFor },
                  { title: "Care Instructions", content: product.details.care }
                ].map((item, idx) => (
                  <details key={idx} className="group border-b border-border/60">
                    <summary className="flex cursor-pointer items-center justify-between py-4 text-sm font-medium hover:text-olive transition-colors list-none">
                      <span className="italic">{item.title}</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 opacity-40" />
                    </summary>
                    <div className="pb-4 text-sm text-muted-foreground italic leading-relaxed">
                      {item.content}
                    </div>
                  </details>
                ))}
              </div>

              {/* Objection Removal Section */}
              <div className="mt-12 space-y-4">
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">Honest Doubts</h4>
                {product.objections?.map((obj, idx) => (
                  <div key={idx} className="overflow-hidden rounded-xl border border-border/60 bg-secondary/20">
                    <button 
                      onClick={() => setOpenObjection(openObjection === idx ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm font-bold transition-colors hover:text-olive"
                    >
                      <span className="font-serif italic text-base">"{obj.q}"</span>
                      {openObjection === idx ? <ChevronUp className="h-4 w-4 opacity-40" /> : <ChevronDown className="h-4 w-4 opacity-40" />}
                    </button>
                    {openObjection === idx && (
                      <div className="border-t border-border/40 p-5 pt-4 text-sm text-muted-foreground italic leading-relaxed bg-background/40">
                        {obj.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Section (Doubt based) */}
        <div className="mt-24 md:mt-40 border-t border-border pt-20">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Social Proof</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl italic leading-tight">What early buyers noticed about this piece.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {/* Dynamic Reviews can be mapped here, showing 3 specific for the product */}
             {[
               { q: "Will it actually fit me right?", a: "I didn't have to keep fixing it. First pair I've worn through a full college day without thinking about my pants once.", author: "Aanya, 22 · Mumbai" },
               { q: "Will the fabric feel cheap?", a: "Expected it to feel like any ₹999 basic. It doesn't. The fabric is soft but it has weight to it. Not cheap at all.", author: "Kartik, 31 · Mumbai" },
               { q: "Will I actually wear it again?", a: "I've worn these four times this week. I keep reaching for them. They're not the most exciting thing I own — but they're the most useful.", author: "Meera, 27 · Hyderabad" }
             ].map((rev, i) => (
               <div key={i} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                 <p className="text-[10px] uppercase tracking-widest text-olive/60 font-bold mb-4">Real Doubt</p>
                 <h4 className="font-serif text-lg italic mb-4 leading-tight">"{rev.q}"</h4>
                 <div className="mt-6 pt-6 border-t border-border/40">
                   <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">"{rev.a}"</p>
                   <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">— {rev.author}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Footer Doctrine */}
        <div className="mt-32 border-t border-border pt-20 text-center">
          <p className="font-serif text-4xl md:text-6xl italic text-foreground/20 leading-tight">
            If it makes you adjust, it failed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
