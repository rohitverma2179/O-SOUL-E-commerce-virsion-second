import imgJoggers from '../assets/product/BO7A9013.jpeg';
import imgBoxyTeePocket from '../assets/product/BO7A9020.jpeg';
import imgShorts from '../assets/product/page short .jpeg';
import imgUnisexBoxyTee from '../assets/product/BO7A9028.jpeg';
import imgCroppedHoodie from '../assets/product/BO7A9135.jpeg';
import imgHaremPants from '../assets/product/BO7A9142.jpeg';

export const allProducts = [
  {
    id: "men-joggers",
    slug: "mens-joggers",
    name: "Men's Joggers",
    price: 999,
    category: "Men",
    type: "Joggers",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    onSale: true,
    emotionalHook: "For days when jeans feel like a punishment.",
    shortDescription: "Soft joggers that look like you made an effort. Relaxed through the thigh, clean taper at the ankle, waistband that sits — not digs.",
    fitDetail: "The rise is set for sitting. So you can be in a café for three hours and not once think about your pants.",
    bestFor: "Travel · College · Cafés · Work-from-home · Daily movement",
    tileClass: "tile-olive",
    image: imgJoggers,
    alt: "Model wearing O'Soul relaxed fit joggers in olive color",
    tags: [
      "Sits clean",
      "No-roll waist",
      "Relaxed thigh",
      "Clean taper"
    ],
    featureTags: [
      "Sits clean — no crotch pull when you cross your legs",
      "Waistband recovers — no roll, no fold, no dig",
      "Relaxed thigh — real room for real movement",
      "Clean taper — not a gym jogger, not a sloppy one",
      "Soft mid-weight knit — the weight that doesn't cling"
    ],
    objections: [
      { q: "Will it look too casual?", a: "It's the jogger that reads as intentional. Not streetwear. Not gym. Just clean." },
      { q: "Will the waistband dig when I sit?", a: "Designed to sit flat. Not to look flat while standing and dig when it matters." },
      { q: "Will my thighs feel tight?", a: "Relaxed through the thigh. That's not a size question — it's the pattern." }
    ],
    details: {
      fit: "Relaxed through the thigh with a clean taper at the ankle.",
      fabric: "Premium mid-weight knit blend with high elasticity and recovery.",
      care: "Machine wash cold. Air dry. Gets softer with use.",
      sizeAdvice: "Choose your regular size. If you want maximum ease, size up."
    }
  },
  {
    id: "men-boxy-tee-pocket",
    slug: "mens-boxy-tee-with-pocket",
    name: "Men's Boxy Tee With Pocket",
    price: 699,
    category: "Men",
    type: "Tees",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    onSale: true,
    emotionalHook: "The tee that doesn't require a second thought.",
    shortDescription: "Throw it on. Feel sorted. Soft enough to repeat every week. The pocket is there when you need it, invisible when you don't.",
    bestFor: "Daily wear · Layering · College · Errands · Throwing on without overthinking",
    tileClass: "tile-charcoal",
    image: imgBoxyTeePocket,
    alt: "Man wearing O'Soul boxy fit t-shirt with pocket in black",
    tags: [
      "Boxy fall",
      "Functional pocket",
      "No-cling",
      "Colour holds"
    ],
    featureTags: [
      "Boxy fall — sits right without trying to fit 'right'",
      "Pocket placed where hands actually reach",
      "Fabric that doesn't cling by hour two",
      "Soft enough for a long day, clean enough for outside",
      "Colour holds — not a tee that fades into beige after six washes"
    ],
    objections: [
      { q: "Will it look baggy?", a: "Boxy isn't baggy. It's a tee that doesn't fight your body. There's a difference." },
      { q: "Will the pocket look busy?", a: "One pocket, placed clean. Useful without making the tee look functional in a bad way." }
    ],
    details: {
      fit: "Relaxed boxy fit with slightly dropped shoulders and a straight fall.",
      fabric: "100% premium soft-touch cotton.",
      care: "Machine wash cold. Air dry to maintain shape.",
      sizeAdvice: "True to size for a boxy look. Size down for a regular fit."
    }
  },
  {
    id: "men-shorts",
    slug: "mens-shorts",
    name: "Men's Shorts",
    price: 695,
    category: "Men",
    type: "Shorts",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    onSale: true,
    emotionalHook: "Warm-day comfort without the thigh fight.",
    shortDescription: "Easy shorts that don't ride up, dig in, or make you adjust every twenty minutes. The thigh room is built in — not something you have to size up for.",
    bestFor: "Summer · Home · Walks · Errands · College · Anywhere you want to actually be comfortable",
    tileClass: "tile-charcoal",
    image: imgShorts,
    alt: "O'Soul everyday comfort shorts in charcoal grey",
    tags: [
      "Thigh room",
      "Stable waist",
      "Flat pockets",
      "Clean hem"
    ],
    featureTags: [
      "Thigh room that's in the pattern — not the size",
      "Waistband that stays where you put it",
      "Pockets that don't turn your silhouette into a balloon",
      "Clean hem — not gym shorts, not swim shorts",
      "Fabric that moves without clinging"
    ],
    objections: [
      { q: "Will it ride up when I walk?", a: "The cut accounts for movement. It's why we tested it walking, not just standing." },
      { q: "Are the pockets going to bulge?", a: "Flat pockets. Designed to hold your phone without the shorts becoming a lumpy mess." }
    ],
    details: {
      fit: "Easy thigh room with a soft, non-restrictive waistband.",
      fabric: "Breathable everyday knit.",
      care: "Machine wash cold. Air dry.",
      sizeAdvice: "If your thighs are fuller, choose your usual size — the room is already there."
    }
  },
  {
    id: "unisex-boxy-tee",
    slug: "unisex-boxy-tee",
    name: "Unisex Boxy Tee",
    price: 690,
    category: "Unisex",
    type: "Tees",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    onSale: true,
    emotionalHook: "One tee. Many moods. No effort.",
    shortDescription: "A clean boxy tee that works across outfits, occasions, and people. Soft, simple, and easy enough to reach for without thinking.",
    bestFor: "Everyday wear · Layering · College · Shared wardrobes · Gifting",
    tileClass: "tile-sand",
    image: imgUnisexBoxyTee,
    alt: "Unisex boxy t-shirt by O'Soul in sand color",
    tags: [
      "Unisex fit",
      "Boxy fall",
      "Non-cling",
      "Easy repeat"
    ],
    featureTags: [
      "Unisex fit — not gendered as an afterthought",
      "Boxy fall without the oversized sloppiness",
      "Fabric that sits, not clings",
      "Easy to style, easier to repeat",
      "Both colours work — so you might want both"
    ],
    objections: [
      { q: "Is this actually unisex or just oversized?", a: "It's cut to fall well on different proportions. Not just a men's tee labelled unisex." },
      { q: "Will it look shapeless?", a: "Boxy has a shape. It just doesn't conform to yours — which is the point." }
    ],
    details: {
      fit: "Classic unisex boxy fit designed to fall away from the body.",
      fabric: "Medium weight premium cotton.",
      care: "Machine wash cold. Wash dark colors separately.",
      sizeAdvice: "Unisex sizing. Women may size down for a less oversized look."
    }
  },
  {
    id: "women-cropped-hoodie",
    slug: "womens-cropped-hoodie",
    name: "Women's Cropped Hoodie",
    price: 799,
    category: "Women",
    type: "Hoodies",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    onSale: true,
    emotionalHook: "Soft comfort that still has a shape.",
    shortDescription: "A cropped hoodie for days when you want warmth without losing your silhouette. Soft, easy to layer, and clean enough to actually leave the house in.",
    bestFor: "Layering · Travel · Cafés · Lounging · Casual outings · Days when you're not sure what to wear",
    tileClass: "tile-clay",
    image: imgCroppedHoodie,
    alt: "Women's cropped hoodie in clay color by O'Soul",
    tags: [
      "Cropped fit",
      "Soft interior",
      "Easy layering",
      "Shape hold"
    ],
    featureTags: [
      "Cropped — deliberately, not accidentally",
      "Soft interior — the kind that doesn't scratch by hour two",
      "Easy layering — over a tee, under a jacket, with harem pants",
      "Clean shape even after washing",
      "Hood sits right — not stiff, not floppy"
    ],
    objections: [
      { q: "Will it look too casual?", a: "The crop keeps it intentional. This isn't a hoodie that reads as 'gave up.'" },
      { q: "Will it shrink and lose shape?", a: "Tested for post-wash stability. The shape holds." }
    ],
    details: {
      fit: "Boxy cropped fit that hits at the natural waistline.",
      fabric: "Ultra-soft French Terry blend with a brushed interior.",
      care: "Machine wash cold inside out. Air dry.",
      sizeAdvice: "True to size. Choose a larger size for an extra slouchy look."
    }
  },
  {
    id: "women-harem-pants",
    slug: "womens-harem-pants",
    name: "Women's Harem Pants",
    price: 999,
    category: "Women",
    type: "Harem Pants",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    onSale: true,
    emotionalHook: "Completely free. Still completely clean.",
    shortDescription: "Harem pants that drape softly, move freely, and don't look like you borrowed them from someone three sizes up. The rise is generous — so sitting feels like sitting, not a compromise.",
    bestFor: "Travel · Home · Creative work · Slow days · Cafés · Anywhere you want actual ease",
    tileClass: "tile-olive",
    image: imgHaremPants,
    alt: "Women's comfortable harem pants in olive green",
    tags: [
      "Roomy rise",
      "Soft drape",
      "Non-cling",
      "Elastic waist"
    ],
    featureTags: [
      "Roomy rise — cross-legged, seated, floor — no restriction",
      "Soft drape — falls clean, not stiff",
      "Non-cling fabric — no static, no outline",
      "Elastic that recovers — waist stays where you set it",
      "Relaxed silhouette that still looks like a choice"
    ],
    objections: [
      { q: "Will it look shapeless?", a: "The drape is the shape. It moves with you rather than on you." },
      { q: "Will the fabric cling?", a: "Tested specifically for non-cling. This fabric passed because it didn't." },
      { q: "Can I wear this outside?", a: "Soft, but not home-only. Clean enough for a café, comfortable enough for travel." }
    ],
    details: {
      fit: "High-waisted with a relaxed, dropped rise and tapered ankle cuff.",
      fabric: "Breathable premium jersey with a fluid, soft drape.",
      care: "Machine wash cold. Hang to dry.",
      sizeAdvice: "Choose your regular size. The waist is elastic and very forgiving."
    }
  }
];