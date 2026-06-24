import imgBoxyTeePocket from '../assets/product/(10).png';
import imgJoggers from '../assets/product/(1).png';
import imgShorts from '../assets/product/(20).png';
import imgBoxyTee2 from '../assets/product/(11).png';
import imgJoggers2 from '../assets/product/(2).png';
import imgShorts2 from '../assets/product/(21).png';
import imgCroppedHoodie from '../assets/product/(40).png';
import imgHaremPants from '../assets/product/(50).png';
import imgUnisexBoxyTee from '../assets/product/(30).png';
import imgUnisexBoxyTee2 from '../assets/product/(31).png';

export const allCombos = [
  {
    id: 1,
    title: "Men's Everyday Combo",
    headline: "The easiest daily outfit: tee, joggers, done.",
    description: "Boxy Tee + Joggers. For the days when you want to feel sorted without thinking about it. This is the rotation you'll keep coming back to.",
    proofLine: "Soft on top, clean below. No adjusting. Just wear it.",
    originalPrice: "1,698",
    discountedPrice: "1,599",
    savings: "99",
    tiles: ["tile-charcoal", "tile-olive"],
    images: [imgBoxyTeePocket, imgJoggers],
    alts: ["Men's boxy tee with pocket", "Men's relaxed joggers"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" }
    ]
  },
  {
    id: 2,
    title: "Men's Summer Combo",
    headline: "For warm days when light still means put-together.",
    description: "Boxy Tee + Shorts. Not the shorts that ride up, and not the tee that clings. Easy, clean, comfortable.",
    originalPrice: "1,394",
    discountedPrice: "1,299",
    savings: "95",
    tiles: ["tile-charcoal", "tile-charcoal"],
    images: [imgBoxyTeePocket, imgShorts],
    alts: ["Men's boxy tee with pocket", "Men's everyday shorts" , "Women's Harem Pants"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Shorts", slug: "mens-shorts", price: "695" },
      { name: "Women's Harem Pants", slug: "mens-shorts", price: "999 " }
    ]
  },
  {
    id: 3,
    title: "Men's Full Rotation Combo",
    headline: "Your everyday comfort rotation, sorted.",
    description: "Tee + Joggers + Shorts. Three pieces. Every situation covered. This is the combo for the person who doesn't want to think about what to wear for the next month.",
    valueLine: "Buy all three together. Save ₹194. Stop overthinking your wardrobe.",
    originalPrice: "2,393",
    discountedPrice: "2,199",
    savings: "194",
    tiles: ["tile-charcoal", "tile-olive", "tile-charcoal"],
    images: [imgBoxyTee2, imgJoggers2, imgShorts2],
    alts: ["Men's boxy tee version 2", "Men's relaxed joggers version 2", "Men's summer shorts version 2"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" },
      { name: "Men's Shorts", slug: "mens-shorts", price: "695" }
    ]
  },
  {
    id: 4,
    title: "Women's Soft Movement Combo",
    headline: "Soft on top. Free below. Easy everywhere.",
    description: "Cropped Hoodie + Harem Pants. For slow days, travel days, creative-work days, and every day in between. The combo that moves without fighting you.",
    originalPrice: "1,798",
    discountedPrice: "1,699",
    savings: "99",
    tiles: ["tile-clay", "tile-olive"],
    images: [imgCroppedHoodie, imgHaremPants],
    alts: ["Women's cropped hoodie", "Women's harem pants"],
    items: [
      { name: "Women's Cropped Hoodie", slug: "womens-cropped-hoodie", price: "799" },
      { name: "Women's Harem Pants", slug: "womens-harem-pants", price: "999" }
    ]
  },
  {
    id: 5,
    title: "Unisex Tee Pair",
    headline: "Two tees you'll both keep reaching for.",
    description: "Two Boxy Tees. Different colours, same soft ease. Stock up before one runs out.",
    originalPrice: "1,380",
    discountedPrice: "1,299",
    savings: "81",
    tiles: ["tile-sand", "tile-sand"],
    images: [imgUnisexBoxyTee, imgUnisexBoxyTee2],
    alts: ["Unisex boxy tee sand", "Unisex boxy tee olive"],
    items: [
      { name: "Unisex Boxy Tee", slug: "unisex-boxy-tee", price: "690" },
      { name: "Unisex Boxy Tee", slug: "unisex-boxy-tee", price: "690" }
    ]
  },
  {
    id: 6,
    title: "Couple / Friend Combo",
    headline: "Comfort for two. Without making it complicated.",
    description: "Unisex Boxy Tee + Men's Joggers. A shared wardrobe start. Or a gift that actually gets worn. Soft, clean, simple.",
    originalPrice: "1,689",
    discountedPrice: "1,599",
    savings: "90",
    tiles: ["tile-sand", "tile-olive"],
    images: [imgUnisexBoxyTee, imgJoggers],
    alts: ["Unisex boxy tee", "Men's relaxed joggers"],
    items: [
      { name: "Unisex Boxy Tee", slug: "unisex-boxy-tee", price: "690" },
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" }
    ]
  },
  {
    id: 7,
    title: "The Harem & Tee Combo",
    headline: "The ultimate relaxed shape.",
    description: "Unisex Boxy Tee + Harem Pants. A super-fluid, easy shape that lets you sit cross-legged, walk clean, and feel completely un-restricted.",
    originalPrice: "1,689",
    discountedPrice: "1,549",
    savings: "140",
    tiles: ["tile-sand", "tile-olive"],
    images: [imgUnisexBoxyTee, imgHaremPants],
    alts: ["Unisex boxy tee", "Women's harem pants"],
    items: [
      { name: "Unisex Boxy Tee", slug: "unisex-boxy-tee", price: "690" },
      { name: "Women's Harem Pants", slug: "womens-harem-pants", price: "999" }
    ]
  },
  {
    id: 8,
    title: "The Bottoms Duo",
    headline: "Complete freedom for both of you.",
    description: "Men's Joggers + Women's Harem Pants. Our two signature bottoms, built with custom waistbands and spacious patterns to solve your daily movement complaints.",
    originalPrice: "1,998",
    discountedPrice: "1,849",
    savings: "149",
    tiles: ["tile-olive", "tile-olive"],
    images: [imgJoggers, imgHaremPants],
    alts: ["Men's relaxed joggers", "Women's harem pants"],
    items: [
      { name: "Men's Joggers", slug: "mens-joggers", price: "999" },
      { name: "Women's Harem Pants", slug: "womens-harem-pants", price: "999" }
    ]
  }
];
