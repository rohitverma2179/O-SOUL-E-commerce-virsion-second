import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ComboCard from '../components/product/ComboCard';
import { ChevronRight } from 'lucide-react';

const products = [
  {
    id: 1,
    slug: 'mens-boxy-tee-with-pocket',
    name: "Men's Boxy Tee With Pocket",
    price: 699,
    shortDescription: "The tee you can throw on and still feel sorted.",
    description: "Relaxed, soft, and easy to repeat. The pocket adds function without making the tee feel busy.",
    bestFor: "College · errands · casual outings · daily layering",
    tileClass: "tile-charcoal",
    tags: ["Boxy fit", "Pocket detail", "Easy fall", "Soft feel"]
  },
  {
    id: 2,
    slug: 'mens-joggers',
    name: "Men's Joggers",
    price: 999,
    shortDescription: "For days when jeans feel like too much.",
    description: "Soft joggers that keep you comfortable without making you look like you gave up.",
    bestFor: "Travel · college · cafés · lounging · daily movement",
    tileClass: "tile-olive",
    tags: ["Soft waistband", "Relaxed thigh", "Clean taper", "Everyday comfort"]
  },
  {
    id: 3,
    slug: 'mens-shorts',
    name: "Men's Shorts",
    price: 695,
    shortDescription: "Warm-day comfort without the thigh fight.",
    description: "Easy shorts for walks, errands, home, and casual days when you want comfort without constant pulling.",
    bestFor: "Summer · home · walks · errands · college",
    tileClass: "tile-charcoal",
    tags: ["Easy thigh room", "Soft waistband", "Clean pocket", "Daily comfort"]
  },
  {
    id: 4,
    slug: 'unisex-boxy-tee',
    name: "Unisex Boxy Tee",
    price: 690,
    shortDescription: "One easy tee. Many repeat days.",
    description: "A clean boxy tee that works across moods, routines, and outfits.",
    bestFor: "Daily wear · layering · college · errands · relaxed fits",
    tileClass: "tile-sand",
    tags: ["Unisex fit", "Boxy fall", "Soft fabric", "Easy styling"]
  },
  {
    id: 5,
    slug: 'womens-cropped-hoodie',
    name: "Women's Cropped Hoodie",
    price: 799,
    shortDescription: "Soft comfort that still feels styled.",
    description: "A cropped hoodie for days when you want ease without losing shape.",
    bestFor: "Layering · travel · lounging · cafés · casual outings",
    tileClass: "tile-clay",
    tags: ["Cropped fit", "Soft feel", "Easy layering", "Clean shape"]
  },
  {
    id: 6,
    slug: 'womens-harem-pants',
    name: "Women's Harem Pants",
    price: 999,
    shortDescription: "Freedom without the sloppy look.",
    description: "Relaxed harem pants that move softly, drape cleanly, and let your body breathe.",
    bestFor: "Travel · home · slow days · creative work · casual outings",
    tileClass: "tile-olive",
    tags: ["Soft drape", "Roomy rise", "Relaxed movement", "No-cling feel"]
  }
];

