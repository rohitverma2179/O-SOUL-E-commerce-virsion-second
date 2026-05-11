import React from 'react';
import { ChevronRight } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    { q: "What size should I choose?", a: "Choose your usual size for relaxed everyday comfort. If you are between sizes and hate tightness, choose the larger size." },
    { q: "Will these look too casual?", a: "No. The fits are relaxed, but the silhouettes are kept clean so you can wear them outside comfortably." },
    { q: "Are the joggers skinny?", a: "No. They are made for easy daily comfort, not tight compression." },
    { q: "Are the harem pants too loose?", a: "They are relaxed, but designed to drape cleanly instead of looking messy." },
    { q: "Will the shorts ride up?", a: "They are designed for easy thigh room and daily movement, but fit depends on body shape and selected size." },
    { q: "Can I exchange if the size doesn't work?", a: "Yes, exchange support is available as per policy." },
    { q: "How do I contact support?", a: "Use the customer support link in the footer or order confirmation page." }
  ];

  return (
    <div className="container-osoul max-w-2xl py-14">
      <h1 className="font-serif text-4xl italic">FAQ</h1>
      <div className="mt-10 space-y-2">
        {faqs.map((faq, idx) => (
          <details key={idx} className="border-b border-border pb-4 group cursor-pointer">
            <summary className="flex items-center justify-between font-medium hover:text-olive transition-colors list-none py-3">
              {faq.q}
              <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 opacity-40" />
            </summary>
            <p className="mt-2 text-sm text-muted-foreground italic leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
