import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { fetchCatalog } from '../lib/api';

const CategoryPage = ({ categoryName }) => {
  const { category: paramCategory } = useParams();
  const category = categoryName || paramCategory;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCatalog('products')
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  if (!category) return null;

  const filteredProducts = products.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );
  
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
        {loading ? (
          <p className="col-span-full py-20 text-center text-muted-foreground italic">Loading products...</p>
        ) : error ? (
          <p className="col-span-full py-20 text-center text-destructive italic">{error}</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={{ ...product, id: product._id }} />
          ))
        ) : (
          <p className="col-span-full py-20 text-center text-muted-foreground italic">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

