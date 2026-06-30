import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, Minus, Plus, ShoppingBag, Trash2, User, Heart, 
  MapPin, ClipboardList, CheckCircle2, ChevronRight, Copy, 
  ExternalLink, FileText, Calendar, Truck, Edit, AlertCircle, 
  X, Check, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../lib/api';

const UserDashboard = () => {
  const { user, logout, checkAuth } = useAuth();
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, addToCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', 'wishlist', 'bag', 'profile'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Address form modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null means adding new address
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'India',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    addressType: 'shipping', // 'shipping' or 'billing'
    isDefault: false
  });

  // Invoice modal state
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    setLoadingDashboard(true);
    setErrorMsg('');
    try {
      // 1. Fetch Orders
      const orderRes = await fetch(`${API_BASE_URL}/users/orders`, { credentials: 'include' });
      const orderJson = await orderRes.json();
      if (orderJson.success) setOrders(orderJson.data);

      // 2. Fetch Addresses
      const addrRes = await fetch(`${API_BASE_URL}/users/addresses`, { credentials: 'include' });
      const addrJson = await addrRes.json();
      if (addrJson.success) setAddresses(addrJson.data);

      // 3. Fetch Wishlist
      const wishlistRes = await fetch(`${API_BASE_URL}/users/wishlist`, { credentials: 'include' });
      const wishlistJson = await wishlistRes.json();
      if (wishlistJson.success) setWishlist(wishlistJson.data);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setErrorMsg('Failed to load profile details. Please try again.');
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Address Actions
  const openAddAddressModal = (type = 'shipping') => {
    setEditingAddress(null);
    setAddressForm({
      firstName: user?.fullName?.split(' ')[0] || '',
      lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
      companyName: '',
      country: 'India',
      address: '',
      apartment: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      addressType: type,
      isDefault: false
    });
    setShowAddressModal(true);
  };

  const openEditAddressModal = (address) => {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      companyName: address.companyName || '',
      country: address.country || 'India',
      address: address.address || '',
      apartment: address.apartment || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      phone: address.phone || '',
      addressType: address.addressType || 'shipping',
      isDefault: address.isDefault || false
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const url = editingAddress 
        ? `${API_BASE_URL}/users/addresses/${editingAddress._id}`
        : `${API_BASE_URL}/users/addresses`;
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addressForm)
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
        setShowAddressModal(false);
        checkAuth(); // Refresh local auth user state containing address
      } else {
        alert(data.message || 'Error saving address.');
      }
    } catch (err) {
      alert('Network error. Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
        checkAuth();
      } else {
        alert(data.message || 'Error deleting address.');
      }
    } catch (err) {
      alert('Network error. Failed to delete address.');
    }
  };

  // Wishlist Actions
  const handleRemoveWishlist = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/wishlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId })
      });
      const data = await response.json();
      if (data.success) {
        setWishlist(prev => prev.filter(item => item._id !== productId));
        checkAuth();
      }
    } catch (err) {
      console.error('Error modifying wishlist:', err);
    }
  };

  const handleMoveToCart = (product) => {
    addToCart({ ...product, id: product._id }, product.sizes?.[0] || 'M', product.colors?.[0] || 'Black');
    handleRemoveWishlist(product._id);
  };

  // Invoice generator UI/popup
  const handleInvoiceClick = (order) => {
    setActiveInvoice(order);
  };

  const initials = user?.fullName?.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';

  const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  return (
    <div className="container-osoul py-12 md:py-16 bg-background min-h-screen">
      <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">My Account</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Dashboard</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Left: Sidebar Tabs */}
        <aside className="h-fit rounded-xl border border-border bg-card p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-olive text-lg font-bold text-ivory">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-lg truncate">{user?.fullName}</h2>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'orders', label: 'Order History', icon: ClipboardList },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'wishlist', label: 'My Wishlist', icon: Heart },
              { id: 'bag', label: `Shopping Bag (${cartCount})`, icon: ShoppingBag },
              { id: 'profile', label: 'Profile Settings', icon: User }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-foreground text-background shadow-md' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <button 
            onClick={handleLogout} 
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border text-xs font-bold uppercase tracking-wider transition hover:bg-secondary hover:text-clay pt-0.5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        {/* Right: Tab Content */}
        <main className="space-y-6">
          {loadingDashboard ? (
            <div className="rounded-xl border border-border bg-card py-20 text-center text-sm text-muted-foreground italic">
              Loading dashboard details...
            </div>
          ) : errorMsg ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-clay space-y-4">
              <AlertCircle className="h-8 w-8 mx-auto" />
              <p className="text-sm font-medium">{errorMsg}</p>
              <button onClick={fetchDashboardData} className="px-5 h-10 bg-foreground text-background text-xs uppercase tracking-widest font-semibold rounded-md">Retry</button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              
              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl">Order History</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Track and manage your recent orders.</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-16 text-center border-t border-dashed border-border mt-6">
                      <p className="text-sm italic text-muted-foreground">You haven't placed any orders yet.</p>
                      <Link to="/shop" className="mt-5 inline-flex h-11 items-center rounded-md bg-foreground px-6 text-sm font-medium text-background">Shop Our Collection</Link>
                    </div>
                  ) : (
                    <div className="space-y-6 mt-6">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                          {/* Order Header */}
                          <div className="bg-secondary/20 border-b border-border p-4 md:p-6 flex flex-col md:flex-row justify-between gap-4 text-xs font-semibold text-muted-foreground">
                            <div className="grid grid-cols-2 md:flex md:gap-8 gap-y-2">
                              <div>
                                <p className="uppercase tracking-widest text-[9px]">Order Placed</p>
                                <p className="text-foreground mt-1 font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                              </div>
                              <div>
                                <p className="uppercase tracking-widest text-[9px]">Total</p>
                                <p className="text-foreground mt-1 font-medium">₹{order.totalAmount}</p>
                              </div>
                              <div>
                                <p className="uppercase tracking-widest text-[9px]">Order ID</p>
                                <p className="text-foreground mt-1 font-mono tracking-normal">{order.razorpayOrderId}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                                order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                order.status === 'failed' ? 'bg-rose-100 text-rose-800' :
                                'bg-zinc-100 text-zinc-800'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  order.status === 'paid' ? 'bg-emerald-600' :
                                  order.status === 'failed' ? 'bg-rose-600' :
                                  'bg-zinc-500'
                                }`}></span>
                                {order.status}
                              </span>
                              <button 
                                onClick={() => handleInvoiceClick(order)}
                                className="flex items-center gap-1 hover:text-foreground text-olive border border-border/80 rounded px-2.5 py-1 bg-background transition"
                              >
                                <FileText className="h-3 w-3" /> Invoice
                              </button>
                            </div>
                          </div>

                          {/* Order Body */}
                          <div className="p-4 md:p-6 divide-y divide-border/60">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-start justify-between">
                                <div className="flex gap-4">
                                  <div className="h-16 w-14 rounded bg-secondary flex-shrink-0 flex items-center justify-center text-xs font-bold font-serif shadow-inner">
                                    {item.name[0]}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-foreground">{item.name}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{item.size} · {item.color}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <div className="text-sm font-semibold">₹{item.price * item.quantity}</div>
                              </div>
                            ))}
                          </div>

                          {/* Tracking & Shipping Details */}
                          <div className="border-t border-border/60 bg-secondary/10 p-4 md:p-6 flex flex-col md:flex-row justify-between gap-6 text-xs">
                            <div>
                              <h5 className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Deliver To</h5>
                              <p className="text-foreground font-medium mt-1">
                                {order.shippingDetails.firstName} {order.shippingDetails.lastName}<br />
                                {order.shippingDetails.address}
                                {order.shippingDetails.apartment && <>, {order.shippingDetails.apartment}</>}, {order.shippingDetails.city} - {order.shippingDetails.pincode}
                              </p>
                            </div>
                            <div className="min-w-[200px]">
                              <h5 className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Delivery Status</h5>
                              {order.trackingNumber ? (
                                <div className="mt-1 space-y-2">
                                  <p className="text-foreground font-semibold flex items-center gap-1.5">
                                    <Truck className="h-3.5 w-3.5 text-olive shrink-0" />
                                    Shipped via {order.carrier || 'Express'}
                                  </p>
                                  <div className="flex gap-2 items-center">
                                    <span className="font-mono bg-background border border-border px-2 py-0.5 rounded text-[11px] text-foreground">{order.trackingNumber}</span>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(order.trackingNumber);
                                        alert('Tracking code copied!');
                                      }}
                                      className="hover:text-foreground text-muted-foreground"
                                      title="Copy Tracking Number"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-muted-foreground italic mt-1 font-medium">Pending shipment. Tracking code will be available soon.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* TAB: SAVED ADDRESSES */}
              {activeTab === 'addresses' && (
                <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
                    <div>
                      <h2 className="font-serif text-2xl">Address Book</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Manage your billing and shipping locations.</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openAddAddressModal('shipping')}
                        className="h-10 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-md px-4 hover:bg-foreground/90 transition shadow-sm"
                      >
                        + Add Shipping Address
                      </button>
                      <button 
                        onClick={() => openAddAddressModal('billing')}
                        className="h-10 border border-border text-foreground hover:bg-secondary/40 text-xs font-bold uppercase tracking-widest rounded-md px-4 transition"
                      >
                        + Add Billing Address
                      </button>
                    </div>
                  </div>

                  {/* SHIPPING ADDRESSES */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-2">
                      <Truck className="h-4 w-4" /> Shipping Addresses
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {addresses.filter(a => a.addressType === 'shipping').length === 0 ? (
                        <div className="sm:col-span-2 border border-dashed border-border rounded-xl p-8 text-center text-sm text-muted-foreground italic">
                          No shipping addresses saved. Click "+ Add Shipping Address" to save one.
                        </div>
                      ) : (
                        addresses.filter(a => a.addressType === 'shipping').map((addr) => (
                          <div key={addr._id} className="border border-border rounded-xl p-5 bg-background shadow-sm hover:border-olive/40 relative flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                                  {addr.firstName} {addr.lastName}
                                </span>
                                {addr.isDefault && (
                                  <span className="bg-olive/10 text-olive text-[8px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                                {addr.companyName && <>{addr.companyName}<br /></>}
                                {addr.address}
                                {addr.apartment && <>, {addr.apartment}</>}<br />
                                {addr.city}, {addr.state} - {addr.pincode}<br />
                                {addr.country}
                              </p>
                              <p className="text-xs text-muted-foreground mt-3 font-semibold">Phone: {addr.phone}</p>
                            </div>
                            <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-border/50 text-[10px] uppercase font-bold tracking-widest">
                              <button onClick={() => openEditAddressModal(addr)} className="text-olive hover:text-clay flex items-center gap-1">
                                <Edit className="h-3 w-3" /> Edit
                              </button>
                              <button onClick={() => handleDeleteAddress(addr._id)} className="text-muted-foreground hover:text-clay flex items-center gap-1">
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* BILLING ADDRESSES */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Billing Addresses
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {addresses.filter(a => a.addressType === 'billing').length === 0 ? (
                        <div className="sm:col-span-2 border border-dashed border-border rounded-xl p-8 text-center text-sm text-muted-foreground italic">
                          No billing addresses saved. Click "+ Add Billing Address" to save one.
                        </div>
                      ) : (
                        addresses.filter(a => a.addressType === 'billing').map((addr) => (
                          <div key={addr._id} className="border border-border rounded-xl p-5 bg-background shadow-sm hover:border-olive/40 relative flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                                  {addr.firstName} {addr.lastName}
                                </span>
                                {addr.isDefault && (
                                  <span className="bg-olive/10 text-olive text-[8px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                                {addr.companyName && <>{addr.companyName}<br /></>}
                                {addr.address}
                                {addr.apartment && <>, {addr.apartment}</>}<br />
                                {addr.city}, {addr.state} - {addr.pincode}<br />
                                {addr.country}
                              </p>
                              <p className="text-xs text-muted-foreground mt-3 font-semibold">Phone: {addr.phone}</p>
                            </div>
                            <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-border/50 text-[10px] uppercase font-bold tracking-widest">
                              <button onClick={() => openEditAddressModal(addr)} className="text-olive hover:text-clay flex items-center gap-1">
                                <Edit className="h-3 w-3" /> Edit
                              </button>
                              <button onClick={() => handleDeleteAddress(addr._id)} className="text-muted-foreground hover:text-clay flex items-center gap-1">
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* TAB: WISHLIST */}
              {activeTab === 'wishlist' && (
                <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl">My Wishlist</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Save your favorite pieces for later.</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-16 text-center border-t border-dashed border-border mt-6">
                      <p className="text-sm italic text-muted-foreground font-medium">Your wishlist is empty.</p>
                      <Link to="/shop" className="mt-5 inline-block text-xs uppercase tracking-widest font-bold underline underline-offset-4 text-olive hover:text-clay">Discover Products</Link>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-6">
                      {wishlist.map((item) => (
                        <div key={item._id} className="border border-border rounded-xl overflow-hidden bg-background shadow-sm hover:shadow-md transition flex flex-col justify-between">
                          <div className="relative aspect-[4/5] bg-secondary shrink-0">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            )}
                            <button 
                              onClick={() => handleRemoveWishlist(item._id)} 
                              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center text-clay hover:bg-secondary hover:text-clay/80 shadow transition"
                              title="Remove from Wishlist"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <Link to={`/product/${item.slug}`} className="font-serif text-base text-foreground hover:text-olive transition block truncate">
                                {item.name}
                              </Link>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{item.type} · {item.category}</p>
                              <p className="text-sm font-semibold mt-2">₹{item.price}</p>
                            </div>
                            
                            <button 
                              onClick={() => handleMoveToCart(item)}
                              className="h-10 w-full bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-md hover:bg-foreground/90 transition flex items-center justify-center gap-2 shadow"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" /> Move to Bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* TAB: BAG (CART) */}
              {activeTab === 'bag' && (
                <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl">Your Bag</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Review items ready for checkout.</p>
                  </div>

                  {!cartItems.length ? (
                    <div className="py-16 text-center border-t border-dashed border-border mt-6">
                      <p className="text-sm italic text-muted-foreground">Your bag is empty.</p>
                      <Link to="/shop" className="mt-5 inline-flex h-11 items-center rounded-md bg-foreground px-6 text-sm font-medium text-background">Explore the shop</Link>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <div className="divide-y divide-border">
                        {cartItems.map((item, index) => (
                          <article key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-secondary shadow-sm">
                              {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                              <div>
                                <div className="flex justify-between gap-4">
                                  <h3 className="font-serif text-lg text-foreground leading-tight">{item.name}</h3>
                                  <span className="font-semibold text-sm">₹{item.price * item.quantity}</span>
                                </div>
                                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.color || 'Default'} · {item.size || 'One size'}</p>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center rounded-md border border-border">
                                  <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button>
                                  <span className="min-w-8 text-center text-xs font-semibold">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Increase quantity"><Plus className="h-3 w-3" /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-clay transition"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                        <span className="font-medium text-sm uppercase tracking-widest text-muted-foreground">Subtotal</span>
                        <span className="font-serif text-2xl font-semibold">₹{cartTotal}</span>
                      </div>
                      <Link to="/checkout" className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-foreground text-sm font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition shadow-lg">Proceed to checkout</Link>
                    </div>
                  )}
                </section>
              )}

              {/* TAB: PROFILE SETTINGS */}
              {activeTab === 'profile' && (
                <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl">Profile Settings</h2>
                    <p className="mt-1 text-sm text-muted-foreground">View your current account details.</p>
                  </div>

                  <div className="mt-6 border-t border-border pt-6 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2 text-sm">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Full Name</p>
                        <p className="text-foreground font-semibold text-base">{user?.fullName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Email Address</p>
                        <p className="text-foreground font-semibold text-base">{user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Account Status</p>
                        <p className="capitalize text-foreground font-semibold text-base flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                          {user?.status}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Email Verification</p>
                        <p className="text-foreground font-semibold text-base flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          {user?.isEmailVerified ? 'Verified' : 'Pending Status'}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

            </div>
          )}
        </main>
      </div>

      {/* ADDRESS MODAL (ADD / EDIT) */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/10">
              <h3 className="font-serif text-xl font-semibold">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => setShowAddressModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition">
                <X className="h-4 w-4" />
              </button>
            </header>

            <form onSubmit={handleSaveAddress} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Address Type */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Address Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddressForm(f => ({ ...f, addressType: 'shipping' }))}
                    className={`h-11 rounded-md border text-xs font-bold uppercase tracking-widest transition ${
                      addressForm.addressType === 'shipping' 
                        ? 'border-foreground bg-foreground text-background' 
                        : 'border-border hover:border-foreground/30 bg-background text-foreground'
                    }`}
                  >
                    Shipping Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressForm(f => ({ ...f, addressType: 'billing' }))}
                    className={`h-11 rounded-md border text-xs font-bold uppercase tracking-widest transition ${
                      addressForm.addressType === 'billing' 
                        ? 'border-foreground bg-foreground text-background' 
                        : 'border-border hover:border-foreground/30 bg-background text-foreground'
                    }`}
                  >
                    Billing Address
                  </button>
                </div>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Company (optional)</label>
                <input
                  type="text"
                  value={addressForm.companyName}
                  onChange={(e) => setAddressForm(f => ({ ...f, companyName: e.target.value }))}
                  className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                />
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Country / Region *</label>
                <select
                  required
                  value={addressForm.country}
                  onChange={(e) => setAddressForm(f => ({ ...f, country: e.target.value }))}
                  className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                >
                  <option value="India">India</option>
                </select>
              </div>

              {/* Street Address & Apartment */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House number and street name"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm(f => ({ ...f, apartment: e.target.value }))}
                  className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                />
              </div>

              {/* City & State & Pincode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">State *</label>
                  <select
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm(f => ({ ...f, state: e.target.value }))}
                    className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                  >
                    <option value="">Select State</option>
                    {statesOfIndia.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm(f => ({ ...f, pincode: e.target.value }))}
                    className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full h-11 border border-border rounded-md px-3 text-sm focus:border-olive focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Set Default */}
              <label className="flex items-center gap-3 pt-2 cursor-pointer text-xs font-semibold text-foreground uppercase tracking-wider select-none">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm(f => ({ ...f, isDefault: e.target.checked }))}
                  className="h-4.5 w-4.5 rounded border-border text-olive focus:ring-olive"
                />
                Set as default {addressForm.addressType} address
              </label>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="h-11 px-5 border border-border hover:bg-secondary text-xs font-bold uppercase tracking-widest rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-md hover:bg-foreground/90 transition shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/10">
              <span className="font-serif text-lg font-bold flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-olive shrink-0" /> O'Soul Official Invoice
              </span>
              <button onClick={() => setActiveInvoice(null)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-sm leading-relaxed" id="invoice-content">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-3xl italic tracking-tight font-medium text-olive">O'Soul</h3>
                  <p className="text-xs text-muted-foreground mt-1">Premium Comfort Clothing Inc.</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">support@osoul.com | +91 99999 99999</p>
                </div>
                <div className="text-right">
                  <h4 className="text-xl font-serif">INVOICE</h4>
                  <p className="text-xs text-muted-foreground mt-1">Invoice No: INV-{activeInvoice._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">Date: {new Date(activeInvoice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Billing and Shipping Info */}
              <div className="grid gap-6 sm:grid-cols-2 border-t border-b border-border/80 py-6">
                <div>
                  <h5 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Billed To:</h5>
                  <p className="font-medium text-foreground">
                    {activeInvoice.shippingDetails.firstName} {activeInvoice.shippingDetails.lastName}<br />
                    {activeInvoice.shippingDetails.email}<br />
                    {activeInvoice.shippingDetails.phone}
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Shipped To:</h5>
                  <p className="font-medium text-foreground">
                    {activeInvoice.shippingDetails.firstName} {activeInvoice.shippingDetails.lastName}<br />
                    {activeInvoice.shippingDetails.companyName && <>{activeInvoice.shippingDetails.companyName}<br /></>}
                    {activeInvoice.shippingDetails.address}
                    {activeInvoice.shippingDetails.apartment && <>, {activeInvoice.shippingDetails.apartment}</>}<br />
                    {activeInvoice.shippingDetails.city}, {activeInvoice.shippingDetails.state} - {activeInvoice.shippingDetails.pincode}<br />
                    {activeInvoice.shippingDetails.country}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h5 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Items Ordered</h5>
                <div className="border border-border/80 rounded-xl overflow-hidden shadow-inner">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-border/80 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        <th className="p-4">Item Name</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {activeInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-4 font-semibold text-foreground">
                            {item.name}
                            <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{item.size} · {item.color}</span>
                          </td>
                          <td className="p-4 text-center font-medium text-foreground">{item.quantity}</td>
                          <td className="p-4 text-right font-medium text-foreground">₹{item.price}</td>
                          <td className="p-4 text-right font-semibold text-foreground">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary and Notes */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 text-xs">
                <div className="max-w-xs space-y-1">
                  <h5 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Payment Details</h5>
                  <p className="text-muted-foreground italic leading-relaxed">
                    Paid via Razorpay Online Payment Gateway.<br />
                    Order Ref: {activeInvoice.razorpayOrderId}<br />
                    Payment Ref: {activeInvoice.razorpayPaymentId || 'N/A'}
                  </p>
                </div>
                <div className="w-full sm:w-[240px] space-y-2 text-right">
                  <div className="flex justify-between border-b border-border/40 pb-2 text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{activeInvoice.totalAmount}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2 text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-olive italic font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-1">
                    <span className="font-serif">Grand Total</span>
                    <span>₹{activeInvoice.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/10">
              <button 
                onClick={() => {
                  window.print();
                }}
                className="h-11 px-5 border border-border hover:bg-secondary text-xs font-bold uppercase tracking-widest rounded-md transition flex items-center gap-1.5"
              >
                <FileText className="h-4 w-4" /> Print Invoice
              </button>
              <button 
                onClick={() => setActiveInvoice(null)}
                className="h-11 px-6 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-md hover:bg-foreground/90 transition shadow"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
