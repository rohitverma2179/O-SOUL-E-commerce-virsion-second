import React, { useState, useEffect } from 'react';
import OptimizedImage from '../common/OptimizedImage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../lib/api';

const ComboCard = ({ combo }) => {
  const { title, description, originalPrice, discountedPrice, savings, tiles, items } = combo;

  const parsePrice = (val) => {
    if (val === undefined || val === null) return 0;
    const cleaned = val.toString().replace(/,/g, '').trim();
    return Number(cleaned) || 0;
  };

  const origPriceNum = parsePrice(originalPrice);
  const discPriceNum = parsePrice(discountedPrice);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selection states
  const [selectedSizes, setSelectedSizes] = useState(() => 
    (items || []).map(item => (item.variants && item.variants.length > 0) ? item.variants[0].size : 'S')
  );
  const [selectedColors, setSelectedColors] = useState(() => 
    (items || []).map(item => (item.variants && item.variants.length > 0) ? item.variants[0].color : 'Black')
  );
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

  const getProductColors = (itemIdx) => {
    const item = items[itemIdx];
    if (item && item.variants && item.variants.length > 0) {
      return [...new Set(item.variants.map(v => v.color))];
    }
    return ['Black', 'Olive']; // Fallback
  };

  const getProductSizes = (itemIdx) => {
    const item = items[itemIdx];
    if (item && item.variants && item.variants.length > 0) {
      return [...new Set(item.variants.map(v => v.size))];
    }
    return ['S', 'M', 'L', 'XL', 'XXL']; // Fallback
  };

  const isSizeOutOfStockForSelectedColor = (itemIdx, size) => {
    const item = items[itemIdx];
    if (!item) return false;
    const selColor = selectedColors[itemIdx];
    if (!item.variants || item.variants.length === 0) return false;
    const variant = item.variants.find(
      v => v.size?.toLowerCase() === size.toLowerCase() &&
           v.color?.toLowerCase() === selColor.toLowerCase()
    );
    return !variant || variant.stock <= 0;
  };

  const isColorOutOfStockForSelectedSize = (itemIdx, color) => {
    const item = items[itemIdx];
    if (!item) return false;
    const selSize = selectedSizes[itemIdx];
    if (!item.variants || item.variants.length === 0) return false;
    const variant = item.variants.find(
      v => v.color?.toLowerCase() === color.toLowerCase() &&
           v.size?.toLowerCase() === selSize.toLowerCase()
    );
    return !variant || variant.stock <= 0;
  };

  const getSizeStockForSelectedColor = (itemIdx, size) => {
    const item = items[itemIdx];
    if (!item) return 0;
    const selColor = selectedColors[itemIdx];
    if (!item.variants || item.variants.length === 0) return 0;
    const variant = item.variants.find(
      v => v.size?.toLowerCase() === size.toLowerCase() &&
           v.color?.toLowerCase() === selColor.toLowerCase()
    );
    return variant ? variant.stock : 0;
  };

  const activeDiscountedPrice = discPriceNum;
  const activeOriginalPrice = origPriceNum;

  const activeSavings = Math.max(0, activeOriginalPrice - activeDiscountedPrice);
  const activeDiscountPercent = activeOriginalPrice > 0 ? Math.round((activeSavings / activeOriginalPrice) * 100) : 0;

  const isSelectionOutOfStock = () => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;
      const selSize = selectedSizes[i];
      const selColor = selectedColors[i];
      if (item.variants && item.variants.length > 0) {
        const variant = item.variants.find(
          v => v.size?.toLowerCase() === selSize?.toLowerCase() &&
               v.color?.toLowerCase() === selColor?.toLowerCase()
        );
        if (!variant || variant.stock <= 0) {
          return true;
        }
      }
    }
    return false;
  };

  const outOfStock = isSelectionOutOfStock();

  const handleAddCombo = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return false;
    }

    const finalSizes = selectedSizes.join(', ');
    const finalColors = selectedColors.join(', ');

    const cartCombo = {
      id: combo._id || combo.id,
      name: combo.title,
      price: activeDiscountedPrice,
      image: combo.images?.[0],
      stock: 999,
      isCombo: true,
      selectedItems: items.map((item, idx) => ({
        name: item.name,
        slug: item.slug,
        size: selectedSizes[idx],
        color: selectedColors[idx]
      }))
    };

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
            <div className="text-xs text-muted-foreground line-through">₹{activeOriginalPrice}</div>
            <div className="font-serif text-xl text-foreground">₹{activeDiscountedPrice}</div>
            {activeSavings > 0 && (
              <div className="mt-1 inline-block rounded-full bg-olive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-olive">
                Save ₹{activeSavings} · {activeDiscountPercent}% off
              </div>
            )}
            <div className="mt-1 text-[10px] text-muted-foreground">₹{activeOriginalPrice} − ₹{activeSavings} = ₹{activeDiscountedPrice}</div>
            {outOfStock && (
              <div className="mt-2 text-[10px] uppercase tracking-widest font-bold text-red-500">Out of Stock</div>
            )}
          </div>
        </div>
        <p className="mt-2 font-serif text-lg text-olive/80 leading-tight">{combo.headline}</p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{combo.description}</p>
        {(combo.proofLine || combo.valueLine) && (
          <p className="mt-3 text-xs font-medium text-foreground/70 border-l-2 border-olive/20 pl-3">
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
        {items.map((item, idx) => {
          return (
            <div 
              key={idx} 
              className="rounded-md border border-border bg-background p-3 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 font-mono">{idx + 1}.</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Size: {selectedSizes[idx] || 'S'} | Color: {selectedColors[idx] || 'Black'}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Color</div>
                  <div className="flex flex-wrap gap-1.5">
                    {getProductColors(idx).map(color => {
                      const isColorSelected = selectedColors[idx] === color;
                      const isOos = isColorOutOfStockForSelectedSize(idx, color);
                      return (
                        <button 
                          key={color}
                          type="button" 
                          onClick={() => handleColorSelect(idx, color)}
                          className={`rounded-full border px-2.5 py-1 text-[11px] transition-all duration-150 cursor-pointer ${
                            isColorSelected 
                              ? 'border-foreground bg-foreground text-background font-bold shadow-sm' 
                              : 'border-border hover:border-foreground/50 text-foreground/70 bg-card'
                          } ${isOos ? 'opacity-40 line-through border-dashed' : ''}`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Size</div>
                  <div className="flex flex-wrap gap-2 items-end">
                    {getProductSizes(idx).map(size => {
                      const isSizeSelected = selectedSizes[idx] === size;
                      const isOos = isSizeOutOfStockForSelectedColor(idx, size);
                      const sizeStock = getSizeStockForSelectedColor(idx, size);
                      return (
                        <div key={size} className="flex flex-col items-center gap-0.5">
                          <span className="text-[9px] font-medium text-muted-foreground/80 leading-none">
                            {isOos ? 'OOS' : `${sizeStock}`}
                          </span>
                          <button
                            type="button" 
                            onClick={() => handleSizeSelect(idx, size)}
                            className={`h-7 min-w-8 rounded-md border px-1.5 text-[11px] transition-all duration-150 cursor-pointer ${
                              isSizeSelected 
                                ? 'border-foreground bg-foreground text-background font-bold shadow-sm' 
                                : 'border-border hover:border-foreground/50 text-foreground/70 bg-card'
                            } ${isOos ? 'opacity-40 line-through border-dashed' : ''}`}
                          >
                            {size}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button 
          type="button" 
          disabled={outOfStock} 
          onClick={handleAddCombo} 
          className="h-11 rounded-md border border-foreground bg-background text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-foreground cursor-pointer"
        >
          {outOfStock ? 'Out of Stock' : 'Add Combo'}
        </button>
        <button 
          type="button" 
          disabled={outOfStock} 
          onClick={handleBuyCombo} 
          className="h-11 rounded-md bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {outOfStock ? 'Out of Stock' : 'Buy Now'}
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
