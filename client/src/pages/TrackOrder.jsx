import React, { useState } from 'react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for tracking can be added here
    alert(`Tracking order: ${orderId}`);
  };

  return (
    <div className="container-osoul max-w-xl py-14">
      <h1 className="font-serif text-4xl italic">Track your order</h1>
      <p className="mt-4 text-sm text-muted-foreground italic leading-relaxed">
        Enter your O'Soul order ID (sent via email/SMS) to see the current status of your comfort fit.
      </p>
      
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input 
          type="text"
          placeholder="OS12345678" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm focus:border-olive focus:outline-none transition-colors"
          required
        />
        <button 
          type="submit"
          className="h-12 rounded-md bg-foreground px-8 text-xs font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all whitespace-nowrap"
        >
          Track Order
        </button>
      </form>

      <div className="mt-12 bg-secondary/10 p-8 rounded-2xl border border-border">
        <h3 className="font-serif text-xl mb-4 italic">Tracking Info</h3>
        <ul className="space-y-4 text-sm text-muted-foreground italic leading-relaxed">
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>Orders are usually dispatched within 24-48 hours.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>Delivery takes 3-5 business days depending on your location.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-olive">·</span>
            <span>You'll receive a WhatsApp/SMS once your order is out for delivery.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrackOrder;
