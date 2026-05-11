import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

const allProducts = [
  { id: 1, slug: 'mens-boxy-tee-with-pocket', name: "Men's Boxy Tee With Pocket", price: 699, shortDescription: "The tee you can throw on and still feel sorted.", description: "Relaxed, soft, and easy to repeat. The pocket adds function without making the tee feel busy.", bestFor: "College · errands · casual outings · daily layering", tileClass: "tile-charcoal", tags: ["Boxy fit", "Pocket detail", "Easy fall", "Soft feel"], category: "men", type: "Tees" },
  { id: 2, slug: 'mens-joggers', name: "Men's Joggers", price: 999, shortDescription: "For days when jeans feel like too much.", description: "Soft joggers that keep you comfortable without making you look like you gave up.", bestFor: "Travel · college · cafés · lounging · daily movement", tileClass: "tile-olive", tags: ["Soft waistband", "Relaxed thigh", "Clean taper", "Everyday comfort"], category: "men", type: "Joggers" },
  { id: 3, slug: 'mens-shorts', name: "Men's Shorts", price: 695, shortDescription: "Warm-day comfort without the thigh fight.", description: "Easy shorts for walks, errands, home, and casual days when you want comfort without constant pulling.", bestFor: "Summer · home · walks · errands · college", tileClass: "tile-charcoal", tags: ["Easy thigh room", "Soft waistband", "Clean pocket", "Daily comfort"], category: "men", type: "Shorts" },
  { id: 4, slug: 'unisex-boxy-tee', name: "Unisex Boxy Tee", price: 690, shortDescription: "One easy tee. Many repeat days.", description: "A clean boxy tee that works across moods, routines, and outfits.", bestFor: "Daily wear · layering · college · errands · relaxed fits", tileClass: "tile-sand", tags: ["Unisex fit", "Boxy fall", "Soft fabric", "Easy styling"], category: "unisex", type: "Tees" },
  { id: 5, slug: 'womens-cropped-hoodie', name: "Women's Cropped Hoodie", price: 799, shortDescription: "Soft comfort that still feels styled.", description: "A cropped hoodie for days when you want ease without losing shape.", bestFor: "Layering · travel · lounging · cafés · casual outings", tileClass: "tile-clay", tags: ["Cropped fit", "Soft feel", "Easy layering", "Clean shape"], category: "women", type: "Hoodies" },
  { id: 6, slug: 'womens-harem-pants', name: "Women's Harem Pants", price: 999, shortDescription: "Freedom without the sloppy look.", description: "Relaxed harem pants that move softly, drape cleanly, and let your body breathe.", bestFor: "Travel · home · slow days · creative work · casual outings", tileClass: "tile-olive", tags: ["Soft drape", "Roomy rise", "Relaxed movement", "No-cling feel"], category: "women", type: "Harem Pants" }
];

const CategoryPage = ({ categoryName }) => {
  const { category: paramCategory } = useParams();
  const category = categoryName || paramCategory;
  
  if (!category) return null;

  const filteredProducts = allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  
  const categoryTitles = {
    men: "Men's First Drop",
    women: "Women's First Drop",
    unisex: "Unisex Collection"
  };

  return (
    <div className="container-osoul py-10 md:py-14">
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{category}</p>
        <h1 className="mt-2 font-serif text-4xl">{categoryTitles[category.toLowerCase()] || "Collection"}</h1>
      </header>

      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full py-20 text-center text-muted-foreground italic">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
