import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, ShieldAlert, AlertOctagon, ArrowLeft } from 'lucide-react';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-2xl py-14 md:py-24">
        
        {/* Back navigation */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-bold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className="mb-12 border-b border-border/40 pb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-olive font-bold">Legal</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight text-foreground">Terms & Conditions</h1>
          <p className="mt-4 text-muted-foreground italic leading-relaxed text-sm md:text-base">
            Governing Your Purchase from O’Soul. Please read these terms carefully before placing your order.
          </p>
        </header>

        {/* Introductory Notice */}
        <div className="rounded-2xl border border-olive/20 bg-olive/5 p-6 mb-12 text-sm md:text-base text-foreground/85 italic leading-relaxed">
          By placing an order on our store, you agree to be bound by these Terms and Conditions and our policies on Cancellation, Returns, Exchanges, and Video Proof.
        </div>

        {/* Policy points */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl italic text-foreground flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive font-sans">1</span>
              General Agreement
            </h2>
            <div className="pl-9 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-olive shrink-0 mt-0.5" />
                <span>We strongly urge you to consult our size guides and choose sizes carefully to support our small business model.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-olive shrink-0 mt-0.5" />
                <span>We reserve the right to refuse or cancel any order for any reason.</span>
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl italic text-foreground flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive font-sans">2</span>
              Product Representation and Variation
            </h2>
            <div className="pl-9 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p>
                We make every effort to display product colors and attributes accurately.
              </p>
              <p className="flex items-start gap-2.5 bg-secondary/20 p-3.5 rounded-xl border border-border/40 text-xs text-muted-foreground">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Color Issues:</strong> Minor variations may occur due to monitor settings. Color issues are not grounds for a refund and are strictly covered under the Exchange/Swap Policy.
                </span>
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl italic text-foreground flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive font-sans">3</span>
              Mandatory Video Evidence
            </h2>
            <div className="pl-9 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <p>
                All claims (defect, damage, or incorrect item) must be accompanied by the two mandatory, continuous videos emailed to us: an <strong>Unboxing Video</strong> and a separate <strong>Claim Video</strong>.
              </p>
              <p className="font-semibold text-rose-700">
                No claim will be processed without this prior video evidence.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl italic text-foreground flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-[10px] font-bold text-olive font-sans">4</span>
              Final Package Acceptance
            </h2>
            <div className="pl-9 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed italic">
              <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-5 space-y-3 text-rose-950">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-rose-800">
                  <AlertOctagon className="h-4 w-4 text-rose-700" /> Tampered Package Refusal is Mandatory
                </div>
                <p>
                  If the external packaging or seal is visibly damaged or tampered with, you <strong>MUST REFUSE</strong> the parcel from the delivery person.
                </p>
                <p className="text-xs">
                  <strong>Failure to refuse</strong> a visibly damaged parcel voids your claim options for transit damage.
                </p>
                <p>
                  You must immediately send a picture of the refused package to <a href="mailto:osoulclothing@gmail.com" className="underline font-semibold hover:text-rose-950">osoulclothing@gmail.com</a>.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
