import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 transition-opacity" 
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl transition-transform md:w-[420px]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your O'Soul Bag
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground italic">Your bag is empty. Start with one piece you'll actually repeat.</p>
              <Link 
                to="/shop" 
                onClick={() => setIsCartOpen(false)}
                className="mt-5 h-10 rounded-md bg-foreground px-5 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors"
              >
                Shop The First Drop
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="flex gap-4">
                  <div className={`h-24 w-20 flex-shrink-0 overflow-hidden rounded-md tile-${item.tile} relative`}>
                    <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3 className="font-serif text-base">{item.name}</h3>
                      <p className="ml-4 text-sm">₹{item.price * item.quantity}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2rem] text-center text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-xs text-muted-foreground hover:text-clay transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-border px-5 py-6 space-y-4 bg-secondary/10">
            <div className="flex justify-between text-base font-medium">
              <p>Subtotal</p>
              <p>₹{cartTotal}</p>
            </div>
            <p className="text-xs text-muted-foreground italic">Free shipping on all comfort drops.</p>
            <div className="grid gap-3">
              <button 
                onClick={handleCheckout}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="h-12 w-full rounded-md border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                Keep Exploring
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
