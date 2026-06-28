import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../data/productData';
import ProductCard from '../components/product/ProductCard';
import ComboCard from '../components/product/ComboCard';
import { ChevronRight } from 'lucide-react';
import OptimizedImage from '../components/common/OptimizedImage';

// Image imports
import heroImg1 from '../assets/product/(61).png';
import heroImg2 from '../assets/product/(62).png';
import heroImg3 from '../assets/product/(67).png';

import catImgMen from '../assets/product/(4).png';
import catImgWomen from '../assets/product/(50).png';
import catImgUnisex from '../assets/product/(32).png';
import catImgCombos from '../assets/product/(10).png';

const products = allProducts;


import { allCombos } from '../data/comboData';

const combos = allCombos;


const Home = () => {
  const [heroContent, setHeroContent] = useState({
    tagline: 'Bottomwear that you don’t need to adjust.',
    titleLine1: 'Welcome to an  adjust-free world',

    titleLine2: "  of bottoms by O’Soul",
    description: 'Everyday joggers, shorts, and harem pants. Built for sitting, walking, and doing your actual day — without pulling, tugging, or thinking about what you\'re wearing.',
    primaryBtnText: 'Shop The First Drop →',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'Shop Combos',
    secondaryBtnLink: '/combos',
    images: [heroImg1, heroImg2, heroImg3]
  });

  const [activeReviewIndex, setActiveReviewIndex] = useState(1);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/homepage`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          const hero = data.data.find(section => section.sectionName === 'hero');
          if (hero) setHeroContent(hero.content);
        }
      } catch (error) {
        console.log("Using static homepage data (Server might be offline)");
      }
    };
    fetchHomepageData();
  }, []);

  const reviewsData = [
    {
      objection: "Will it actually fit?",
      quote: "“I didn't have to keep fixing it. First pair I've worn through a full college day without thinking about my pants once.”",
      author: "— Aanya, 22 · Mumbai"
    },
    {
      objection: "Will the waistband dig?",
      quote: "“It stayed in place without squeezing. After lunch I usually loosen something — not with these.”",
      author: "— Riya, 27 · Bangalore"
    },
    {
      objection: "Will my thighs feel tight?",
      quote: "“I always size up in pants because of my thighs. Took my usual size here. It fits. That was a moment.”",
      author: "— Priya, 26 · Delhi"
    },
    {
      objection: "Will the fabric feel cheap?",
      quote: "“Expected it to feel like any ₹999 basic. It doesn't. The fabric is soft but it has weight to it. Not cheap at all.”",
      author: "— Kartik, 31 · Mumbai"
    },
    {
      objection: "Will I wear it often?",
      quote: "“I've worn the joggers four times this week. I keep reaching for them. They're not the most exciting thing I own — but they're the most useful.”",
      author: "— Meera, 27 · Hyderabad"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-border bg-background">
        <div className="container-osoul grid gap-10 py-14 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6 md:pt-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B6650] font-semibold">{heroContent.tagline}</p>
            <h1 className="mt-5 font-serif text-3xl  leading-[1.05] md:text-7xl">
              {heroContent.titleLine1}<br />
              {/* {heroContent.titleLine2} */}
              <span className="italic text-[#9B6650]">{heroContent.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-foreground/80 leading-relaxed">
              {heroContent.description}
            </p>

            <div className="mt-8">
              <div className="flex flex-wrap gap-4">
                <Link to={heroContent.primaryBtnLink} className="h-12 rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-all flex items-center shadow-lg shadow-charcoal/10">
                  {heroContent.primaryBtnText}
                </Link>
                <Link to={heroContent.secondaryBtnLink} className="h-12 rounded-md border border-foreground px-8 py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-all flex items-center">
                  {heroContent.secondaryBtnText}
                </Link>
              </div>

              {/* Trust Strip */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  "In stock now",
                  "Secure Razorpay checkout",
                  "Easy exchange support"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground/80 font-medium">
                    <span className="h-1 w-1 rounded-full bg-olive/60" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Primary Hero Image */}
              <div className="relative col-span-2 overflow-hidden rounded-xl bg-secondary aspect-[16/9] md:aspect-[3/2] group block">
                <OptimizedImage
                  src={heroImg1}
                  alt="O'Soul Relaxed Fit - Movement Proof"
                  priority={true}
                  aspectRatio="aspect-[16/9] md:aspect-[3/2.2]"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-60 pointer-events-none"></div> */}
                <Link to="/products/" className="absolute inset-0 z-0"></Link>
                <div className="absolute bottom-5 left-5 flex gap-3 z-10">
                  <Link to="/men" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-8 text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-background/90 transition-all shadow-md">
                    Men
                  </Link>
                  <Link to="/women" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-8 text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-background/90 transition-all shadow-md">
                    Women
                  </Link>
                </div>
              </div>

              {/* Secondary Hero Images */}
              <Link to="/products/mens-shorts" className="relative overflow-hidden rounded-xl bg-secondary aspect-square group block cursor-pointer">
                <OptimizedImage
                  src={heroImg2}
                  alt="O'Soul Daily Wear - Walk Clean"
                  priority={true}
                  className="transition-transform duration-700  group-hover:scale-[1.03]"
                  imgClassName="object-[center_32%]"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-charcoal/30 to-transparent">
                  <div className="font-serif text-sm text-ivory italic">Walks clean.</div>
                </div>
              </Link>
              <Link to="/products/womens-harem-pants" className="relative overflow-hidden rounded-xl bg-secondary aspect-[4/4] group block cursor-pointer">
                <OptimizedImage
                  src={heroImg3}
                  alt="O'Soul Detail - Pockets Work"
                  priority={true}
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                  imgClassName="object-[center_35%]"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-charcoal/30 to-transparent">
                  <div className="font-serif text-sm text-ivory italic">Pockets work.</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Products Section */}
      <section id="products" className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">The first drop</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Start with the pieces you'll actually repeat.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground italic">Soft. Clean. Made for the way your day actually moves. The first drop is small — because fit takes time.</p>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Combos Section */}
      <section id="combos" className="bg-secondary/40 py-16 border-y border-border">
        <div className="container-osoul">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Combos</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Build a comfort fit in one click.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground italic">Combos for the days you don't want to think too much about what to wear.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {combos.map(combo => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Browse</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Shop by category.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <Link to="/men" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgMen}
                alt="Men's Category"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Men</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Boxy Tee With Pocket</li>
                <li>· Joggers</li>
                <li>· Shorts</li>
              </ul>
            </div>
          </Link>
          <Link to="/women" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgWomen}
                alt="Women's Category"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Women</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Cropped Hoodie</li>
                <li>· Harem Pants</li>
              </ul>
            </div>
          </Link>
          <Link to="/unisex" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgUnisex}
                alt="Unisex Category"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Unisex</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Boxy Tee</li>
              </ul>
            </div>
          </Link>
          <Link to="/combos" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgCombos}
                alt="Combos Category"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Combos</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Everyday Combo</li>
                <li>· Soft Movement</li>
                <li>· Full Rotation</li>
              </ul>
            </div>
          </Link>
        </div>
        <div className="mt-8 text-center">
          <Link to="/shop" className="inline-flex h-11 items-center rounded-md border border-foreground px-6 text-sm hover:bg-foreground hover:text-background transition-colors">
            Shop All
          </Link>
        </div>
      </section>

      {/* Why O'Soul Section */}
      <section className="bg-secondary/30 py-16 md:py-24 border-y border-border">
        <div className="container-osoul">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Why O'Soul</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl italic">Made for the comfort you notice once — then forget.</h2>
            <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground italic leading-relaxed">
              Most clothes are designed to look right standing still. O'Soul is built for everything after that — the sitting, walking, commuting, working, and just living that fills your actual day.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "The fit is in the pattern, not the size.",
                desc: "Most brands grade sizing by adding one inch everywhere. That's lazy, and it's why your \"right size\" still pulls in the wrong places. O'Soul grades across waist, hip, thigh, rise, and inseam — independently. Because Indian bodies aren't just bigger or smaller versions of each other."
              },
              {
                num: "02",
                title: "The waistband is tested, not guessed.",
                desc: "Every waistband passes a 10-wear test and a 5-wash test before a single piece ships. It has to stretch, sit flat, and recover — not roll, fold, or dig in. The waistband is where most comfort fails. It's where we start."
              },
              {
                num: "03",
                title: "The fabric is chosen for movement, not feel in a store.",
                desc: "Soft is the starting point, not the finish line. O'Soul fabric also has to breathe, recover after stretch, resist cling, and hold its shape after repeated wear. A lot of fabrics fail one of those things. We test until something passes all of them."
              },
              {
                num: "04",
                title: "The rise comes first.",
                desc: "Rise is the measurement from waist to crotch — and it's what decides whether you can sit comfortably for three hours or spend the day adjusting. We set the rise first, then build the pant around it. It's a different design order. It produces a different result."
              }
            ].map((prop) => (
              <div key={prop.num} className="group rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-olive/30">
                <span className="text-[10px] uppercase tracking-widest text-olive/60 font-bold">{prop.num}</span>
                <h4 className="mt-3 font-serif text-lg italic leading-tight group-hover:text-olive transition-colors">{prop.title}</h4>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic">{prop.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="font-serif text-xl md:text-2xl text-foreground italic">
              "If it makes you adjust, it failed. That's not marketing. It's the design brief."
            </p>
            <div className="mt-10">
              <Link to="/shop" className="inline-flex h-12 items-center rounded-md bg-foreground px-10 text-sm font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-lg shadow-charcoal/10">
                Shop The First Drop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Movement Proof Section */}
      <section className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Movement proof</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl italic">Comfort should show when you move.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground italic">Not just in product photos. In sitting, walking, pockets, waistbands, and daily wear.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { num: "01", label: "Sits easy." },
            { num: "02", label: "Walks clean." },
            { num: "03", label: "Waist stays soft." },
            { num: "04", label: "Pockets work." },
            { num: "05", label: "Fabric falls right." }
          ].map((item) => (
            <div key={item.num} className="relative aspect-square overflow-hidden rounded-md tile-olive group">
              <div className="absolute inset-x-0 bottom-0 p-3 text-sm text-ivory">
                <span className="text-[10px] uppercase tracking-wider opacity-70">0{item.num}</span>
                <div className="font-serif text-base italic">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/fit-tests" className="text-sm underline underline-offset-4 hover:text-olive transition-colors italic font-medium">See Fit Tests →</Link>
        </div>
      </section>

      {/* Social Proof / Reviews Section */}
      <section id="reviews" className="bg-secondary/40 border-y border-border/60 py-20 sm:py-28">
        <div className="container-osoul max-w-5xl">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4 font-medium">REVIEWS BY OBJECTION</p>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight text-balance mb-4">The exact things people notice after wearing O’Soul.</h2>
            <p className="text-foreground/70">Not random praise. Real doubts answered.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {reviewsData.map((rev, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIndex(idx)}
                className={`text-sm px-4 py-2.5 rounded-sm border transition-colors ${activeReviewIndex === idx
                    ? 'bg-foreground text-background border-foreground font-semibold'
                    : 'border-border bg-background text-foreground/80 hover:border-foreground/50'
                  }`}
              >
                {rev.objection}
              </button>
            ))}
          </div>

          <div className="bg-background border border-border rounded-sm p-8 sm:p-12 max-w-3xl min-h-[200px] flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-bold">
                {reviewsData[activeReviewIndex].objection.toUpperCase()}
              </p>
              <p className="text-2xl sm:text-3xl leading-snug text-balance mb-6 text-foreground font-medium" style={{ fontFamily: '"Fraunces", serif' }}>
                {reviewsData[activeReviewIndex].quote}
              </p>
            </div>
            <p className="text-sm text-foreground/70">
              {reviewsData[activeReviewIndex].author}
            </p>
          </div>

          <p className="mt-8 text-xs text-muted-foreground italic">
            Reviews shown reflect early customer feedback themes from the first batch.
          </p>
        </div>
      </section>

      {/* Sizing & FAQ Section */}
      <section className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Sizing</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl italic">Pick your usual size. Keep it simple.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground italic leading-relaxed">
            O'Soul is made for relaxed everyday comfort. If you're between sizes, choose based on how much room you like.
          </p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h4 className="font-serif text-lg italic mb-6 border-b border-border pb-2">Size guide</h4>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
              {[
                { s: "S", d: "Closer everyday fit." },
                { s: "M", d: "Most common regular fit." },
                { s: "L", d: "More relaxed fit." },
                { s: "XL", d: "Roomier comfort." },
                { s: "XXL", d: "Maximum ease." }
              ].map((item) => (
                <div key={item.s} className="flex justify-between border-b border-border pb-2 italic">
                  <span className="font-medium text-foreground">{item.s}</span>
                  <span className="text-muted-foreground">{item.d}</span>
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-1.5 text-xs text-muted-foreground italic leading-relaxed">
              <li>· Hate tightness? Size up.</li>
              <li>· Like a sharper fit? Size down.</li>
              <li>· For boxy tees, usual size gives boxy fall.</li>
              <li>· For shorts, size up if thighs are fuller.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h4 className="font-serif text-lg italic mb-6 border-b border-border pb-2">FAQ</h4>
            <div className="mt-4 space-y-1">
              {[
                { q: "What size should I choose?", a: "Choose your usual size for relaxed everyday comfort. If you are between sizes and hate tightness, choose the larger size." },
                { q: "Will these look too casual?", a: "No. The fits are relaxed, but the silhouettes are kept clean so you can wear them outside comfortably." },
                { q: "Are the joggers skinny?", a: "No. They are made for easy daily comfort, not tight compression." },
                { q: "Can I exchange if the size doesn't work?", a: "Yes, exchange support is available as per policy." },
                { q: "How do I contact support?", a: "Use the customer support link in the footer or order confirmation page." }
              ].map((faq, idx) => (
                <details key={idx} className="border-b border-border/60 py-3 group cursor-pointer">
                  <summary className="flex items-center justify-between text-sm font-medium hover:text-olive transition-colors list-none">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 opacity-40" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground italic leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Note Section */}
      {/* <section className="bg-foreground py-16 text-background text-center">
        <div className="container-osoul max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-background/60 font-medium">Founder note</p>
          <h2 className="mt-4 font-serif text-4xl italic">Why O'Soul exists.</h2>
          <div className="mt-8 space-y-4 text-base text-background/80 leading-relaxed italic font-light">
            <p>Most people don't need more clothes. They need clothes that don't keep bothering them.</p>
            <p>O'Soul exists for that feeling: wearing something soft, clean, and easy enough that you stop thinking about it.</p>
            <p className="mt-6 font-serif text-xl text-background">No more fixing. No more fuss. Just clothes that let you move through your day.</p>
          </div>
          <p className="mt-6 text-sm text-background/60 italic font-medium">— Manan Sadhwani, Founder, O'Soul</p>
          <div className="mt-8">
            <Link to="/shop" className="inline-flex h-11 items-center rounded-md bg-background px-8 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-background/90 transition-all">
              Shop The First Drop
            </Link>
          </div>
        </div>
      </section> */}

      {/* Email / Drop List Section */}
      <section className="bg-secondary/20 py-20 border-t border-border">
        <div className="container-osoul max-w-xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl italic">Join the No-Adjust List.</h2>
          <p className="mt-4 text-muted-foreground italic leading-relaxed">
            Be first to know when the next drop goes live. No spam. Just useful drop updates and the occasional honest note from the founder.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm focus:border-olive focus:outline-none transition-colors italic"
              required
            />
            <button
              type="submit"
              className="h-12 rounded-md bg-foreground px-8 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all"
            >
              Join the List →
            </button>
          </form>
          <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            Unsubscribe anytime. We won't email you unless it's worth your time.
          </p>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="container-osoul py-24 md:py-32 text-center">
        <h2 className="font-serif text-4xl md:text-5xl italic tracking-tight">Start with one piece you'll actually repeat.</h2>
        <p className="mt-6 text-muted-foreground italic text-lg leading-relaxed">
          First drop live. Free shipping on all orders. <br className="md:hidden" />
          <span className="text-olive font-medium">Small batch — no restocks.</span>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="h-14 flex items-center px-10 rounded-md bg-foreground text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-xl shadow-charcoal/10">
            Shop The First Drop →
          </Link>
          <Link to="/combos" className="h-14 flex items-center px-10 rounded-md border border-border text-[11px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
            Shop Combos
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
          Secure Razorpay checkout · Easy exchange support · In stock now
        </div>
      </section>
    </div>
  );
};

export default Home;
