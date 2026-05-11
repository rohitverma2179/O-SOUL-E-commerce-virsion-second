import React, { useState } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { allProducts } from '../../data/productData';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  
  if (!isOpen) return null;

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20">
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Search Container */}
      <div className="relative w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center border-b border-border px-4 py-4">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search for comfort..." 
              className="flex-1 bg-transparent px-4 text-lg outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4">
            <h4 className="mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">
              {query ? 'Search Results' : 'Suggested Searches'}
            </h4>
            
            <div className="space-y-4">
              {query && filteredProducts.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground italic">No results found for "{query}"</p>
              ) : (
                (query ? filteredProducts : allProducts.slice(0, 3)).map(product => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.slug}`} 
                    onClick={onClose}
                    className="flex items-center gap-4 group p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className={`h-12 w-12 rounded bg-secondary flex-shrink-0 tile-${product.tile} relative`}>
                      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)' }}></div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium group-hover:underline">{product.name}</h5>
                      <p className="text-xs text-muted-foreground italic">{product.emotional}</p>
                    </div>
                    <div className="ml-auto text-sm font-medium">₹{product.price}</div>
                  </Link>
                ))
              )}
            </div>
            
            {!query && (
              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-border">
                {['Joggers', 'Boxy Tee', 'Shorts', 'Harem'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
