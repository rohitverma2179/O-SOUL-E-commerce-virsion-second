import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Native lazy loading with 'loading' attribute
 * - Async decoding for smoother main thread
 * - Fade-in animation on load
 * - Fallback handling
 * - Support for 'priority' (eager loading for above-the-fold content)
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  aspectRatio = 'aspect-square',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/* Placeholder / Shimmer */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-secondary/50" />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground text-xs text-center p-2">
          Image failed to load
        </div>
      )}

      <img
        src={src}
        alt={alt || ''}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
