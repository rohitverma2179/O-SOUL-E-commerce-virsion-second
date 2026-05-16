import React, { useState, useEffect, useRef } from 'react';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Native lazy loading with 'loading' attribute
 * - Async decoding for smoother main thread
 * - Fade-in animation on load
 * - Fallback handling
 * - Support for 'priority' (eager loading for above-the-fold content)
 * - Robust handling of src changes and cached images
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
  const imgRef = useRef(null);

  // Use a state-like variable during render to reset isLoaded if src changes
  // this is faster than useEffect and prevents flashing old images
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setIsLoaded(false);
    setError(false);
    setPrevSrc(src);
  }

  // Handle cached images that might load before the component mounts/renders
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
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
        ref={imgRef}
        key={src} // Force fresh image element when src changes
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
