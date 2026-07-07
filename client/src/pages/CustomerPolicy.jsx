import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Video, RefreshCw, XCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';

const CustomerPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-3xl py-14 md:py-24">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-bold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className="mb-12 border-b border-border/40 pb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-olive font-bold">O'Soul Care</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight text-foreground">Customer & Shipping Policies</h1>
          <p className="mt-4 text-muted-foreground italic leading-relaxed text-sm md:text-base">
            Please review our shipping, exchange, and cancellation protocols. We aim to keep our processes transparent and friction-free.
          </p>
        </header>

        {/* Responsible Purchasing Note */}
        <div className="rounded-2xl border border-olive/20 bg-olive/5 p-6 md:p-8 mb-12">
          <h3 className="font-serif text-lg md:text-xl italic text-olive mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-olive shrink-0" /> A Message on Responsible Purchasing
          </h3>
          <p className="text-sm md:text-base text-foreground/80 italic leading-relaxed">
            We are a small business dedicated to providing high-quality, comfortable bottom wear. We kindly ask you to choose sizes carefully and use our size guides before purchasing. Unnecessary returns or exchanges create significant operational strain and shipping waste, which ultimately makes it harder for us to serve you and other customers efficiently. We appreciate your cooperation in helping us minimize avoidable returns.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl italic text-foreground flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-bold text-olive font-sans">1</span>
              🛑 Order Cancellation Policy
            </h2>
            <div className="pl-10 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p>
                <strong>Cancellation Window:</strong> You can cancel your order only while it is in the “Order Placed” or “Processing” stage.
              </p>
              <p>
                <strong>Order Shipped:</strong> Once the order has been marked as “Shipped,” cancellation is not possible. You must follow the Return Policy below.
              </p>
              <p>
                <strong>How to Cancel:</strong> You must email us immediately at <a href="mailto:osoulclothing@gmail.com" className="text-olive hover:underline font-semibold">osoulclothing@gmail.com</a> to request cancellation.
              </p>
              <div className="rounded-lg bg-secondary/30 p-4 border border-border/50 text-xs">
                <strong>REFUND TIMELINE:</strong> If cancellation is approved, we aim to process and initiate the full refund within <strong>2 business days</strong>.
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl italic text-foreground flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-bold text-olive font-sans">2</span>
              Returns (Refunds Only) Policy
            </h2>
            <div className="pl-10 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p>
                A refund to the original payment method is accepted <strong>ONLY</strong> under two specific, proven conditions. All other issues (including color issues) are covered under the Exchange/Swap Policy in Section 3.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider not-italic">A. Eligibility for a Refund:</h4>
                <p>A refund will <strong>ONLY</strong> be issued if the return is due to one of the following:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Major Size Problem:</strong> The received item has a size variation that makes it entirely unwearable, and this problem is clearly demonstrated with evidence in the claim video. Minor fit preferences do not qualify.</li>
                  <li><strong>Manufacturing Defect:</strong> The item has a clear fault (e.g., broken zipper, ripped seam) upon arrival.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider not-italic">B. Conditions and Requirements for Refund:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Initiation Window (Strict):</strong> You must initiate the refund process within <strong>2 days</strong> of receiving your order. Requests initiated after 2 days will be rejected.</li>
                  <li><strong>Condition:</strong> Items must be unworn, unwashed, and in the original condition with all tags attached.</li>
                  <li><strong>Shipping Costs:</strong> The customer is responsible for the cost of Reverse Shipping for Major Size Problems. We cover the cost for Manufacturing Defects.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl italic text-foreground flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-bold text-olive font-sans">3</span>
              🔄 Exchanges and Swaps Policy
            </h2>
            <div className="pl-10 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p>
                Exchanges are available for color issues and size issues that do not qualify as a Major Size Problem for a refund.
              </p>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider not-italic">A. Exchange Eligibility:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Reasons:</strong> Exchanges are accepted for Size Problems and Color Problems.</li>
                  <li><strong>Initiation Window (Strict):</strong> You must initiate the exchange process within <strong>2 days</strong> of receiving your order.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider not-italic">B. Shipping Costs for Exchanges:</h4>
                <p>
                  <strong>Customer Responsibility:</strong> The customer is responsible for covering the cost of Reverse Shipping (sending the item back to us) and the cost of Reshipping the new replacement item back to them.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider not-italic text-rose-700">C. Stock Availability and Resolution (Crucial):</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Stock Check:</strong> All exchange requests are strictly subject to current stock availability.</li>
                  <li><strong>No Refund Rule:</strong> If the requested exchange item is out of stock, we will <strong>NOT</strong> issue a refund.</li>
                  <li>Instead, you must choose the following option:</li>
                  <li><strong>Product Swap:</strong> Select any other product of equal value from our current collection.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl italic text-foreground flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-bold text-olive font-sans">4</span>
              🎥 Video Proof & Claim Approval
            </h2>
            <div className="pl-10 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold uppercase tracking-wider text-xs">
                  <Video className="h-4 w-4 text-rose-700" /> Mandatory Evidence Required
                </div>
                <ul className="list-disc pl-5 space-y-2 text-rose-900">
                  <li><strong>Unboxing Video (Crucial):</strong> A clear, continuous video showing the process of opening the sealed package for the first time is mandatory for ALL claims of damage, defect, or incorrect items.</li>
                  <li><strong>Claim Video:</strong> You must also submit a separate video clearly demonstrating the specific issue (size problem, color problem, or defect).</li>
                </ul>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Submission:</strong> Both required videos must be shared with us via email at <a href="mailto:osoulclothing@gmail.com" className="text-olive hover:underline font-semibold">osoulclothing@gmail.com</a> at the time you initiate the claim.</li>
                <li><strong>Claim Review:</strong> Upon receiving both the Unboxing Video and the Claim Video, our team will review the evidence. We will update you via email whether your claim is approved or rejected, along with a detailed reason.</li>
                <li><strong>No Evidence, No Action:</strong> Returns or exchanges will not be processed without prior approval of the required video evidence.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl italic text-foreground flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-bold text-olive font-sans">5</span>
              ⏳ Processing Guarantees
            </h2>
            <div className="pl-10 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p>
                <strong>Refund Processing:</strong> Once the returned item is received and the claim is approved, the inspection will be completed, and the refund will be initiated within <strong>2 business days</strong>.
              </p>
              <p>
                <strong>Exchange Processing:</strong> From the day we receive your returned item and the claim is approved, the inspection and shipping of the new exchange item or swap will be completed within <strong>7 to 10 business days</strong>.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl italic text-foreground flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-bold text-olive font-sans">6</span>
              📦 Final Requirements for All Orders
            </h2>
            <div className="pl-10 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-5 space-y-3 text-amber-900">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                  <AlertTriangle className="h-4 w-4 text-amber-700" /> Parcel Integrity (Refusal is Mandatory)
                </div>
                <p>
                  <strong>DO NOT accept</strong> the package from the delivery person if the external packaging or seal appears visibly damaged or tampered with.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>You must refuse the parcel and immediately take a clear picture of the tampered package.</li>
                  <li>You must then email the picture to <a href="mailto:helloosoul@gmail.com" className="underline font-semibold hover:text-amber-950">helloosoul@gmail.com</a> immediately so we can file a claim with our shipping partner.</li>
                </ul>
              </div>
              <p>
                <strong>Condition Note:</strong> Items must be unworn, unwashed, and in the original condition with all tags attached.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CustomerPolicy;
