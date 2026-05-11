import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-4xl py-14 md:py-24">
        <header className="mb-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">About O'Soul</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight leading-tight">
            We're building the category <br />
            <span className="italic text-olive font-normal">that should have existed.</span>
          </h1>
        </header>

        <div className="space-y-24">
          {/* Section 01 — THE PROBLEM */}
          <section className="grid gap-12 md:grid-cols-12 items-start">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-olive/60 font-bold">01</span>
                <span className="h-px w-8 bg-olive/20"></span>
              </div>
              <h2 className="font-serif text-3xl italic leading-tight">There is an adjustment economy in India.</h2>
            </div>
            <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground italic leading-relaxed">
              <p>
                Most people spend their entire day making small, unconscious corrections to their clothing. Pulling the waistband before sitting. Tugging the thigh when standing. Shifting in a chair to prevent a certain kind of pull. Avoiding crossing their legs because of what it does to the fabric.
              </p>
              <p>
                They do this automatically. Without thinking. And because they've always done it, they assume it's normal.
              </p>
              <p className="text-foreground font-medium">
                It's not normal. It's the result of clothes built on the wrong assumptions — Western templates for Indian bodies, mannequin fit for human movement, fast production that skips the testing that would catch these failures before they reach you.
              </p>
            </div>
          </section>

          {/* Section 02 — THE O'SOUL PREMISE */}
          <section className="grid gap-12 md:grid-cols-12 items-start">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-olive/60 font-bold">02</span>
                <span className="h-px w-8 bg-olive/20"></span>
              </div>
              <h2 className="font-serif text-3xl italic leading-tight">Your body was never the problem.</h2>
            </div>
            <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground italic leading-relaxed">
              <p>
                O'Soul exists on one premise: <span className="text-foreground font-medium">fit is a design problem. Not a body problem.</span>
              </p>
              <p>
                When a pair of pants doesn't fit — doesn't sit right when you sit, doesn't move right when you move, doesn't drape right when you stand — that's a pattern failure. A grading failure. A fabric selection failure. It's not a failure of your proportions.
              </p>
              <p>
                We build around that. Rise-first design. India-first sizing logic. Fabric chosen for how it behaves in real use, not how it feels in a store. Movement tested before production, not hoped for after.
              </p>
            </div>
          </section>

          {/* Section 03 — WHAT WE ARE */}
          <section className="grid gap-12 md:grid-cols-12 items-start">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-olive/60 font-bold">03</span>
                <span className="h-px w-8 bg-olive/20"></span>
              </div>
              <h2 className="font-serif text-3xl italic leading-tight">Bottomwear, built for real Indian bodies. No more adjusting.</h2>
            </div>
            <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground italic leading-relaxed">
              <p>
                O'Soul is a movement-first bottomwear brand. Right now, that means six products in a first drop. In the longer arc, it means building the category of no-adjustment bottomwear for the Indian market — the category that solves the adjustment economy for good.
              </p>
              <p className="text-foreground font-medium">
                We're not fashion. We're not fast fashion. We're not athleisure. We're the brand that builds the thing you wear when you want to stop thinking about what you're wearing.
              </p>
            </div>
          </section>

          {/* Section 04 — THE STANDARD */}
          <section className="grid gap-12 md:grid-cols-12 items-start">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-olive/60 font-bold">04</span>
                <span className="h-px w-8 bg-olive/20"></span>
              </div>
              <h2 className="font-serif text-3xl italic leading-tight">If it makes you adjust, it failed.</h2>
            </div>
            <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground italic leading-relaxed">
              <p>
                That's the design brief. It's also the product test. And it's the standard we hold every piece to before it ships.
              </p>
              <p>
                Small batch because we test everything. First drop because we're just starting. More drops because fit takes time to get right — and we're not willing to ship something that doesn't.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-32 text-center border-t border-border pt-16">
          <Link to="/shop" className="inline-flex h-14 items-center rounded-md bg-foreground px-12 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-xl shadow-charcoal/10">
            Shop The First Drop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
