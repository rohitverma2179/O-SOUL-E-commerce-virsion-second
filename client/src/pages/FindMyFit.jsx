import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { allProducts } from '../data/productData';
import { API_BASE_URL } from '../lib/api';
import { ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';

const FindMyFit = () => {
  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    discomfort: '',
    activity: '',
    gender: ''
  });

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchLiveProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        if (data.success && data.data) {
          setLiveProducts(data.data);
        }
      } catch (error) {
        console.error("Could not fetch live products for Fit Finder", error);
      }
    };
    fetchLiveProducts();
  }, []);

  // Questions definitions
  const questions = [
    {
      id: 'discomfort',
      title: 'What bothers you most?',
      options: [
        { label: 'Waist digs', value: 'waist_digs' },
        { label: 'Crotch pulls', value: 'crotch_pulls' },
        { label: 'Thighs feel tight', value: 'thighs_tight' },
        { label: 'Fabric clings', value: 'fabric_clings' },
        { label: 'Shorts ride up', value: 'shorts_ride_up' },
        { label: 'Not sure', value: 'not_sure' }
      ]
    },
    {
      id: 'activity',
      title: 'Where do you spend most of your day?',
      options: [
        { label: 'Sitting at a desk', value: 'sitting' },
        { label: 'Walking & commuting', value: 'walking' },
        { label: 'Lounging at home', value: 'lounging' },
        { label: 'Travel & cafés', value: 'travel' }
      ]
    },
    {
      id: 'gender',
      title: 'Who are we shopping for?',
      options: [
        { label: 'Men', value: 'Men' },
        { label: 'Women', value: 'Women' },
        { label: 'Unisex preference', value: 'Unisex' }
      ]
    }
  ];

  const handleSelect = (value) => {
    const currentQuestionKey = questions[step - 1].id;
    setAnswers(prev => ({ ...prev, [currentQuestionKey]: value }));

    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      setStep(4); // Result step
    }
  };

  const restartFinder = () => {
    setAnswers({ discomfort: '', activity: '', gender: '' });
    setStep(1);
    setSelectedSize('');
    setSelectedColor('');
  };

  // Logic to determine recommended product
  const getRecommendation = () => {
    const { discomfort, activity, gender } = answers;

    const findProductBySlug = (slug) => {
      // Look up inside liveProducts first, fallback to static if empty or loading
      const foundLive = liveProducts.find(p => p.slug === slug);
      if (foundLive) return foundLive;
      return allProducts.find(p => p.slug === slug);
    };

    // Female matches
    if (gender === 'Women') {
      if (discomfort === 'waist_digs' || discomfort === 'crotch_pulls' || discomfort === 'thighs_tight' || discomfort === 'fabric_clings' || activity === 'sitting') {
        const item = findProductBySlug('womens-harem-pants');
        return {
          product: item,
          customTitle: "Women's Harem Pants",
          customDescription: "You need a generous rise for complete freedom of movement and a fluid, non-cling drape."
        };
      }
      const hoodie = findProductBySlug('womens-cropped-hoodie');
      return {
        product: hoodie,
        customTitle: "Women's Cropped Hoodie",
        customDescription: "You need ultra-soft French Terry warmth that holds its shape and keeps a clean silhouette."
      };
    }

    // Unisex matches
    if (gender === 'Unisex') {
      const unisexTee = findProductBySlug('unisex-boxy-tee');
      return {
        product: unisexTee,
        customTitle: "Unisex Boxy Tee",
        customDescription: "You need a boxy, structured fall that sits right without clinging."
      };
    }

    // Male matches / Default
    if (discomfort === 'shorts_ride_up' || activity === 'walking') {
      const shorts = findProductBySlug('mens-shorts');
      return {
        product: shorts,
        customTitle: "Everyday Shorts",
        customDescription: "You need mid-thigh ease and a clean fall that stops the ride-up."
      };
    }

    if (discomfort === 'waist_digs' || discomfort === 'crotch_pulls' || discomfort === 'thighs_tight' || activity === 'sitting') {
      const joggers = findProductBySlug('mens-joggers');
      return {
        product: joggers,
        customTitle: "Men's Joggers",
        customDescription: "You need a rise designed for sitting and a waistband that recovers without rolling."
      };
    }

    const pocketTee = findProductBySlug('mens-boxy-tee-with-pocket');
    return {
      product: pocketTee,
      customTitle: "Men's Boxy Tee With Pocket",
      customDescription: "You need a relaxed boxy cut that doesn't fight your body and a pocket where hands actually reach."
    };
  };

  const recommendation = step === 4 ? getRecommendation() : null;
  const product = recommendation?.product;

  // Initialize selected sizes and colors when recommendation is loaded
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(prev => prev || product.sizes[1] || product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(prev => prev || product.colors[0]);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      const cartProduct = {
        ...product,
        id: product._id || product.id
      };
      addToCart(cartProduct, selectedSize, selectedColor);
    }
  };

  const getWhatsAppLink = () => {
    if (!product) return '#';
    const message = `Hi O'Soul, I completed the Fit Finder! My recommended fit is "${recommendation.customTitle}" (Size: ${selectedSize}, Color: ${selectedColor}).`;
    return `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-4xl py-14 md:py-24">
        {/* Header (stays consistent) */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4 font-bold">Fit Finder</p>
          <h2 className="font-serif text-3xl sm:text-5xl leading-tight text-balance mb-4">
            Not sure what to buy? <br />
            <em className="not-italic text-clay font-serif italic font-normal">Start with your discomfort.</em>
          </h2>
          <p className="text-foreground/70 text-base">
            Answer three questions. We’ll recommend your first O’Soul product.
          </p>
        </div>

        {/* Wizard Box */}
        <div className="bg-secondary/30 border border-border rounded-lg p-6 sm:p-10 min-h-[400px] flex flex-col justify-between shadow-sm">
          {/* Progress Bars */}
          <div>
            <div className="flex gap-2 mb-8">
              <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-foreground' : 'bg-border/60'}`}></div>
              <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-foreground' : 'bg-border/60'}`}></div>
              <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-foreground' : 'bg-border/60'}`}></div>
            </div>

            {/* Questions Step */}
            {step <= 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3 font-semibold">Question {step} of 3</p>
                <h3 className="font-serif text-2xl sm:text-3xl mb-8 text-balance">{questions[step - 1].title}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {questions[step - 1].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className="text-left text-sm px-5 py-4 rounded-md border transition-all duration-200 bg-background border-border hover:border-foreground/50 hover:bg-secondary/10 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Step */}
            {step === 4 && product && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3 font-bold">Based on your answers, start with</p>
                <h3 className="font-serif text-3xl sm:text-4xl mb-3">{recommendation.customTitle}</h3>
                <p className="text-foreground/80 text-base mb-8 italic">{recommendation.customDescription}</p>

                <div className="grid md:grid-cols-12 gap-8 items-start pt-6 border-t border-border/50">
                  {/* Recommended Product Visuals */}
                  <div className="md:col-span-5 aspect-[3/4] rounded-lg overflow-hidden bg-secondary relative">
                    <img 
                      src={product.image} 
                      alt={product.alt} 
                      className="h-full w-full object-cover" 
                    />
                    <div className="absolute top-3 left-3 bg-olive/90 text-ivory text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-sm shadow">
                      Highly Recommended
                    </div>
                  </div>

                  {/* Settings / Config & Cart Actions */}
                  <div className="md:col-span-7 space-y-6">
                    <div>
                      <span className="text-2xl font-serif text-foreground font-medium">₹{product.price}</span>
                      {/* {product.onSale && (
                        <span className="ml-2 text-xs uppercase tracking-wider text-olive font-semibold">Free Shipping Included</span>
                      )} */}
                    </div>

                    {/* Color Selector */}
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-2">Select Color</label>
                      <div className="flex gap-2">
                        {product.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 text-xs uppercase tracking-wider rounded border transition ${
                              selectedColor === color
                                ? 'border-foreground bg-foreground text-background font-bold'
                                : 'border-border bg-background text-foreground/80 hover:border-foreground/50'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-2">Select Size</label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`h-9 w-12 text-xs rounded border transition flex items-center justify-center ${
                              selectedSize === size
                                ? 'border-foreground bg-foreground text-background font-bold'
                                : 'border-border bg-background text-foreground/80 hover:border-foreground/50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground italic mt-2 leading-relaxed">
                        Fit Advice: True to size for O'Soul's signature relaxed fit. If you prefer a baggier, oversized fit or intend to use it for active exercise, we recommend selecting one size up.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={handleAddToCart}
                        className="h-12 bg-foreground text-background px-6 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition shadow-lg flex items-center justify-center gap-2 group"
                      >
                        Add Recommended <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>

                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-12 border border-foreground text-foreground px-6 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" /> WhatsApp My Size
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions (e.g. Restart or Go Back) */}
          <div className="mt-8 pt-6 border-t border-border/40 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={restartFinder}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 font-bold"
              >
                <RefreshCw className="h-3 w-3" /> Restart Finder
              </button>
            ) : (
              <span className="text-xs text-muted-foreground italic">"If it makes you adjust, it failed."</span>
            )}
            
            {step === 4 && (
              <Link 
                to={`/products/${product?.slug}`}
                className="text-xs uppercase tracking-widest text-olive hover:text-foreground transition-all font-bold underline underline-offset-4"
              >
                View Product Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMyFit;