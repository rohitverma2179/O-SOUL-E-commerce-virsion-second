import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/product/(61).png';

const FounderNote = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center py-20 px-4"
      style={{
        backgroundImage: `url("${bgImage}")`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center 35%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      {/* Light overlay for context depth and readibility */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* The White Founder Note Card */}
      <div className="relative z-10 bg-white max-w-lg sm:max-w-xl w-full p-8 sm:p-14 md:p-16 rounded-sm shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Card Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#9B6650] mb-8 tracking-tight font-medium">
          a note from the founder
        </h2>

        {/* Card Body Content */}
        <div className="space-y-6 text-[13px] sm:text-[14px] text-stone-700 leading-relaxed tracking-wide">
          <p className="italic">
            "some days, the reason you don’t feel like yourself has nothing to do with your mood.
          </p>

          <p className="font-serif text-base text-[#9B6650] font-medium leading-tight">
            it’s what you’re wearing.
          </p>

          <p>
            the fit feels off.<br />
            you keep adjusting it without thinking.<br />
            and little by little, something as simple as bottoms starts deciding how present you feel in your own day.
          </p>

          <p>
            i felt that more often than i should have.
          </p>

          <p>
            and i kept wondering why something we wear for hours is treated like it doesn’t matter enough to get right.
          </p>

          <p className="font-serif text-base text-[#9B6650] font-medium leading-tight">
            that’s where o’soul began.
          </p>

          <p>
            with one simple thought:<br />
            the clothes closest to you should never make you feel like you have to adjust yourself to fit into them.
          </p>

          <p>
            not to make more clothes,<br />
            but to make bottoms that respect your body, your movement, and the way real days actually feel.
          </p>

          <p className="font-serif text-base sm:text-lg text-stone-900 font-medium italic mt-8">
            they should respect you as you are."
          </p>

          {/* Signature */}
          <div className="pt-6">
            <p className="text-[#9B6650] font-serif text-base">
              - love, manan / tanishka
            </p>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1 font-semibold">
              Founders, O'Soul
            </p>
          </div>
        </div>

        {/* CTA Shop Link */}
        <div className="pt-8 border-t border-stone-100">
          <Link 
            to="/shop" 
            className="inline-flex h-11 items-center rounded-md bg-stone-900 px-8 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-stone-800 transition-all shadow-md"
          >
            Shop The First Drop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FounderNote;