const combos = [
  {
    id: 1,
    title: "Men's Everyday Combo",
    description: "The easiest daily outfit: soft tee, clean joggers, no overthinking.",
    originalPrice: "1,698",
    discountedPrice: "1,599",
    savings: "99",
    tiles: ["tile-charcoal", "tile-olive"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" }
    ]
  },
  {
    id: 2,
    title: "Men's Summer Combo",
    description: "For warm days when you want to feel light, comfortable, and still put-together.",
    originalPrice: "1,394",
    discountedPrice: "1,299",
    savings: "95",
    tiles: ["tile-charcoal", "tile-charcoal"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Shorts", slug: "mens-shorts", price: "695" }
    ]
  },
  {
    id: 3,
    title: "Men's Full Rotation Combo",
    description: "One tee, one jogger, one short. Your basic comfort rotation is sorted.",
    originalPrice: "2,393",
    discountedPrice: "2,199",
    savings: "194",
    tiles: ["tile-charcoal", "tile-olive", "tile-charcoal"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" },
      { name: "Men's Shorts", slug: "mens-shorts", price: "695" }
    ]
  },
  {
    id: 4,
    title: "Women's Soft Movement Combo",
    description: "Soft on top, free-flowing below. Easy comfort for slow days, travel, and everyday movement.",
    originalPrice: "1,798",
    discountedPrice: "1,699",
    savings: "99",
    tiles: ["tile-clay", "tile-olive"],
    items: [
      { name: "Women's Cropped Hoodie", slug: "womens-cropped-hoodie", price: "799" },
      { name: "Women's Harem Pants", slug: "womens-harem-pants", price: "999" }
    ]
  },
  {
    id: 5,
    title: "Unisex Tee Pair",
    description: "Two easy tees you'll keep reaching for.",
    originalPrice: "1,380",
    discountedPrice: "1,299",
    savings: "81",
    tiles: ["tile-sand", "tile-sand"],
    items: [
      { name: "Unisex Boxy Tee", slug: "unisex-boxy-tee", price: "690" },
      { name: "Unisex Boxy Tee", slug: "unisex-boxy-tee", price: "690" }
    ]
  },
  {
    id: 6,
    title: "Couple / Friend Combo",
    description: "Build a shared comfort fit without making it complicated.",
    originalPrice: "1,689",
    discountedPrice: "1,599",
    savings: "90",
    tiles: ["tile-sand", "tile-olive"],
    items: [
      { name: "Unisex Boxy Tee", slug: "unisex-boxy-tee", price: "690" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" }
    ]
  }
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container-osoul grid gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6 md:pt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">First drop · Live now</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">
              Soft fits. Clean looks.<br />
              <span className="italic text-olive">No more adjusting.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-foreground/80 leading-relaxed">
              Everyday tees, joggers, shorts, hoodies, and harem pants made for sitting, walking, lounging, travelling, and living without constant fixing.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop" className="h-12 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-colors flex items-center">
                Shop The First Drop
              </Link>
              <Link to="/combos" className="h-12 rounded-md border border-foreground px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors flex items-center">
                Shop Combos
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-4">
              <li>· Products from ₹690</li>
              <li>· In stock now</li>
              <li>· Secure Razorpay checkout</li>
              <li>· Easy exchange support</li>
            </ul>
          </div>

          <div className="md:col-span-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative w-full overflow-hidden rounded-md tile-olive aspect-[3/4]" aria-hidden="true">
                <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-ivory/70">O'Soul</div>
                  <div className="mt-1 font-serif text-lg leading-tight text-ivory">Men's Joggers</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative w-full overflow-hidden rounded-md tile-clay aspect-square" aria-hidden="true">
                  <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-ivory/70">O'Soul</div>
                    <div className="mt-1 font-serif text-lg leading-tight text-ivory">Women's Cropped Hoodie</div>
                  </div>
                </div>
                <div className="relative w-full overflow-hidden rounded-md tile-sand aspect-square" aria-hidden="true">
                  <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-ivory/70">O'Soul</div>
                    <div className="mt-1 font-serif text-lg leading-tight text-ivory">Unisex Boxy Tee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">The first drop</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Start with the pieces you'll actually repeat.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground italic">Soft, clean, everyday fits made for the way your day actually moves.</p>
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
            <div className="tile-charcoal aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]"></div>
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
            <div className="tile-clay aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Women</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Cropped Hoodie</li>
                <li>· Harem Pants</li>
              </ul>
            </div>
          </Link>
          <Link to="/unisex" className="group relative block overflow-hidden rounded-lg">
            <div className="tile-sand aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Unisex</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Boxy Tee</li>
              </ul>
            </div>
          </Link>
          <Link to="/combos" className="group relative block overflow-hidden rounded-lg">
            <div className="tile-olive aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]"></div>
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
      <section className="bg-secondary/40 py-16 border-y border-border font-serif">
        <div className="container-osoul">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-sans font-medium">Why O'Soul</p>
            <h2 className="mt-3 text-3xl md:text-4xl italic">Made for the comfort you notice once, then forget.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground font-sans italic">O'Soul pieces are designed to feel easy through the small movements of your day.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              { title: "Soft where it matters", desc: "Waistbands, fabric, and fits that don't keep interrupting you." },
              { title: "Clean enough for outside", desc: "Comfort that still looks intentional." },
              { title: "Made for real movement", desc: "Sitting, walking, lounging, travelling, and doing normal life." },
              { title: "Easy to repeat", desc: "The kind of pieces you reach for without thinking twice." }
            ].map((prop, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <h4 className="text-lg italic">{prop.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground font-sans leading-relaxed italic">{prop.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center font-sans">
            <Link to="/shop" className="inline-flex h-11 items-center rounded-md bg-foreground px-6 text-sm text-background hover:bg-foreground/90 transition-colors">
              Shop The First Drop
            </Link>
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

      {/* Feedback Section */}
      <section className="bg-secondary/40 py-16 border-y border-border">
        <div className="container-osoul">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Early feedback</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl italic">What early buyers noticed.</h2>
            <p className="mt-3 text-center text-xs text-muted-foreground italic">Early feedback themes. Replace with real customer reviews.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Fabric feels soft, not cheap.",
              "Fit is actually comfortable.",
              "Joggers are easy for daily wear.",
              "Need more colours.",
              "Looks clean but feels relaxed.",
              "Pocket on the tee is genuinely useful."
            ].map((review, idx) => (
              <blockquote key={idx} className="rounded-lg border border-border bg-background p-5 italic shadow-sm hover:border-olive/30 transition-colors">
                <p className="font-serif text-base text-foreground/80 leading-relaxed">"{review}"</p>
              </blockquote>
            ))}
          </div>
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
      <section className="bg-foreground py-16 text-background text-center">
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
      </section>

      {/* Closing CTA Section */}
      <section className="container-osoul py-20 text-center">
        <h2 className="font-serif text-4xl italic">Start with one piece you'll actually repeat.</h2>
        <p className="mt-3 text-muted-foreground italic text-lg font-light">First drop live. Products from ₹690.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="h-11 flex items-center px-8 rounded-md bg-foreground text-xs font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all">
            Shop The First Drop
          </Link>
          <Link to="/combos" className="h-11 flex items-center px-8 rounded-md border border-foreground text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
            Shop Combos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
