import React, { useCallback, useEffect, useState } from 'react';
import { PackagePlus, Trash2, Upload, Edit2, Sliders, Star, X, AlertTriangle } from 'lucide-react';
import { API_BASE_URL, fetchCatalog } from '../../lib/api';

const initialProduct = {
  name: '', slug: '', price: '', originalPrice: '', stock: '0', category: 'Unisex', type: 'Tees', shortDescription: '',
  bestFor: '', colors: 'Black, Olive', sizes: 'S, M, L, XL, XXL', tags: '',
  weight: '500', length: '10', width: '10', height: '10', rating: 5
};
const initialCombo = {
  title: '', headline: '', description: '', valueLine: '', productNames: '', originalPrice: '', discountPercent: '', discountedPrice: ''
};

const generateCombinations = (colorsStr, sizesStr) => {
  const splitList = (val) => String(val || '').split(',').map(s => s.trim()).filter(Boolean);
  const colors = splitList(colorsStr);
  const sizes = splitList(sizesStr);
  if (colors.length === 0 && sizes.length === 0) return [];
  const activeColors = colors.length > 0 ? colors : ['Default'];
  const activeSizes = sizes.length > 0 ? sizes : ['Default'];
  
  const combos = [];
  activeColors.forEach(c => {
    activeSizes.forEach(s => {
      combos.push({ color: c, size: s, stock: 0 });
    });
  });
  return combos;
};

