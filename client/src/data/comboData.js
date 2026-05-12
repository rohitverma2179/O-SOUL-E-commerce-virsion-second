import imgBoxyTeePocket from '../assets/product/BO7A9020.jpeg';
import imgJoggers from '../assets/product/BO7A9013.jpeg';
import imgShorts from '../assets/product/page short .jpeg';
import imgBoxyTee2 from '../assets/product/BO7A9023.jpeg';
import imgJoggers2 from '../assets/product/BO7A9019.jpeg';
import imgShorts2 from '../assets/product/short 2.jpeg';
import imgCroppedHoodie from '../assets/product/BO7A9135.jpeg';
import imgHaremPants from '../assets/product/BO7A9142.jpeg';
import imgUnisexBoxyTee from '../assets/product/BO7A9028.jpeg';
import imgUnisexBoxyTee2 from '../assets/product/BO7A9042.jpeg';

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
    alts: ["Men's boxy tee with pocket", "Men's everyday shorts"],
    items: [
      { name: "Men's Boxy Tee With Pocket", slug: "mens-boxy-tee-with-pocket", price: "699" },
      { name: "Men's Shorts", slug: "mens-shorts", price: "695" }
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
  }
];
