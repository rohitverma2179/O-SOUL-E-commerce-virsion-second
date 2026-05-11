import React, { useEffect } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    { 
      q: "What size should I choose?", 
      a: "Start with your usual size. O'Soul is cut for relaxed everyday comfort — so if you hate tightness, size up one. If your thighs tend to be wider than your waist, L tends to work better than going by waist alone. And if you're still unsure, DM us your height and waist — we'll guide you." 
    },
    { 
      q: "Will these look too casual to wear outside?", 
      a: "The joggers read as intentional — not gym wear, not home wear, but the kind of clean, relaxed piece you can wear to a café or college without looking like you gave up. The tees are boxy, not sloppy. The distinction matters." 
    },
    { 
      q: "Are the joggers slim or relaxed?", 
      a: "Relaxed through the thigh, with a clean taper at the ankle. Not skinny. Not gym-fit. Not balloon-wide. Somewhere that actually makes sense for sitting, walking, and doing your day." 
    },
    { 
      q: "Can I exchange if the size doesn't work?", 
      a: "Yes. Exchange support is available as per our exchange policy. Reach out through customer support with your order ID and we'll sort it from there." 
    },
    { 
      q: "Will the fabric feel cheap?", 
      a: "At ₹690–999, that's a fair concern. The honest answer: we spent time choosing fabric that doesn't feel like its price. Soft, mid-weight, breathable, and tested for recovery and cling. You'll feel the difference on first wear." 
    },
    { 
      q: "Will the waistband roll or fold?", 
      a: "It's specifically designed not to. Every waistband passes 10 wear-tests and 5 wash-tests before we approve it. If it rolled or folded, it didn't pass. Flat, soft, recoverable — that's the standard." 
    },
    { 
      q: "Does the fabric cling?", 
      a: "Non-cling is a pass/fail criterion during fabric testing. If it clings, we don't use it. The fabrics in this drop passed." 
    },
    { 
      q: "Will it shrink after washing?", 
      a: "Wash cold, air dry — it holds. Machine drying adds risk with any fabric, ours included. Air dry is the safe choice." 
    },
    { 
      q: "Why is the batch so small?", 
      a: "Because testing takes time and we don't ship what hasn't been tested. Fit trials, fabric approvals, waistband testing — each piece earns its way to the drop. Small batch is the honest result of that process, not a gimmick." 
    },
    { 
      q: "When will you restock?", 
      a: "No restocks on this drop. When it's gone, it's gone. Join the No-Adjust List to know about what comes next." 
    },
    { 
      q: "How do I contact you for anything else?", 
      a: "Customer support is available through the support page. For size help specifically, DM us — that's the fastest way to get a useful answer." 
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-3xl py-14 md:py-24">
        <header className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Help Center</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight">Questions. <span className="italic text-olive">Honest answers.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground italic leading-relaxed">
            The questions we get most in DMs — answered here so you don't have to ask. And if something's still unclear, ask anyway.
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-olive/30">
              <summary className="flex cursor-pointer items-center justify-between p-6 text-left font-medium transition-colors hover:text-olive list-none">
                <span className="font-serif text-lg italic leading-tight">{faq.q}</span>
                <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180 opacity-40" />
              </summary>
              <div className="border-t border-border/40 p-6 pt-5 text-sm text-muted-foreground italic leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-border bg-secondary/20 p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-olive/10 p-4">
              <MessageCircle className="h-8 w-8 text-olive" />
            </div>
          </div>
          <h3 className="font-serif text-2xl italic mb-4">Still have questions?</h3>
          <p className="text-sm text-muted-foreground italic mb-8">
            We're active on DMs and usually respond within a few hours.
          </p>
          <a 
            href="https://instagram.com/osoul.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-md bg-foreground px-10 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-lg shadow-charcoal/10"
          >
            Ask on Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
