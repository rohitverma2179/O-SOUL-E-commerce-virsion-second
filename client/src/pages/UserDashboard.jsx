import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Minus, Plus, ShoppingBag, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const initials = user?.fullName?.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container-osoul py-12 md:py-16">
      <header className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">My account</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Welcome back, {user?.fullName?.split(' ')[0]}.</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-olive text-xl font-bold text-ivory">{initials}</div>
          <h2 className="mt-5 font-serif text-2xl">{user?.fullName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Account</span><span className="capitalize">{user?.status}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{user?.isEmailVerified ? 'Verified' : 'Pending'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bag items</span><span>{cartCount}</span></div>
          </div>
          <button onClick={handleLogout} className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border text-sm font-medium transition hover:bg-secondary">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <section className="rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div><h2 className="font-serif text-2xl">Your bag</h2><p className="mt-1 text-sm text-muted-foreground">Items you have added to cart.</p></div>
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>

          {!cartItems.length ? (
            <div className="py-16 text-center">
              <p className="text-sm italic text-muted-foreground">Your bag is empty.</p>
              <Link to="/shop" className="mt-5 inline-flex h-11 items-center rounded-md bg-foreground px-6 text-sm font-medium text-background">Explore the shop</Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {cartItems.map((item, index) => (
                  <article key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4 py-5">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-4"><h3 className="font-serif text-lg">{item.name}</h3><span className="font-medium">₹{item.price * item.quantity}</span></div>
                      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.color || 'Default'} · {item.size || 'One size'}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border">
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="p-2" aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button>
                          <span className="min-w-8 text-center text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="p-2" aria-label="Increase quantity"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-clay"><Trash2 className="h-3 w-3" /> Remove</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-5"><span className="font-medium">Subtotal</span><span className="font-serif text-2xl">₹{cartTotal}</span></div>
              <Link to="/checkout" className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-foreground text-sm font-medium text-background">Proceed to checkout</Link>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
