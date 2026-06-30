import React, { useState, useEffect } from 'react';
import { 
  Search, Package, Truck, MapPin, CheckCircle2, 
  ArrowLeft, Copy, Check, Loader2, Calendar, AlertCircle 
} from 'lucide-react';
import { API_BASE_URL } from '../lib/api';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [orderId, setOrderId] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId || !emailOrPhone) return;

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/payments/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          emailOrPhone,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Unable to track order. Please verify your details.');
      }

      setTrackingData(resData.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingNumber = () => {
    if (!trackingData?.trackingNumber) return;
    navigator.clipboard.writeText(trackingData.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format date nicely
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-3xl py-14 md:py-24">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Logistics & Tracking</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl italic tracking-tight">Track your order.</h1>
          <p className="mt-4 text-base text-muted-foreground italic leading-relaxed max-w-md mx-auto">
            Enter your order details below to see where your O'Soul shipment is right now.
          </p>
        </header>

        {/* Search form / Search details split */}
        {!trackingData ? (
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
            <form className="space-y-6" onSubmit={handleTrack}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Order Reference / ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. rzp_live_... or order ID" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm focus:border-olive focus:outline-none transition-colors italic"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email or Phone</label>
                  <input 
                    type="text" 
                    placeholder="Used at checkout" 
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm focus:border-olive focus:outline-none transition-colors italic"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-clay bg-clay/5 border border-clay/10 p-3.5 rounded-md text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-md bg-foreground text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Locating Shipment...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Track Order →
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Live Tracking Detail Screen */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setTrackingData(null)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Track another package
              </button>
              <Link 
                to="/account" 
                className="text-xs uppercase tracking-widest text-olive hover:underline font-bold"
              >
                Go to Dashboard
              </Link>
            </div>

            {/* Shipment Summary Panel */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Order Status</span>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-olive/10 text-olive">
                      <span className="h-1.5 w-1.5 rounded-full bg-olive animate-pulse"></span>
                      {trackingData.trackingInfo?.currentStatus || trackingData.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Carrier Partner</span>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{trackingData.carrier || 'Express Courier'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Tracking ID / AWB</span>
                    {trackingData.trackingNumber ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-bold text-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                          {trackingData.trackingNumber}
                        </span>
                        <button 
                          onClick={copyTrackingNumber} 
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy AWB Code"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic mt-0.5">Allocating soon</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8 space-y-3">
                <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Delivery Information
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your package is processed via our shipping partner **Shipmozo**. Tracking updates are updated in real-time as the package proceeds through transit hubs.
                </p>
                <p className="text-xs text-olive italic font-semibold">
                  * Average delivery takes 3-5 business days from shipment.
                </p>
              </div>
            </div>

            {/* Tracking Steps / Stepper Timeline */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <h2 className="font-serif text-xl mb-8 border-b border-border pb-4">Transit Timeline</h2>
              
              <div className="relative pl-6 md:pl-8 border-l border-border space-y-10 py-2 ml-4">
                
                {trackingData.trackingInfo?.events && trackingData.trackingInfo.events.length > 0 ? (
                  trackingData.trackingInfo.events.map((event, idx) => {
                    const isLatest = idx === 0;
                    return (
                      <div key={idx} className="relative animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[31px] md:-left-[39px] top-1.5 h-4 w-4 rounded-full border-4 border-card flex items-center justify-center ${
                          isLatest ? 'bg-olive scale-125' : 'bg-border'
                        }`}>
                          {isLatest && <span className="absolute h-2 w-2 rounded-full bg-ivory animate-ping"></span>}
                        </div>

                        {/* Event Content */}
                        <div className="grid gap-2 md:grid-cols-[1fr_150px] items-start">
                          <div>
                            <h4 className={`text-sm font-bold uppercase tracking-wider ${isLatest ? 'text-olive' : 'text-foreground'}`}>
                              {event.status}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                            {event.location && (
                              <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 mt-1.5">
                                <MapPin className="h-3 w-3 text-clay shrink-0" />
                                {event.location}
                              </p>
                            )}
                          </div>
                          <div className="text-right md:text-right text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                            {formatDate(event.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="relative pl-4 py-2 italic text-muted-foreground text-xs">
                    No tracking events registered yet. Check back in a few hours.
                  </div>
                )}

              </div>
            </div>

            {/* Support Callout */}
            <div className="rounded-xl bg-secondary/20 border border-border p-6 text-center space-y-3">
              <h4 className="font-serif text-base font-semibold">Need help with your delivery?</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                If you have questions about your delivery address, package contents, or general delay, please contact our support team.
              </p>
              <div className="pt-2">
                <Link to="/support" className="text-xs uppercase tracking-widest font-bold text-olive hover:text-clay transition-colors underline">
                  Contact O'Soul Support
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