const CatalogManagement = () => {
  const [tab, setTab] = useState('products');
  const [product, setProduct] = useState(initialProduct);
  const [combo, setCombo] = useState(initialCombo);
  const [productImage, setProductImage] = useState(null);
  const [productBackImage, setProductBackImage] = useState(null);
  const [comboImages, setComboImages] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  // Variant Stock and Product Edit states
  const [variantPlanner, setVariantPlanner] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editVariants, setEditVariants] = useState([]);
  const [editProductImage, setEditProductImage] = useState(null);
  const [editProductBackImage, setEditProductBackImage] = useState(null);

  const loadCatalog = useCallback(async () => {
    try { setCatalog(await fetchCatalog(tab)); }
    catch (error) { setMessage(error.message); }
  }, [tab]);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  // Sync variant planner when tab changes
  useEffect(() => {
    if (tab === 'products') {
      setVariantPlanner(generateCombinations(product.colors, product.sizes));
    }
  }, [tab]);

  const update = (setter) => (event) => {
    const { name, value, type, checked } = event.target;
    setter((current) => {
      const next = { ...current, [name]: type === 'checkbox' ? checked : value };
      if (setter === setProduct && (name === 'colors' || name === 'sizes')) {
        const nextCombos = generateCombinations(next.colors, next.sizes);
        setVariantPlanner(nextCombos);
        const totalStock = nextCombos.reduce((sum, v) => sum + v.stock, 0);
        next.stock = totalStock;
      }
      return next;
    });
  };

  const updatePlannerStock = (index, value) => {
    const nextPlanner = [...variantPlanner];
    nextPlanner[index].stock = Math.max(0, parseInt(value) || 0);
    setVariantPlanner(nextPlanner);
    const totalStock = nextPlanner.reduce((sum, v) => sum + v.stock, 0);
    setProduct(current => ({ ...current, stock: totalStock }));
  };

  const startEdit = (item) => {
    setEditingProduct({
      ...item,
      colors: Array.isArray(item.colors) ? item.colors.join(', ') : item.colors || '',
      sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : item.sizes || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      rating: item.rating || 5
    });
    setEditVariants(item.variants || []);
    setEditProductImage(null);
    setEditProductBackImage(null);
  };

  const updateEditingField = (event) => {
    const { name, value } = event.target;
    setEditingProduct(curr => {
      const next = { ...curr, [name]: value };
      if (name === 'colors' || name === 'sizes') {
        const splitList = (val) => String(val || '').split(',').map(s => s.trim()).filter(Boolean);
        const nextColors = splitList(next.colors);
        const nextSizes = splitList(next.sizes);
        const activeColors = nextColors.length > 0 ? nextColors : ['Default'];
        const activeSizes = nextSizes.length > 0 ? nextSizes : ['Default'];

        const newVariants = [];
        activeColors.forEach(c => {
          activeSizes.forEach(s => {
            const existing = editVariants.find(
              v => v.color?.toLowerCase() === c.toLowerCase() && v.size?.toLowerCase() === s.toLowerCase()
            );
            newVariants.push({
              color: c,
              size: s,
              stock: existing ? existing.stock : 0
            });
          });
        });
        setEditVariants(newVariants);
      }
      return next;
    });
  };

  const adjustEditVariantStock = (index, amount) => {
    setEditVariants(curr => {
      const next = [...curr];
      next[index].stock = Math.max(0, (next[index].stock || 0) + amount);
      return next;
    });
  };

  const setEditVariantStockDirectly = (index, val) => {
    setEditVariants(curr => {
      const next = [...curr];
      next[index].stock = Math.max(0, parseInt(val) || 0);
      return next;
    });
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    
    const totalStock = editVariants.length > 0 ? editVariants.reduce((sum, v) => sum + (v.stock || 0), 0) : editingProduct.stock;

    const form = new FormData();
    Object.entries(editingProduct).forEach(([key, value]) => {
      if (key !== 'variants' && key !== 'image' && key !== 'backImage') {
        form.append(key, value);
      }
    });

    form.append('variants', JSON.stringify(editVariants));
    form.append('stock', totalStock);

    if (editProductImage) {
      form.append('image', editProductImage);
    }
    if (editProductBackImage) {
      form.append('backImage', editProductBackImage);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        body: form,
        credentials: 'include'
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Update failed');
      
      setCatalog(current => current.map(item => item._id === editingProduct._id ? payload.data : item));
      setMessage('Product updated successfully.');
      setEditingProduct(null);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const manualComboItems = combo.productNames.split(',').map((name) => name.trim()).filter(Boolean);
    if (tab === 'combos' && !manualComboItems.length) {
      setMessage('Enter at least one product name for the combo.');
      return;
    }
    if (tab === 'products' && productImage && productImage.size > 3 * 1024 * 1024) {
      setMessage('Product image must be less than 3MB.');
      return;
    }
    if (tab === 'products' && productBackImage && productBackImage.size > 3 * 1024 * 1024) {
      setMessage('Secondary product image must be less than 3MB.');
      return;
    }
    if (tab === 'combos' && comboImages.some((file) => file.size > 3 * 1024 * 1024)) {
      setMessage('Each combo image must be less than 3MB.');
      return;
    }
    setBusy(true);
    setMessage('');
    const form = new FormData();
    const values = tab === 'products' ? product : combo;
    Object.entries(values).forEach(([key, value]) => form.append(key, value));
    if (tab === 'combos') form.append('items', JSON.stringify(manualComboItems.map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), price: 0 }))));
    if (tab === 'products' && productImage) form.append('image', productImage);
    if (tab === 'products' && productBackImage) form.append('backImage', productBackImage);
    if (tab === 'combos') comboImages.forEach((image) => form.append('images', image));

    if (tab === 'products') {
      form.append('variants', JSON.stringify(variantPlanner));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${tab}`, { method: 'POST', body: form, credentials: 'include' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Upload failed');
      setMessage(`${tab === 'products' ? 'Product' : 'Combo'} uploaded successfully.`);
      setProduct(initialProduct);
      setCombo(initialCombo);
      setProductImage(null);
      setProductBackImage(null);
      setComboImages([]);
      setVariantPlanner(generateCombinations(initialProduct.colors, initialProduct.sizes));
      formElement.reset();
      setCatalog((current) => [...current, payload.data]);
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this catalog item?')) return;
    const response = await fetch(`${API_BASE_URL}/${tab}/${id}`, { method: 'DELETE', credentials: 'include' });
    if (response.ok) setCatalog((current) => current.filter((item) => item._id !== id));
  };

  const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-olive';
  const comboSavings = Math.max(0, Number(combo.originalPrice || 0) - Number(combo.discountedPrice || 0));
  const comboDiscountPercent = Number(combo.originalPrice) > 0 ? Math.round((comboSavings / Number(combo.originalPrice)) * 100) : 0;

  const updateComboDiscount = (event) => {
    const discountPercent = Math.min(100, Math.max(0, Number(event.target.value)));
    setCombo((current) => {
      const orig = Number(current.originalPrice) || 0;
      const finalPrice = orig === 0 ? '' : Math.round(orig * (100 - discountPercent) / 100);
      return {
        ...current,
        discountPercent: event.target.value === '' ? '' : event.target.value,
        discountedPrice: finalPrice
      };
    });
  };

  const updateComboOriginalPrice = (event) => {
    const originalPrice = event.target.value;
    setCombo((current) => {
      const orig = Number(originalPrice) || 0;
      const pct = Number(current.discountPercent || 0);
      const finalPrice = orig === 0 ? '' : Math.round(orig * (100 - pct) / 100);
      return {
        ...current,
        originalPrice,
        discountedPrice: finalPrice
      };
    });
  };

  const updateComboDiscountedPrice = (event) => {
    const discountedPrice = event.target.value;
    setCombo((current) => {
      const orig = Number(current.originalPrice) || 0;
      const disc = Number(discountedPrice) || 0;
      const pct = orig === 0 ? 0 : Math.round(((orig - disc) / orig) * 100);
      return {
        ...current,
        discountedPrice,
        discountPercent: discountedPrice === '' ? '' : Math.min(100, Math.max(0, pct))
      };
    });
  };

  const handleProductImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setMessage('Product image must be less than 3MB.');
        event.target.value = null;
        setProductImage(null);
      } else {
        setMessage('');
        setProductImage(file);
      }
    }
  };

  const handleProductBackImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setMessage('Secondary product image must be less than 3MB.');
        event.target.value = null;
        setProductBackImage(null);
      } else {
        setMessage('');
        setProductBackImage(file);
      }
    }
  };

  const handleComboImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const oversized = files.some((file) => file.size > 3 * 1024 * 1024);
    if (oversized) {
      setMessage('Each combo image must be less than 3MB.');
      event.target.value = null;
      setComboImages([]);
    } else {
      setMessage('');
      setComboImages(files);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive">Catalog CMS</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Products & combos</h1>
        <p className="mt-2 text-slate-500">Upload storefront items without touching code.</p>
      </div>

      <div className="flex gap-2 rounded-xl bg-slate-200/60 p-1 w-fit">
        {['products', 'combos'].map((name) => (
          <button key={name} onClick={() => { setTab(name); setMessage(''); }} className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize ${tab === name ? 'bg-white text-olive shadow-sm' : 'text-slate-500'}`}>{name}</button>
        ))}
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3"><PackagePlus className="text-olive" /><h2 className="text-xl font-bold">Add {tab === 'products' ? 'product' : 'combo'}</h2></div>
        {tab === 'products' ? (
          <div className="grid gap-4 md:grid-cols-2">
            <input className={fieldClass} name="name" value={product.name} onChange={update(setProduct)} placeholder="Product name" required />
            <input className={fieldClass} name="slug" value={product.slug} onChange={update(setProduct)} placeholder="Unique slug (mens-joggers)" pattern="[a-z0-9-]+" required />
            <input className={fieldClass} name="price" type="number" min="0" value={product.price} onChange={update(setProduct)} placeholder="Offer / Discounted Price" required />
            <input className={fieldClass} name="originalPrice" type="number" min="0" value={product.originalPrice} onChange={update(setProduct)} placeholder="Original Price / MRP (Optional)" />
            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Quantity (Total Stock)</span>
              <input className={`${fieldClass} bg-slate-50 cursor-not-allowed`} name="stock" type="number" value={product.stock} readOnly placeholder="Calculated from variants" />
            </label>
            <select className={fieldClass} name="category" value={product.category} onChange={update(setProduct)}><option>Men</option><option>Women</option><option>Unisex</option></select>
            <input className={fieldClass} name="type" value={product.type} onChange={update(setProduct)} placeholder="Type (Tees, Joggers...)" required />
            <input className={fieldClass} name="bestFor" value={product.bestFor} onChange={update(setProduct)} placeholder="Best for" />
            <textarea className={`${fieldClass} md:col-span-2`} name="shortDescription" value={product.shortDescription} onChange={update(setProduct)} placeholder="Short description" required />
            <input className={fieldClass} name="colors" value={product.colors} onChange={update(setProduct)} placeholder="Colors, comma separated" />
            <input className={fieldClass} name="sizes" value={product.sizes} onChange={update(setProduct)} placeholder="Sizes, comma separated" />
            <input className={fieldClass} name="tags" value={product.tags} onChange={update(setProduct)} placeholder="Tags, comma separated" />
            
            {/* Variant Stock Planner */}
            {variantPlanner.length > 0 && (
              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">Initial Variant Stock Planner</span>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                  {variantPlanner.map((vp, index) => (
                    <div key={index} className="flex flex-col gap-1.5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <span className="text-xs font-semibold text-slate-600 truncate">{vp.color} - {vp.size}</span>
                      <input 
                        className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-olive"
                        type="number"
                        min="0"
                        value={vp.stock}
                        onChange={(e) => updatePlannerStock(index, e.target.value)}
                        placeholder="Stock"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Rating Input */}
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Rating ({product.rating || 5} Stars)</span>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setProduct(curr => ({ ...curr, rating: num }))}
                    className="text-2xl transition-all duration-200 text-amber-500 hover:scale-110"
                  >
                    {num <= (product.rating || 5) ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </label>
            
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shipping Details (Shipmozo)</span>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <input className={fieldClass} name="weight" type="number" min="1" value={product.weight} onChange={update(setProduct)} placeholder="Weight (grams)" required />
                <input className={fieldClass} name="length" type="number" min="1" value={product.length} onChange={update(setProduct)} placeholder="Length (cm)" required />
                <input className={fieldClass} name="width" type="number" min="1" value={product.width} onChange={update(setProduct)} placeholder="Width (cm)" required />
                <input className={fieldClass} name="height" type="number" min="1" value={product.height} onChange={update(setProduct)} placeholder="Height (cm)" required />
              </div>
            </label>

            <div className="grid gap-4 md:grid-cols-2 md:col-span-2">
              <label className={`${fieldClass} flex cursor-pointer items-center gap-3`}><Upload size={18} /><span className="truncate">{productImage?.name || 'Choose primary image (front)'}</span><input className="hidden" type="file" accept="image/*" onChange={handleProductImageChange} required /></label>
              <label className={`${fieldClass} flex cursor-pointer items-center gap-3`}><Upload size={18} /><span className="truncate">{productBackImage?.name || 'Choose secondary image (back/hover)'}</span><input className="hidden" type="file" accept="image/*" onChange={handleProductBackImageChange} /></label>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <input className={fieldClass} name="title" value={combo.title} onChange={update(setCombo)} placeholder="Combo title" required />
            <input className={fieldClass} name="headline" value={combo.headline} onChange={update(setCombo)} placeholder="Headline" required />
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Original price</span><input className={fieldClass} name="originalPrice" type="number" min="0" value={combo.originalPrice} onChange={updateComboOriginalPrice} placeholder="Enter original total price" required /></label>
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Discount percentage</span><input className={fieldClass} name="discountPercent" type="number" min="0" max="100" value={combo.discountPercent} onChange={updateComboDiscount} placeholder="Example: 10" required /></label>
            <label className="space-y-1.5 md:col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Price after discount</span><input className={fieldClass} name="discountedPrice" type="number" min="0" value={combo.discountedPrice} onChange={updateComboDiscountedPrice} placeholder="Final discounted price" required /></label>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Discount strategy</p>
              <p className="mt-1 text-sm text-emerald-800">{combo.productNames.split(',').map((name) => name.trim()).filter(Boolean).length} clothing item(s) · Customer saves ₹{comboSavings} · {comboDiscountPercent}% off · Final price ₹{combo.discountedPrice || 0}</p>
            </div>
            <textarea className={`${fieldClass} md:col-span-2`} name="description" value={combo.description} onChange={update(setCombo)} placeholder="Combo description" required />
            <input className={`${fieldClass} md:col-span-2`} name="valueLine" value={combo.valueLine} onChange={update(setCombo)} placeholder="Value Line / Slogan (e.g. Buy all three together. Save ₹194.)" />
            <label className="space-y-1.5 md:col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Product names</span><input className={fieldClass} name="productNames" value={combo.productNames} onChange={update(setCombo)} placeholder="T-shirt, Joggers, Hoodie" required /><span className="block text-xs text-slate-400">Separate each product name with a comma.</span></label>
            <label className={`${fieldClass} flex cursor-pointer items-center gap-3 md:col-span-2`}><Upload size={18} /><span>{comboImages.length ? `${comboImages.length} image(s) selected` : 'Choose up to 5 combo images'}</span><input className="hidden" type="file" accept="image/*" multiple onChange={handleComboImagesChange} required /></label>
          </div>
        )}
        <button disabled={busy} className="mt-6 rounded-xl bg-olive px-6 py-3 font-bold text-white hover:bg-olive/90 disabled:opacity-50">{busy ? 'Uploading...' : `Upload ${tab === 'products' ? 'product' : 'combo'}`}</button>
        {message && <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>}
      </form>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Uploaded {tab}</h2>
        <div className="divide-y divide-slate-100">
          {catalog.map((item) => {
            const hasVariants = tab === 'products' && item.variants && item.variants.length > 0;
            const lowStockCount = hasVariants ? item.variants.filter(v => v.stock > 0 && v.stock < 5).length : 0;
            const outOfStockCount = hasVariants ? item.variants.filter(v => v.stock === 0).length : 0;
            
            return (
              <div key={item._id} className="flex items-center gap-4 py-4">
                <img className="h-14 w-14 rounded-lg object-cover bg-slate-50" src={item.image || item.images?.[0]} alt="" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{item.name || item.title}</p>
                  
                  {tab === 'products' && item.rating && (
                    <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xs">
                          {i < item.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-500 mt-0.5">
                    ₹{item.price || item.discountedPrice}
                    {tab === 'products' && ` · ${item.stock} total stock`}
                  </p>
                  
                  {hasVariants && (
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {lowStockCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          <AlertTriangle size={10} /> {lowStockCount} low in stock
                        </span>
                      )}
                      {outOfStockCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                          <AlertTriangle size={10} /> {outOfStockCount} out of stock
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  {tab === 'products' && (
                    <button 
                      onClick={() => startEdit(item)} 
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 transition" 
                      aria-label="Edit product and stock"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => remove(item._id)} 
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition" 
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {!catalog.length && <p className="py-8 text-center text-slate-400">No uploaded {tab} yet.</p>}
        </div>
      </section>

      {/* Product Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold">Edit Product & Inventory</h2>
                <p className="text-xs text-slate-500 mt-1">Manage ratings, product details, and size-color stock levels.</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)} 
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <form onSubmit={saveEdit} className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Left Side: Product Fields */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">Product Info</h3>
                  
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Name</span>
                    <input className={fieldClass} name="name" value={editingProduct.name} onChange={updateEditingField} required />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Slug</span>
                    <input className={fieldClass} name="slug" value={editingProduct.slug} onChange={updateEditingField} required />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Offer Price (₹)</span>
                      <input className={fieldClass} name="price" type="number" min="0" value={editingProduct.price} onChange={updateEditingField} required />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Original Price / MRP (₹)</span>
                      <input className={fieldClass} name="originalPrice" type="number" min="0" value={editingProduct.originalPrice || ''} onChange={updateEditingField} />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Category</span>
                      <select className={fieldClass} name="category" value={editingProduct.category} onChange={updateEditingField}>
                        <option>Men</option>
                        <option>Women</option>
                        <option>Unisex</option>
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Type</span>
                      <input className={fieldClass} name="type" value={editingProduct.type} onChange={updateEditingField} required />
                    </label>
                  </div>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Short Description</span>
                    <textarea className={`${fieldClass} h-20 resize-none`} name="shortDescription" value={editingProduct.shortDescription} onChange={updateEditingField} required />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Colors</span>
                      <input className={fieldClass} name="colors" value={editingProduct.colors} onChange={updateEditingField} placeholder="Comma separated list" />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Sizes</span>
                      <input className={fieldClass} name="sizes" value={editingProduct.sizes} onChange={updateEditingField} placeholder="Comma separated list" />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Best For</span>
                      <input className={fieldClass} name="bestFor" value={editingProduct.bestFor} onChange={updateEditingField} />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Tags</span>
                      <input className={fieldClass} name="tags" value={editingProduct.tags} onChange={updateEditingField} />
                    </label>
                  </div>

                  {/* Rating Field in Edit Modal */}
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Rating ({editingProduct.rating} Stars)</span>
                    <div className="flex items-center gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setEditingProduct(curr => ({ ...curr, rating: num }))}
                          className="text-2xl transition-all duration-200 text-amber-500 hover:scale-110"
                        >
                          {num <= editingProduct.rating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </label>

                  {/* Image Input in Edit Modal */}
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Product Image (Leave blank to keep existing)</span>
                    <label className={`${fieldClass} flex cursor-pointer items-center gap-3 bg-slate-50`}>
                      <Upload size={18} />
                      <span className="truncate">{editProductImage?.name || 'Choose new primary image'}</span>
                      <input className="hidden" type="file" accept="image/*" onChange={(e) => setEditProductImage(e.target.files[0])} />
                    </label>
                  </label>

                  {/* Secondary Image Input in Edit Modal */}
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Secondary Image (Leave blank to keep existing)</span>
                    <label className={`${fieldClass} flex cursor-pointer items-center gap-3 bg-slate-50`}>
                      <Upload size={18} />
                      <span className="truncate">{editProductBackImage?.name || 'Choose new secondary image'}</span>
                      <input className="hidden" type="file" accept="image/*" onChange={(e) => setEditProductBackImage(e.target.files[0])} />
                    </label>
                  </label>
                </div>

                {/* Right Side: Inventory Dashboard & Stock Editor */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2 flex items-center gap-2">
                    <Sliders size={16} /> Inventory Dashboard
                  </h3>
                  
                  {/* Stock Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total Stock</div>
                      <div className="text-lg font-bold text-olive mt-0.5">
                        {editVariants.length > 0 ? editVariants.reduce((sum, v) => sum + (v.stock || 0), 0) : editingProduct.stock}
                      </div>
                    </div>
                    <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-2">
                      <div className="text-[10px] font-bold text-rose-500 uppercase">Out of Stock</div>
                      <div className="text-lg font-bold text-rose-600 mt-0.5">
                        {editVariants.filter(v => v.stock === 0).length}
                      </div>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-2">
                      <div className="text-[10px] font-bold text-amber-500 uppercase">Low Stock</div>
                      <div className="text-lg font-bold text-amber-600 mt-0.5">
                        {editVariants.filter(v => v.stock > 0 && v.stock < 5).length}
                      </div>
                    </div>
                  </div>

                  {/* Stock Breakdown Accordion / Details */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                      <span className="font-semibold text-slate-500">Stock by Size:</span>
                      <span className="text-slate-700 font-mono">
                        {Object.entries(
                          editVariants.reduce((acc, v) => {
                            acc[v.size] = (acc[v.size] || 0) + (v.stock || 0);
                            return acc;
                          }, {})
                        ).map(([size, stock]) => `${size}:${stock}`).join(', ') || 'No variants'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Stock by Color:</span>
                      <span className="text-slate-700 font-mono">
                        {Object.entries(
                          editVariants.reduce((acc, v) => {
                            acc[v.color] = (acc[v.color] || 0) + (v.stock || 0);
                            return acc;
                          }, {})
                        ).map(([color, stock]) => `${color}:${stock}`).join(', ') || 'No variants'}
                      </span>
                    </div>
                  </div>

                  {/* Variants Stock Adjustments */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden bg-white max-h-[300px] overflow-y-auto">
                    <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 border-b border-slate-100 grid grid-cols-3">
                      <span>Variant (Color - Size)</span>
                      <span className="col-span-2 text-right">Modify Stock</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {editVariants.map((v, idx) => (
                        <div key={idx} className="px-4 py-2.5 grid grid-cols-3 items-center text-sm">
                          <span className="font-medium text-slate-600 truncate">{v.color} - {v.size}</span>
                          <div className="col-span-2 flex items-center justify-end gap-1.5">
                            <button 
                              type="button" 
                              onClick={() => adjustEditVariantStock(idx, -1)}
                              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                            >
                              -
                            </button>
                            <input 
                              type="number"
                              min="0"
                              value={v.stock}
                              onChange={(e) => setEditVariantStockDirectly(idx, e.target.value)}
                              className="w-14 rounded border border-slate-200 px-1.5 py-1 text-center text-xs outline-none focus:border-olive [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button 
                              type="button" 
                              onClick={() => adjustEditVariantStock(idx, 1)}
                              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                      {editVariants.length === 0 && (
                        <div className="p-4 text-center text-slate-400 text-xs italic">
                          No variants defined. Make sure you enter comma-separated sizes and colors.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer / Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={busy}
                  className="rounded-xl bg-olive px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive/90 disabled:opacity-50 transition cursor-pointer"
                >
                  {busy ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogManagement;
