import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';
import { allProducts } from '../data/productData';
import ProductCard from '../components/product/ProductCard';
import ComboCard from '../components/product/ComboCard';
import { ChevronRight } from 'lucide-react';
import OptimizedImage from '../components/common/OptimizedImage';

// Image imports
import heroImg1 from '../assets/product/BO7A9339.jpeg';
import heroImg2 from '../assets/product/(62).png';
import heroImg3 from '../assets/product/(67).png';
import heroImg4 from '../assets/product/crausal4.png';
import heroImg5 from '../assets/product/crausal5.jpeg';
import heroImg6 from '../assets/product/crausal6.png';
import heroImg7 from '../assets/product/crausal7.jpeg';
import heroVideo from '../assets/Man_sitting_on_chair_202607170128.mp4';

import catImgMen from '../assets/product/(4).png';
import catImgWomen from '../assets/product/(64).png';
import catImgUnisex from '../assets/home/unisex3.png';
import catImgCombos from '../assets/product/(10).png';

const products = allProducts;

const Home = () => {
  const [popup, setPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [liveProducts, setLiveProducts] = useState([]);
  const [liveCombos, setLiveCombos] = useState([]);
  const [heroContent, setHeroContent] = useState({
    tagline: '',
    titleLine1: 'Welcome to an  adjust-free world',

    titleLine2: "By O’Soul",
    description: 'Everyday joggers, shorts, and harem pants. Built for sitting, walking, and doing your actual day — without pulling, tugging, or thinking about what you\'re wearing.',
    primaryBtnText: 'Shop The First Drop →',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'Shop Combos',
    secondaryBtnLink: '/combos',
    images: [heroImg1, heroImg2, heroImg3]
  });

  const [activeReviewIndex, setActiveReviewIndex] = useState(1);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/homepage`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          const hero = data.data.find(section => section.sectionName === 'hero');
          if (hero) setHeroContent(hero.content);
        }
      } catch (error) {
        console.log("Using static homepage data (Server might be offline)");
      }
    };

    const fetchPopupData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/popup`);
        const data = await response.json();
        if (data.success && data.data && data.data.isActive) {
          const activePopup = data.data;
          // Use id + updatedAt so editing/saving in the admin panel shows it again
          const dismissalKey = `osou_popup_dismissed_${activePopup._id}_${activePopup.updatedAt}`;
          const isDismissed = localStorage.getItem(dismissalKey);
          if (!isDismissed) {
            setPopup(activePopup);
            setTimeout(() => {
              setShowPopup(true);
            }, 1500);
          }
        }
      } catch (error) {
        console.log("Could not load promo popup");
      }
    };

    const fetchProductsData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        if (data.success && data.data) {
          setLiveProducts(data.data);
        }
      } catch (error) {
        console.log("Could not load dynamic products");
      }
    };

    const fetchCombosData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/combos`);
        const data = await response.json();
        if (data.success && data.data) {
          setLiveCombos(data.data);
        }
      } catch (error) {
        console.log("Could not load dynamic combos");
      }
    };

    fetchHomepageData();
    fetchPopupData();
    fetchProductsData();
    fetchCombosData();
  }, []);

  const reviewsData = [
    {
      objection: "Will it actually fit?",
      quote: "“I didn't have to keep fixing it. First pair I've worn through a full college day without thinking about my pants once.”",
      author: "— Aanya, 22 · Mumbai"
    },
    {
      objection: "Will the waistband dig?",
      quote: "“It stayed in place without squeezing. After lunch I usually loosen something — not with these.”",
      author: "— Riya, 27 · Bangalore"
    },
    {
      objection: "Will my thighs feel tight?",
      quote: "“I always size up in pants because of my thighs. Took my usual size here. It fits. That was a moment.”",
      author: "— Priya, 26 · Delhi"
    },
    {
      objection: "Will the fabric feel cheap?",
      quote: "“Expected it to feel like any ₹999 basic. It doesn't. The fabric is soft but it has weight to it. Not cheap at all.”",
      author: "— Kartik, 31 · Mumbai"
    },
    {
      objection: "Will I wear it often?",
      quote: "“I've worn the joggers four times this week. I keep reaching for them. They're not the most exciting thing I own — but they're the most useful.”",
      author: "— Meera, 27 · Hyderabad"
    }
  ];

  // Carousel slides definition
  const carouselSlides = [
    { id: 1, image: heroImg1, showButtons: true },
    { id: 2, image: heroImg2, caption: "" },
    { id: 6, image: heroImg6 },
    { id: 3, image: heroImg3, caption: "" },
    { id: 5, image: heroImg5 },
    { id: 7, image: heroImg7 },
    { id: 4, image: heroImg4 },
  ];
  const N = carouselSlides.length;

  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(N);
  const scrollRef = React.useRef(null);

  const scrollToSlide = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = container.querySelectorAll('.snap-center');
    const targetIndex = N + index;
    const child = children[targetIndex];
    if (child) {
      container.scrollTo({
        left: child.offsetLeft - (container.offsetWidth - child.offsetWidth) / 2,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollPosition = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const children = container.querySelectorAll('.snap-center');

    let closestIndex = N;
    let minDiff = Infinity;
    const containerCenter = scrollPosition + containerWidth / 2;

    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(containerCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    if (closestIndex < N) {
      const targetChild = children[closestIndex + N];
      if (targetChild) {
        container.scrollTo({
          left: targetChild.offsetLeft - (containerWidth - targetChild.offsetWidth) / 2,
          behavior: 'auto'
        });
        setScrollIndex(closestIndex + N);
        setActiveSlide((closestIndex + N) % N);
        return;
      }
    } else if (closestIndex >= 2 * N) {
      const targetChild = children[closestIndex - N];
      if (targetChild) {
        container.scrollTo({
          left: targetChild.offsetLeft - (containerWidth - targetChild.offsetWidth) / 2,
          behavior: 'auto'
        });
        setScrollIndex(closestIndex - N);
        setActiveSlide((closestIndex - N) % N);
        return;
      }
    }

    setScrollIndex(closestIndex);
    setActiveSlide(closestIndex % N);
  };

  const handleMouseDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (moveEvent) => {
      const x = moveEvent.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = container.querySelectorAll('.snap-center');
    const targetIndex = scrollIndex + 1;
    const child = children[targetIndex];
    if (child) {
      container.scrollTo({
        left: child.offsetLeft - (container.offsetWidth - child.offsetWidth) / 2,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = container.querySelectorAll('.snap-center');
    const targetIndex = scrollIndex - 1;
    const child = children[targetIndex];
    if (child) {
      container.scrollTo({
        left: child.offsetLeft - (container.offsetWidth - child.offsetWidth) / 2,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Initial scroll to middle slide group
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const children = container.querySelectorAll('.snap-center');
        const targetChild = children[N];
        if (targetChild) {
          container.scrollTo({
            left: targetChild.offsetLeft - (container.offsetWidth - targetChild.offsetWidth) / 2,
            behavior: 'auto'
          });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [N]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [scrollIndex]);

  return (
    <div>
      {/* Full Screen Video Hero Section */}
      <section className='relative w-full h-[80vh] md:h-[calc(100vh-64px)] min-h-[550px] overflow-hidden bg-charcoal flex items-center justify-center'>
        {/* Background Video */}
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Premium Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/40" />

        {/* Content Container */}
        <div className="container-osoul relative z-10 flex flex-col items-center justify-center text-center text-ivory max-w-4xl px-4 select-none">
          {/* <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-ivory/80 font-bold animate-pulse">
            O'Soul / Movementosoul  Films
          </p> */}
          <h1 className="mt-6 font-serif text-4xl md:text-7xl leading-[1.1] text-ivory drop-shadow-md">
            Bottomwear that you don’t need to adjust.
            {/* Bottomwear that lets you move.<br />
            <span className="text-clay">Without the adjustments.</span> */}
          </h1>
          <p className="mt-6 max-w-xl text-sm md:text-base text-ivory/90 leading-relaxed font-light drop-shadow-sm">
            Joggers, shorts, and harem pants built for sitting, walking, and doing your actual day — designed to fit seamlessly into your life.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="h-12 md:h-14 inline-flex items-center justify-center rounded-md bg-olive px-8 md:px-10 text-[11px] font-bold uppercase tracking-widest text-ivory hover:bg-olive/90 transition-all duration-300 shadow-lg shadow-charcoal/20 md:hover:scale-[1.02]"
            >
              Shop The First Drop →
            </Link>
            <Link
              to="/fit-tests"
              className="h-12 md:h-14 inline-flex items-center justify-center rounded-md border border-ivory/40 bg-white/10 backdrop-blur-md px-8 md:px-10 text-[11px] font-bold uppercase tracking-widest text-ivory hover:bg-white hover:text-charcoal transition-all duration-300 md:hover:scale-[1.02]"
            >
              See Fit Tests
            </Link>
          </div>
        </div>

        {/* Bouncing Scroll Down Indicator */}
        {/* <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-80 cursor-pointer pointer-events-auto" 
          onClick={() => {
            const nextSection = document.querySelector('.border-b.border-border.bg-background');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span className="text-[9px] uppercase tracking-widest text-ivory/70 font-semibold">Scroll Down</span>
          <div className="h-6 w-[14px] rounded-full border border-ivory/40 flex justify-center p-[2px]">
            <div className="h-1.5 w-1.5 rounded-full bg-ivory animate-bounce" />
          </div>
        </div> */}
      </section>

      <section className="border-b border-border bg-background py-12 md:py-24 overflow-hidden">
        <div className="container-osoul text-center max-w-7xl mx-auto mb-16 px-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B6650] font-semibold">{heroContent.tagline}</p>
          <h2 className="mt-5 font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight">
            {heroContent.titleLine1} <span className="italic text-[#9B6650]">{heroContent.titleLine2}</span>
          </h2>
          <p className="mt-6 text-base text-foreground/80 leading-relaxed max-w-2xl mx-auto italic">
            {heroContent.description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to={heroContent.primaryBtnLink} className="h-12 rounded-md bg-foreground px-8 py-3 text-xs font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all flex items-center shadow-lg shadow-charcoal/10">
              {heroContent.primaryBtnText}
            </Link>
            <Link to={heroContent.secondaryBtnLink} className="h-12 rounded-md border border-foreground px-8 py-3 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-all flex items-center">
              {heroContent.secondaryBtnText}
            </Link>
          </div>

          {/* Trust Strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold">
            {["In stock now", "Secure Razorpay checkout", "Easy exchange support"].map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-olive/60" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Slider Section */}
        <div className="relative w-full max-w-7xl mx-auto">
          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing pb-8 select-none px-[17.5vw] md:px-[calc(50vw-175px)] xl:px-[465px]"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {[...Array(3)].map((_, groupIdx) => (
              <React.Fragment key={groupIdx}>
                {carouselSlides.map((slide, slideIdx) => (
                  <div
                    key={`${groupIdx}-${slide.id}`}
                    className="snap-center w-[65vw] md:w-[350px] shrink-0 relative overflow-hidden rounded-2xl bg-secondary aspect-[2/3] shadow-md group"
                  >
                    <OptimizedImage
                      src={slide.image}
                      alt={`O'Soul Collection Slide ${slide.id}`}
                      priority={groupIdx === 1 && slideIdx === 0}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 md:group-hover:scale-[1.02]"
                    />

                    {slide.showButtons && (
                      <div className="absolute bottom-6 left-6 flex gap-3 z-10">
                        {/* <Link
                          to="/men"
                          className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-white/90 transition-all shadow-md"
                        >
                          Men
                        </Link>
                        <Link
                          to="/women"
                          className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-white/90 transition-all shadow-md"
                        >
                          Women
                        </Link> */}
                      </div>
                    )}

                    {slide.caption && (
                      <div className="absolute bottom-6 left-6 z-10">
                        <div className="font-serif text-xl sm:text-2xl text-white italic drop-shadow-md">
                          {slide.caption}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Navigation Controls Bar */}
          <div className="mt-8 flex items-center justify-between px-6 max-w-md mx-auto">
            {/* Left Arrow Button */}
            <button
              onClick={() => handlePrev()}
              className="h-10 w-10 flex items-center justify-center rounded-md border border-border bg-background hover:bg-secondary/40 transition-colors shadow-sm cursor-pointer"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots Pagination */}
            <div className="flex gap-2">
              {[...Array(N)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === idx ? 'w-6 bg-foreground' : 'w-2 bg-foreground/20'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={() => handleNext()}
              className="h-10 w-10 flex items-center justify-center rounded-md border border-border bg-background hover:bg-secondary/40 transition-colors shadow-sm cursor-pointer"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Subtitle */}
          <div className="mt-6 text-center">
            <h3 className="font-serif text-xl sm:text-2xl italic tracking-tight text-foreground/95">
              The Adjust-Free Collection
            </h3>
          </div>
        </div>
      </section>


      {/* Products Section */}
      <section id="products" className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">The first drop</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Start with the pieces you'll actually repeat.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground  ">Soft. Clean. Made for the way your day actually moves. The first drop is small — because fit takes time.</p>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {liveProducts.slice(0, 6).map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Combos Section */}
      <section id="combos" className="bg-secondary/40 py-16 border-y border-border">
        <div className="container-osoul">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Combos</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Build a comfort fit in one click.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground  ">Combos for the days you don't want to think too much about what to wear.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {liveCombos.slice(0, 6).map(combo => (
              <ComboCard key={combo._id || combo.id} combo={combo} />
            ))}
          </div>
          {liveCombos.length > 6 && (
            <div className="mt-10 text-center">
              <Link to="/combos" className="inline-flex h-11 items-center rounded-md border border-foreground px-6 text-sm hover:bg-foreground hover:text-background transition-colors">
                View All Combos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Section */}
      <section className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Browse</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Shop by category.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <Link to="/men" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgMen}
                alt="Men's Category"
                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Men</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Boxy Tee With Pocket</li>
                <li>· Joggers</li>
                <li>· Shorts</li>
              </ul>
            </div>
          </Link>
          <Link to="/women" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgWomen}
                alt="Women's Category"
                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Women</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Cropped Hoodie</li>
                <li>· Harem Pants</li>
              </ul>
            </div>
          </Link>
          <Link to="/unisex" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgUnisex}
                alt="Unisex Category"
                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Unisex</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Boxy Tee</li>
              </ul>
            </div>
          </Link>
          <Link to="/combos" className="group relative block overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full bg-secondary relative">
              <img
                src={catImgCombos}
                alt="Combos Category"
                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-serif text-2xl text-ivory">Combos</div>
              <ul className="mt-1 space-y-0.5 text-xs text-ivory/80">
                <li>· Everyday Combo</li>
                <li>· Soft Movement</li>
                <li>· Full Rotation</li>
              </ul>
            </div>
          </Link>
        </div>
        <div className="mt-8 text-center">
          <Link to="/shop" className="inline-flex h-11 items-center rounded-md border border-foreground px-6 text-sm hover:bg-foreground hover:text-background transition-colors">
            Shop All
          </Link>
        </div>
      </section>

      {/* Why O'Soul Section */}
      <section className="bg-secondary/30 py-16 md:py-24 border-y border-border">
        <div className="container-osoul">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Why O'Soul</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl  ">Made for the comfort you notice once — then forget.</h2>
            <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground   leading-relaxed">
              Most clothes are designed to look right standing still. O'Soul is built for everything after that — the sitting, walking, commuting, working, and just living that fills your actual day.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "The fit is in the pattern, not the size.",
                desc: "Most brands grade sizing by adding one inch everywhere. That's lazy, and it's why your \"right size\" still pulls in the wrong places. O'Soul grades across waist, hip, thigh, rise, and inseam — independently. Because Indian bodies aren't just bigger or smaller versions of each other."
              },
              {
                num: "02",
                title: "The waistband is tested, not guessed.",
                desc: "Every waistband passes a 10-wear test and a 5-wash test before a single piece ships. It has to stretch, sit flat, and recover — not roll, fold, or dig in. The waistband is where most comfort fails. It's where we start."
              },
              {
                num: "03",
                title: "The fabric is chosen for movement, not feel in a store.",
                desc: "Soft is the starting point, not the finish line. O'Soul fabric also has to breathe, recover after stretch, resist cling, and hold its shape after repeated wear. A lot of fabrics fail one of those things. We test until something passes all of them."
              },
              {
                num: "04",
                title: "The rise comes first.",
                desc: "Rise is the measurement from waist to crotch — and it's what decides whether you can sit comfortably for three hours or spend the day adjusting. We set the rise first, then build the pant around it. It's a different design order. It produces a different result."
              }
            ].map((prop) => (
              <div key={prop.num} className="group rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-olive/30">
                <span className="text-[10px] uppercase tracking-widest text-olive/60 font-bold">{prop.num}</span>
                <h4 className="mt-3 font-serif text-lg   leading-tight group-hover:text-olive transition-colors">{prop.title}</h4>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed  ">{prop.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="font-serif text-xl md:text-2xl text-foreground  ">
              "If it makes you adjust, it failed. That's not marketing. It's the design brief."
            </p>
            <div className="mt-10">
              <Link to="/shop" className="inline-flex h-12 items-center rounded-md bg-foreground px-10 text-sm font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-lg shadow-charcoal/10">
                Shop The First Drop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Movement Proof Section */}
      {/* <section className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Movement proof</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl  ">Comfort should show when you move.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground  ">Not just in product photos. In sitting, walking, pockets, waistbands, and daily wear.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { num: "01", label: "Sits easy." },
            { num: "02", label: "Walks clean." },
            { num: "03", label: "Waist stays soft." },
            { num: "04", label: "Pockets work." },
            { num: "05", label: "Fabric falls right." }
          ].map((item) => (
            <div key={item.num} className="relative aspect-square overflow-hidden rounded-md tile-olive group">
              <div className="absolute inset-x-0 bottom-0 p-3 text-sm text-ivory">
                <span className="text-[10px] uppercase tracking-wider opacity-70">0{item.num}</span>
                <div className="font-serif text-base  ">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/fit-tests" className="text-sm underline underline-offset-4 hover:text-olive transition-colors   font-medium">See Fit Tests →</Link>
        </div>
      </section> */}

      {/* Social Proof / Reviews Section */}
      <section id="reviews" className="bg-secondary/40 border-y border-border/60 py-20 sm:py-28">
        <div className="container-osoul max-w-5xl">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4 font-medium">REVIEWS BY OBJECTION</p>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight text-balance mb-4">The exact things people notice after wearing O’Soul.</h2>
            <p className="text-foreground/70">Not random praise. Real doubts answered.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {reviewsData.map((rev, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIndex(idx)}
                className={`text-sm px-4 py-2.5 rounded-sm border transition-colors ${activeReviewIndex === idx
                  ? 'bg-foreground text-background border-foreground font-semibold'
                  : 'border-border bg-background text-foreground/80 hover:border-foreground/50'
                  }`}
              >
                {rev.objection}
              </button>
            ))}
          </div>

          <div className="bg-background border border-border rounded-sm p-8 sm:p-12 max-w-3xl min-h-[200px] flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-bold">
                {reviewsData[activeReviewIndex].objection.toUpperCase()}
              </p>
              <p className="text-2xl sm:text-3xl leading-snug text-balance mb-6 text-foreground font-medium" style={{ fontFamily: '"Fraunces", serif' }}>
                {reviewsData[activeReviewIndex].quote}
              </p>
            </div>
            <p className="text-sm text-foreground/70">
              {reviewsData[activeReviewIndex].author}
            </p>
          </div>

          <p className="mt-8 text-xs text-muted-foreground  ">
            Reviews shown reflect early customer feedback themes from the first batch.
          </p>
        </div>
      </section>

      {/* Sizing & FAQ Section */}
      <section className="container-osoul py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Sizing</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl  ">Pick your usual size. Keep it simple.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground   leading-relaxed">
            O'Soul is made for relaxed everyday comfort. If you're between sizes, choose based on how much room you like.
          </p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h4 className="font-serif text-lg   mb-6 border-b border-border pb-2">Size guide</h4>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
              {[
                { s: "S", d: "Closer everyday fit." },
                { s: "M", d: "Most common regular fit." },
                { s: "L", d: "More relaxed fit." },
                { s: "XL", d: "Roomier comfort." },
                { s: "XXL", d: "Maximum ease." }
              ].map((item) => (
                <div key={item.s} className="flex justify-between border-b border-border pb-2  ">
                  <span className="font-medium text-foreground">{item.s}</span>
                  <span className="text-muted-foreground">{item.d}</span>
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-1.5 text-xs text-muted-foreground   leading-relaxed">
              <li>· Hate tightness? Size up.</li>
              <li>· Like a sharper fit? Size down.</li>
              <li>· For boxy tees, usual size gives boxy fall.</li>
              <li>· For shorts, size up if thighs are fuller.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h4 className="font-serif text-lg   mb-6 border-b border-border pb-2">FAQ</h4>
            <div className="mt-4 space-y-1">
              {[
                { q: "What size should I choose?", a: "Choose your usual size for relaxed everyday comfort. If you are between sizes and hate tightness, choose the larger size." },
                { q: "Will these look too casual?", a: "No. The fits are relaxed, but the silhouettes are kept clean so you can wear them outside comfortably." },
                { q: "Are the joggers skinny?", a: "No. They are made for easy daily comfort, not tight compression." },
                { q: "Can I exchange if the size doesn't work?", a: "Yes, exchange support is available as per policy." },
                { q: "How do I contact support?", a: "Use the customer support link in the footer or order confirmation page." }
              ].map((faq, idx) => (
                <details key={idx} className="border-b border-border/60 py-3 group cursor-pointer">
                  <summary className="flex items-center justify-between text-sm font-medium hover:text-olive transition-colors list-none">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 opacity-40" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground   leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Note Section */}
      {/* <section className="bg-foreground py-16 text-background text-center">
        <div className="container-osoul max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-background/60 font-medium">Founder note</p>
          <h2 className="mt-4 font-serif text-4xl  ">Why O'Soul exists.</h2>
          <div className="mt-8 space-y-4 text-base text-background/80 leading-relaxed   font-light">
            <p>Most people don't need more clothes. They need clothes that don't keep bothering them.</p>
            <p>O'Soul exists for that feeling: wearing something soft, clean, and easy enough that you stop thinking about it.</p>
            <p className="mt-6 font-serif text-xl text-background">No more fixing. No more fuss. Just clothes that let you move through your day.</p>
          </div>
          <p className="mt-6 text-sm text-background/60   font-medium">— Manan Sadhwani, Founder, O'Soul</p>
          <div className="mt-8">
            <Link to="/shop" className="inline-flex h-11 items-center rounded-md bg-background px-8 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-background/90 transition-all">
              Shop The First Drop
            </Link>
          </div>
        </div>
      </section> */}

      {/* Email / Drop List Section */}
      {/* <section className="bg-secondary/20 py-20 border-t border-border">
        <div className="container-osoul max-w-xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl  ">Join the No-Adjust List.</h2>
          <p className="mt-4 text-muted-foreground   leading-relaxed">
            Be first to know when the next drop goes live. No spam. Just useful drop updates and the occasional honest note from the founder.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm focus:border-olive focus:outline-none transition-colors  "
              required
            />
            <button
              type="submit"
              className="h-12 rounded-md bg-foreground px-8 text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all"
            >
              Join the List →
            </button>
          </form>
          <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            Unsubscribe anytime. We won't email you unless it's worth your time.
          </p>
        </div>
      </section> */}

      {/* Closing CTA Section */}
      <section className="container-osoul py-24 md:py-32 text-center">
        <h2 className="font-serif text-4xl md:text-5xl   tracking-tight">Start with one piece you'll actually repeat.</h2>
        <p className="mt-6 text-muted-foreground   text-lg leading-relaxed">
          First drop live on all orders. <br className="md:hidden" />
          <span className="text-olive font-medium">Small batch — no restocks.</span>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="h-14 flex items-center px-10 rounded-md bg-foreground text-[11px] font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-xl shadow-charcoal/10">
            Shop The First Drop →
          </Link>
          <Link to="/combos" className="h-14 flex items-center px-10 rounded-md border border-border text-[11px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
            Shop Combos
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
          Secure Razorpay checkout · Easy exchange support · In stock now
        </div>
      </section>
      {/* Promo Popup Modal */}
      {showPopup && popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-background border border-border w-full max-w-md overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => {
                const dismissalKey = `osou_popup_dismissed_${popup._id}_${popup.updatedAt}`;
                localStorage.setItem(dismissalKey, 'true');
                setShowPopup(false);
              }}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 md:hover:scale-105 transition-all outline-none"
              aria-label="Close popup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Banner Image (Full Height / No Cropping) */}
            {popup.imageUrl ? (
              <div className="relative w-full overflow-hidden">
                <img src={popup.imageUrl} alt="" className="w-full h-auto block" />
              </div>
            ) : (
              <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs  ">
                <span>Please upload a banner image in the Admin Panel</span>
              </div>
            )}

            {/* Content: Only the Button */}
            <div className="p-5 text-center bg-background border-t border-slate-100 flex justify-center">
              <Link
                to={popup.link || '/shop'}
                onClick={() => {
                  const dismissalKey = `osou_popup_dismissed_${popup._id}_${popup.updatedAt}`;
                  localStorage.setItem(dismissalKey, 'true');
                  setShowPopup(false);
                }}
                className="w-full h-12 inline-flex items-center justify-center rounded-md bg-foreground px-10 text-xs font-bold uppercase tracking-widest text-background hover:bg-foreground/90 transition-all shadow-md"
              >
                {popup.buttonText || 'Shop Now'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;