import React, { useEffect } from 'react';
import {  Mail, MessageSquare, ArrowRight } from 'lucide-react';
// import { FaInstagram } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";

const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const supportOptions = [
    { label: "Order support", icon: MessageSquare },
    { label: "Exchange support", icon: RefreshCcw },
    { label: "Product question", icon: Mail },
    { label: "Payment issue", icon: Mail },
  ];

  // Helper because RefreshCcw is not imported but was used in my thought
  const RefreshCcwIcon = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M16 16h5v5"/>
    </svg>
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-3xl py-14 md:py-24">
        <header className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Support</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl italic tracking-tight">Need help? We're here.</h1>
          <p className="mt-6 text-lg text-muted-foreground italic leading-relaxed">
            For order questions, size help, exchanges, or anything else — reach out below. For size questions specifically, DM us on Instagram — it's the fastest.
          </p>
        </header>

        <div className="grid gap-6">
          {/* Instagram High Priority */}
          <a 
            href="https://instagram.com/osoul.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-2xl border-2 border-olive/30 bg-olive/5 p-6 md:p-8 transition-all hover:bg-olive/10"
          >
            <div className="flex items-center gap-6">
              <div className="rounded-full bg-olive/10 p-4 text-olive">
                <IoLogoInstagram className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl italic text-foreground">Size question?</h3>
                <p className="text-sm text-muted-foreground italic">DM on Instagram for fastest response</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-olive transition-transform group-hover:translate-x-1" />
          </a>

          {/* Other Support Options */}
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            {[
              { label: "Order support", icon: MessageSquare, email: "orders@osoul.in" },
              { label: "Exchange support", icon: RefreshCcwIcon, email: "exchanges@osoul.in" },
              { label: "Product question", icon: Mail, email: "hello@osoul.in" },
              { label: "Payment issue", icon: Mail, email: "support@osoul.in" },
            ].map((option, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-olive/20 hover:shadow-sm">
                <div className="mb-4 text-olive/60">
                  <option.icon className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-lg italic text-foreground mb-2">{option.label}</h4>
                <p className="text-xs text-muted-foreground italic mb-4">Email: {option.email}</p>
                <button className="text-[10px] uppercase tracking-widest font-bold text-olive/70 hover:text-olive transition-colors">Start Conversation →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
