import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/api';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle2, ShoppingBag, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'India',
    address: '',
    apartment: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    phone: ''
  });

  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Auto-fill user email & name if logged in
  useEffect(() => {
    if (user) {
      const names = user.fullName ? user.fullName.split(' ') : ['', ''];
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  // Dynamically load Razorpay SDK script
  useEffect(() => {
    if (window.Razorpay) {
      setIsSdkLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsSdkLoaded(true);
    script.onerror = () => console.error('Razorpay SDK failed to load.');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    const { email, firstName, lastName, country, address, city, state, pincode, phone } = formData;
    if (!email || !firstName || !lastName || !country || !address || !city || !state || !pincode || !phone) {
      alert('Please fill in all the billing and contact details.');
      return;
    }

    if (!isSdkLoaded) {
      alert('Payment system is initializing, please try again in a moment.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on Express backend
      const response = await fetch(`${API_BASE_URL}/payments/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: cartTotal ,
          // amount: cartTotal,
          items: cartItems,
          shippingDetails: formData
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to initialize checkout');
      }

      const { key, amount, currency, orderId } = resData.data;

      // 2. Open Razorpay checkout modal
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "O'Soul",
        description: "Purchase Checkout",
        order_id: orderId,
        handler: async function (paymentRes) {
          try {
            setIsProcessing(true);
            
            // 3. Verify signature on backend
            const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || 'Verification failed');
            }

            // Clear client-side cart
            clearCart();
            
            // Set order success payload to show success UI
            setOrderSuccess(verifyData.data);
          } catch (err) {
            alert('Verification Error: ' + err.message);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phone
        },
        theme: {
          color: '#000000'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Checkout initialization error: ' + err.message);
      setIsProcessing(false);
    }
  };

  // If transaction completed successfully, show elegant success screen
  if (orderSuccess) {
    return (
      <div className="container-osoul py-12 md:py-24 max-w-2xl mx-auto">
        <div className="bg-secondary/20 border border-border/80 rounded-2xl p-8 md:p-12 text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-3">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">Order Placed Successfully!</h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Thank you for shopping with us. Your order details are shared below and confirmation has been sent to your email.
            </p>
          </div>

          <div className="border-y border-border/60 py-6 text-left space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Order Reference</span>
              <span className="font-mono font-medium text-foreground">{orderSuccess.razorpayOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Order Date</span>
              <span className="font-medium text-foreground">{new Date(orderSuccess.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground flex items-center gap-2 mt-0.5"><MapPin className="w-4 h-4" /> Delivery Address</span>
              <span className="font-medium text-foreground text-right max-w-[240px] text-xs leading-relaxed">
                {orderSuccess.shippingDetails.firstName} {orderSuccess.shippingDetails.lastName}<br />
                {orderSuccess.shippingDetails.companyName && <>{orderSuccess.shippingDetails.companyName}<br /></>}
                {orderSuccess.shippingDetails.address}
                {orderSuccess.shippingDetails.apartment && <>, {orderSuccess.shippingDetails.apartment}</>}<br />
                {orderSuccess.shippingDetails.city}, {orderSuccess.shippingDetails.state} - {orderSuccess.shippingDetails.pincode}<br />
                {orderSuccess.shippingDetails.country}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-dashed border-border/60 text-base font-semibold">
              <span>Paid Amount</span>
              <span className="text-foreground">₹{orderSuccess.totalAmount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link 
              to="/account" 
              className="flex items-center justify-center px-6 h-12 bg-foreground text-background font-semibold rounded-md hover:bg-foreground/90 transition"
            >
              Go to Account
            </Link>
            <Link 
              to="/shop" 
              className="flex items-center justify-center px-6 h-12 border border-border text-foreground hover:bg-secondary/40 font-semibold rounded-md transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="font-serif text-3xl">Billing Details</h1>
          </div>

          <form onSubmit={handleProceedToPayment} className="space-y-6">
            <div className="space-y-5">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    First name <span className="text-clay font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Last name <span className="text-clay font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Company name (optional)
                </label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                />
              </div>

              {/* Country / Region */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Country / Region <span className="text-clay font-bold">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition appearance-none cursor-pointer pr-10"
                  >
                    <option value="India">India</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Street address <span className="text-clay font-bold">*</span>
                </label>
                <input 
                  type="text" 
                  name="address"
                  placeholder="House number and street name"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                />
                <input 
                  type="text" 
                  name="apartment"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                />
              </div>

              {/* Town / City */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Town / City <span className="text-clay font-bold">*</span>
                </label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                />
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  State <span className="text-clay font-bold">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition appearance-none cursor-pointer pr-10"
                  >
                    <option value="">Select a state</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  PIN Code <span className="text-clay font-bold">*</span>
                </label>
                <input 
                  type="text" 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Phone <span className="text-clay font-bold">*</span>
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Email address <span className="text-clay font-bold">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground/50 transition" 
                />
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isProcessing}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-md bg-foreground text-sm font-semibold text-background hover:bg-foreground/90 transition-all disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                {/* {isProcessing ? "Processing..." : `Proceed to Payment (₹${cartTotal + 50})`} */}
                {isProcessing ? "Processing..." : `Proceed to Payment (₹${cartTotal})`}
              </button>
              <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Secure Payment</span>
                {/* <span className="flex items-center gap-1.5"><Truck className="h-3 w-3" /> Free Shipping</span> */}
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
                <div className={`h-16 w-14 rounded bg-secondary flex-shrink-0 ${item.image ? 'overflow-hidden' : `tile-${item.tile}`} relative`}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                  )}
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
              <span>₹50</span>
            </div>
            <div className="flex justify-between border-t border-border/50 pt-3 text-lg font-semibold">
              <span className="font-serif">Total</span>
              {/* <span>₹{cartTotal + 50}</span> */}
              <span>₹{cartTotal }</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
