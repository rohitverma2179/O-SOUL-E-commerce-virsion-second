import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  if (cartItems.length === 0) {
    return (
      <div className="container-osoul py-20 text-center">
        <h1 className="font-serif text-3xl italic">Your bag is empty.</h1>
        <Link to="/shop" className="mt-5 inline-block text-sm underline underline-offset-4">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-osoul py-10 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left: Shipping Info */}
        <div className="space-y-10">
          <div>
            <Link to="/shop" className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-3 w-3" />
              Back to Shop
            </Link>
            <h1 className="font-serif text-3xl">Shipping Details</h1>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-2">Contact Information</h3>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition"
              />
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-2">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" />
                <input type="text" placeholder="Last Name" className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" />
              </div>
              <input type="text" placeholder="Address" className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" />
                <input type="text" placeholder="Pincode" className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" />
              </div>
              <input type="tel" placeholder="Phone Number" className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" />
            </div>

            <div className="pt-8">
              <button type="button" className="flex h-14 w-full items-center justify-center gap-3 rounded-md bg-foreground text-sm font-semibold text-background hover:bg-foreground/90 transition-all">
                <CreditCard className="h-4 w-4" />
                Proceed to Payment (₹{cartTotal})
              </button>
              <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Secure Payment</span>
                <span className="flex items-center gap-1.5"><Truck className="h-3 w-3" /> Free Shipping</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-6 rounded-xl border border-border bg-secondary/30 p-6">
          <h2 className="font-serif text-xl border-b border-border/50 pb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`h-16 w-14 rounded bg-secondary flex-shrink-0 tile-${item.tile} relative`}>
                  <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.size} · {item.color}</p>
                </div>
                <div className="text-sm font-medium">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-border/50 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-olive italic">Free</span>
            </div>
            <div className="flex justify-between border-t border-border/50 pt-3 text-lg font-semibold">
              <span className="font-serif">Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
