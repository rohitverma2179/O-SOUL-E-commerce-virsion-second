import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingBag, CheckCircle2, ChevronDown, ChevronUp, ChevronRight, Heart } from 'lucide-react';
import OptimizedImage from '../components/common/OptimizedImage';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const { addToCart } = useCart();
  const { user, checkAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [openObjection, setOpenObjection] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product && user) {
      setIsWishlisted(user.wishlist?.includes(product._id) || false);
    }
  }, [product, user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/wishlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product._id })
      });
      const data = await response.json();
      if (data.success) {
        setIsWishlisted(data.added);
        checkAuth();
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoadingProduct(true);
    setActiveImageIndex(0);
    fetch(`${API_BASE_URL}/products/${slug}`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        const initialProd = payload.data;
        setProduct(initialProd);
        let initSize = initialProd.sizes?.[0] || '';
        let initColor = initialProd.colors?.[0] || '';
        if (initialProd.variants && initialProd.variants.length > 0) {
          const firstInStock = initialProd.variants.find((v) => v.stock > 0);
          if (firstInStock) {
            initSize = firstInStock.size;
            initColor = firstInStock.color;
          }
        }
        setSelectedSize(initSize);
        setSelectedColor(initColor);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoadingProduct(false));
  }, [slug]);

  if (loadingProduct) return <div className="container-osoul py-20 text-center text-sm text-muted-foreground">Loading product...</div>;

  if (!product) {
    return (
      <div className="container-osoul py-20 text-center">
        <h1 className="font-serif text-3xl">Product Not Found</h1>
        <Link to="/shop" className="mt-5 inline-block text-sm underline underline-offset-4">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart({ ...product, id: product._id }, selectedSize, selectedColor, quantity);
  };

  const selectedVariant = product.variants?.find(
    (v) =>
      (!selectedSize || v.size?.toLowerCase() === selectedSize.toLowerCase()) &&
      (!selectedColor || v.color?.toLowerCase() === selectedColor.toLowerCase())
  );
  const variantStock = selectedVariant !== undefined ? selectedVariant.stock : product.stock;
  const isOutOfStock = variantStock < 1;

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
            <div className={`relative w-full overflow-hidden rounded-2xl bg-secondary aspect-[4/5] shadow-sm group`}>
              {(() => {
                const images = [product.image, product.backImage].filter(Boolean);
                return (
                  <>
                    {images.length > 0 && (
                      <OptimizedImage
                        src={images[activeImageIndex]}
                        alt={product.name}
                        aspectRatio="aspect-[4/5]"
                        priority={true}
                        className="h-full w-full object-cover transition-all duration-500"
                      />
                    )}
                    <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex((curr) => (curr === 0 ? images.length - 1 : curr - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setActiveImageIndex((curr) => (curr === images.length - 1 ? 0 : curr + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        >
                          →
                        </button>
                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIndex(idx)}
                              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeImageIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
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

              {/* Product Rating Stars */}
              <div className="mt-2 flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-base">
                    {i < (product.rating || 5) ? '★' : '☆'}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif text-foreground">₹{product.price}</span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-lg text-muted-foreground line-through font-normal">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-clay' : 'bg-olive'} animate-pulse`}></span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isOutOfStock ? 'text-clay' : 'text-olive'}`}>
                    {!isOutOfStock ? `${variantStock} In Stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="mt-10 space-y-6 border-l-2 border-olive/20 pl-8">
                {/* <p className="font-serif text-2xl italic text-foreground leading-tight">
                  "{product.emotionalHook || product.shortDescription}"
                </p> */}
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
                    <div className="flex items-center gap-3">
                      <Link to="/size-guide" className="text-xs font-bold uppercase tracking-widest text-olive/70 hover:text-olive transition-colors">Size Guide</Link>
                      <span className="text-border text-xs">|</span>
                      <a
                        href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi O'Soul, I am looking at "${product.name}" and need help choosing my size.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-widest text-olive hover:opacity-85 transition-opacity"
                      >
                        WhatsApp Help
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map(size => (
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
                    {product.colors?.map(color => (
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
                    <button disabled={isOutOfStock || quantity >= variantStock} onClick={() => setQuantity(Math.min(variantStock, quantity + 1))} className="px-5 hover:text-olive transition-colors disabled:cursor-not-allowed disabled:opacity-30"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || !selectedSize || !selectedColor}
                    className="flex-1 h-14 rounded-md bg-foreground text-background font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-foreground/90 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-charcoal/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {!isOutOfStock ? 'Add to Bag' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`h-14 w-14 flex items-center justify-center rounded-md border transition-all duration-200 shrink-0 ${isWishlisted
                        ? 'border-clay bg-clay text-background hover:bg-clay/90'
                        : 'border-border bg-card hover:border-foreground/30 text-muted-foreground hover:text-foreground'
                      }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
                  <span>Secure Razorpay Checkout</span>
                  <span className="h-1 w-1 rounded-full bg-border"></span>
                  <span>Easy Exchange Support</span>
                </div>
              </div>

              {/* Technical Details Accordion (Dynamic Q&A or Default Details) */}
              {(() => {
                const items = (product.objections && product.objections.length > 0)
                  ? product.objections.map(obj => ({ title: obj.question, content: obj.answer }))
                  : [
                    { title: "Fit & Pattern", content: product.fitDetailLine || product.fitDetail },
                    { title: "Fabric Feel", content: product.shortCopy || product.details?.fabric || "Comfort-focused everyday fabric." },
                    { title: "Best For", content: product.bestFor },
                    { title: "Care Instructions", content: product.careLine || product.details?.care || "Follow the care label for best results." }
                  ].filter(item => item.content);

                return items.length > 0 && (
                  <div className="mt-16 space-y-px border-t border-border pt-12">
                    <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-6">Technical Details</h4>
                    {items.map((item, idx) => (
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
                );
              })()}
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
