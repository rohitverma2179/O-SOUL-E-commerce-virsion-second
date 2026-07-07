import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Shield, Share2, Info, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-2xl py-14 md:py-24">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-bold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className="mb-12 border-b border-border/40 pb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-olive font-bold">Privacy</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground italic leading-relaxed text-sm md:text-base">
            How we protect, collect, and use your personal information at O’Soul.
          </p>
        </header>

        {/* Introductory Notice */}
        <div className="rounded-2xl border border-olive/20 bg-olive/5 p-6 mb-12 text-sm md:text-base text-foreground/80 italic leading-relaxed">
          At O'Soul, your privacy is paramount to us. By accessing our services and purchasing our products, you consent to the terms outlined in this policy.
        </div>

        {/* Sections */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl italic text-foreground flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive font-sans">1</span>
              Information Collection
            </h2>
            <div className="pl-9 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Identifiers:</strong> Name, email address, shipping address, and phone number.</li>
                <li><strong>Transaction Data:</strong> Details of products purchased and payment method used.</li>
              </ul>
              <div className="flex items-start gap-2.5 bg-secondary/30 p-4 rounded-xl border border-border/50 text-xs mt-3 text-muted-foreground">
                <Info className="h-4.5 w-4.5 text-olive shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> We do not store full credit card details; these are processed securely by third-party payment gateways (Razorpay).
                </span>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl italic text-foreground flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive font-sans">2</span>
              Use of Information
            </h2>
            <div className="pl-9 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p>Your data is used solely for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Order Fulfillment:</strong> To process and ship your order, and to manage returns and exchanges.</li>
                <li><strong>Communication:</strong> To send you status updates and respond to all inquiries and claims.</li>
                <li><strong>Service Improvement:</strong> To analyze customer feedback and improve our offerings.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl italic text-foreground flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive font-sans">3</span>
              Data Protection and Sharing
            </h2>
            <div className="pl-9 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <ul className="list-disc pl-5 space-y-3">
                <li>We implement security measures to maintain the safety of your personal information.</li>
                <li>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.</li>
                <li>Data is shared only with trusted third parties (e.g., shipping carriers like Shipmozo) necessary to complete our services, under strict confidentiality agreements.</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
