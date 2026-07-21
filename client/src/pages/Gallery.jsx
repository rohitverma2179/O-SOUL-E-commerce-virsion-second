import React, { useEffect } from 'react';

const Gallery = () => {
  const images = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg}', { eager: true });
  
  const imagePaths = Object.keys(images).sort((a, b) => {
    const matchA = a.match(/(\d+)\.(jpeg|jpg|png)$/i);
    const matchB = b.match(/(\d+)\.(jpeg|jpg|png)$/i);
    const numA = matchA ? parseInt(matchA[1], 10) : 0;
    const numB = matchB ? parseInt(matchB[1], 10) : 0;
    return numA - numB;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen py-14 md:py-24">
      <div className="container-osoul">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">O'Soul Assets</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl leading-tight">Product Images Gallery</h1>
          {/* <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground italic">
            A visual directory of all 80 product images in `client/src/assets/product`. Use the image numbers here to update your product listings.
          </p> */}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {imagePaths.map((path) => {
            const fileName = path.split('/').pop();
            return (
              <div key={path} className="border border-border rounded-lg p-3 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[3/5] rounded-md overflow-hidden bg-secondary relative">
                  <img 
                    src={images[path].default || images[path]} 
                    alt={fileName} 
                    className="w-full h-full object-cover md:hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3">
                  {/* <p className="text-xs font-bold text-foreground text-center truncate">{fileName}</p> */}
                  {/* <p className="text-[10px] text-muted-foreground text-center mt-0.5">Asset Reference</p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
