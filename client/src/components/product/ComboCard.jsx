import React, { useState } from 'react';
import OptimizedImage from '../common/OptimizedImage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ComboCard = ({ combo }) => {
  const { title, description, originalPrice, discountedPrice, savings, tiles, items } = combo;

  const parsePrice = (val) => {
    if (val === undefined || val === null) return 0;
    const cleaned = val.toString().replace(/,/g, '').trim();
    return Number(cleaned) || 0;
  };

  const origPriceNum = parsePrice(originalPrice);
  const discPriceNum = parsePrice(discountedPrice);
  const savingsNum = parsePrice(savings) || Math.max(0, origPriceNum - discPriceNum);
  const discountPercent = origPriceNum > 0 ? Math.round((savingsNum / origPriceNum) * 100) : 0;

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Default selection state for each item (default size: S, default color: Black)
  const [selectedSizes, setSelectedSizes] = useState(() => (items || []).map(() => 'S'));
  const [selectedColors, setSelectedColors] = useState(() => (items || []).map(() => 'Black'));
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  const handleSizeSelect = (itemIdx, size) => {
    setSelectedSizes(prev => {
      const updated = [...prev];
      updated[itemIdx] = size;
      return updated;
    });
  };

  const handleColorSelect = (itemIdx, color) => {
    setSelectedColors(prev => {
      const updated = [...prev];
      updated[itemIdx] = color;
      return updated;
    });
  };

  const cartCombo = {
    id: combo._id || combo.id,
    name: combo.title,
    price: discPriceNum,
    image: combo.images?.[0],
    stock: combo.stock !== undefined ? combo.stock : 999,
    isCombo: true
  };

  const handleAddCombo = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return false;
    }
    const finalSizes = selectedSizes.join(', ');
    const finalColors = selectedColors.join(', ');
    addToCart(cartCombo, finalSizes, finalColors);
    return true;
  };
  const handleBuyCombo = () => {
    if (handleAddCombo()) navigate('/checkout');
  };

  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl tracking-tight">{combo.title}</h3>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted-foreground line-through">₹{combo.originalPrice}</div>
            <div className="font-serif text-xl text-foreground">₹{combo.discountedPrice}</div>
            <div className="mt-1 inline-block rounded-full bg-olive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-olive">Save ₹{savingsNum} · {discountPercent}% off</div>
            <div className="mt-1 text-[10px] text-muted-foreground">₹{combo.originalPrice} − ₹{savingsNum} = ₹{combo.discountedPrice}</div>
            {combo.stock !== undefined && combo.stock === 0 && (
              <div className="mt-2 text-[10px] uppercase tracking-widest font-bold text-red-500">Out of Stock</div>
            )}
          </div>
        </div>
        <p className="mt-2 font-serif text-lg   text-olive/80 leading-tight">{combo.headline}</p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{combo.description}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{items.length} clothing item{items.length === 1 ? '' : 's'} included</p>
        {(combo.proofLine || combo.valueLine) && (
          <p className="mt-3 text-xs font-medium text-foreground/70   border-l-2 border-olive/20 pl-3">
            {combo.proofLine || combo.valueLine}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {combo.images?.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setActivePreviewImage(img)}
            className="relative w-full overflow-hidden rounded-lg bg-secondary aspect-square shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <OptimizedImage
              src={img} 
              alt={combo.alts ? combo.alts[idx] : `${combo.title} item ${idx + 1}`} 
              className="h-full w-full pointer-events-none"
            />
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-md border border-border bg-background p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">
                {idx + 1}. {item.name}
              </div>
              <div className="text-xs text-muted-foreground   font-medium">
                Size: {selectedSizes[idx]} | Color: {selectedColors[idx]}
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Color</div>
                <div className="flex gap-1.5">
                  {['Black', 'Olive'].map(color => {
                    const isSelected = selectedColors[idx] === color;
                    return (
                      <button 
                        key={color}
                        type="button" 
                        onClick={() => handleColorSelect(idx, color)}
                        className={`rounded-full border px-2.5 py-1 text-[11px] transition-all duration-150 ${
                          isSelected 
                            ? 'border-foreground bg-foreground text-background font-bold shadow-sm' 
                            : 'border-border hover:border-foreground/50 text-foreground/70 bg-card'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Size</div>
                <div className="flex flex-wrap gap-1">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                    const isSelected = selectedSizes[idx] === size;
                    return (
                      <button
                        key={size} 
                        type="button" 
                        onClick={() => handleSizeSelect(idx, size)}
                        className={`h-7 min-w-8 rounded-md border px-1.5 text-[11px] transition-all duration-150 ${
                          isSelected 
                            ? 'border-foreground bg-foreground text-background font-bold shadow-sm' 
                            : 'border-border hover:border-foreground/50 text-foreground/70 bg-card'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button 
          type="button" 
          disabled={combo.stock !== undefined && combo.stock === 0} 
          onClick={handleAddCombo} 
          className="h-11 rounded-md border border-foreground bg-background text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-foreground"
        >
          {combo.stock !== undefined && combo.stock === 0 ? 'Out of Stock' : 'Add Combo'}
        </button>
        <button 
          type="button" 
          disabled={combo.stock !== undefined && combo.stock === 0} 
          onClick={handleBuyCombo} 
          className="h-11 rounded-md bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {combo.stock !== undefined && combo.stock === 0 ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>

      {/* Image Preview Modal */}
      {activePreviewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActivePreviewImage(null)}
        >
          <div className="relative max-w-md w-full bg-background border border-border rounded-xl p-2 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <button 
              onClick={() => setActivePreviewImage(null)} 
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer outline-none font-bold text-xs"
              aria-label="Close image preview"
            >
              ✕
            </button>
            <img 
              src={activePreviewImage} 
              alt="Preview" 
              className="w-full h-auto rounded-lg object-contain max-h-[70vh]"
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default ComboCard;
