import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

import { allProducts } from '../data/productData';

const CategoryPage = ({ categoryName }) => {
  const { category: paramCategory } = useParams();
  const category = categoryName || paramCategory;
  
  if (!category) return null;

  const filteredProducts = allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  
  const categoryTitles = {
    men: "Bottoms built for your actual day.",
    women: "The comfort you keep reaching for.",
    unisex: "Boxy fits. Easy days."
  };

  return (
    <div className="container-osoul py-10 md:py-14">
      <header className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{category}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl italic tracking-tight">{categoryTitles[category.toLowerCase()] || "Collection"}</h1>
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
