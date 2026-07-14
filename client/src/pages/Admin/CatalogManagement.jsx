import React, { useCallback, useEffect, useState } from 'react';
import { PackagePlus, Trash2, Upload, Edit2, Sliders, Star, X, AlertTriangle } from 'lucide-react';
import { API_BASE_URL, fetchCatalog } from '../../lib/api';

const initialProduct = {
  name: '', slug: '', price: '', originalPrice: '', stock: '0', category: 'Unisex', type: 'Tees', shortDescription: '',
  bestFor: '', colors: 'Black, Olive', sizes: 'S, M, L, XL, XXL', tags: '',
  weight: '500', length: '10', width: '10', height: '10', rating: 5,
  emotionalHook: '', shortCopy: '', fitDetailLine: '', careLine: '',
  objection1Question: '', objection1Answer: '',
  objection2Question: '', objection2Answer: '',
  objection3Question: '', objection3Answer: ''
};
const initialCombo = {
  title: '', headline: '', description: '', valueLine: '', productNames: '', originalPrice: '', discountPercent: '', discountedPrice: '', stock: '0'
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
  const [productBlackImages, setProductBlackImages] = useState([]);
  const [productOliveImages, setProductOliveImages] = useState([]);
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
  const [editProductBlackImages, setEditProductBlackImages] = useState([]);
  const [editProductOliveImages, setEditProductOliveImages] = useState([]);

  // Combo Edit states
  const [editingCombo, setEditingCombo] = useState(null);
  const [editComboImages, setEditComboImages] = useState([]);

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
    if (tab === 'products') {
      setEditingProduct({
        ...item,
        colors: Array.isArray(item.colors) ? item.colors.join(', ') : item.colors || '',
        sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : item.sizes || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
        rating: item.rating || 5,
        emotionalHook: item.emotionalHook || '',
        shortCopy: item.shortCopy || '',
        fitDetailLine: item.fitDetailLine || '',
        careLine: item.careLine || '',
        objection1Question: item.objections?.[0]?.question || '',
        objection1Answer: item.objections?.[0]?.answer || '',
        objection2Question: item.objections?.[1]?.question || '',
        objection2Answer: item.objections?.[1]?.answer || '',
        objection3Question: item.objections?.[2]?.question || '',
        objection3Answer: item.objections?.[2]?.answer || '',
      });
      setEditVariants(item.variants || []);
      setEditProductImage(null);
      setEditProductBackImage(null);
      setEditProductBlackImages([]);
      setEditProductOliveImages([]);
    } else {
      setEditingCombo({
        ...item,
        productNames: Array.isArray(item.items) ? item.items.map(i => i.name).join(', ') : '',
        stock: item.stock !== undefined ? item.stock.toString() : '0'
      });
      setEditComboImages([]);
    }
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

    const objections = [
      { question: editingProduct.objection1Question, answer: editingProduct.objection1Answer },
      { question: editingProduct.objection2Question, answer: editingProduct.objection2Answer },
      { question: editingProduct.objection3Question, answer: editingProduct.objection3Answer }
    ].filter(o => o.question || o.answer);

    const form = new FormData();
    Object.entries(editingProduct).forEach(([key, value]) => {
      if (
        key !== 'variants' && key !== 'image' && key !== 'backImage' &&
        key !== 'blackImages' && key !== 'oliveImages' && key !== 'objections' &&
        !['objection1Question', 'objection1Answer', 'objection2Question', 'objection2Answer', 'objection3Question', 'objection3Answer'].includes(key)
      ) {
        form.append(key, value);
      }
    });

    form.append('objections', JSON.stringify(objections));
    form.append('variants', JSON.stringify(editVariants));
    form.append('stock', totalStock);

    if (editProductImage) {
      form.append('image', editProductImage);
    }
    if (editProductBackImage) {
      form.append('backImage', editProductBackImage);
    }
    if (editProductBlackImages && editProductBlackImages.length > 0) {
      editProductBlackImages.forEach(file => form.append('blackImages', file));
    }
    if (editProductOliveImages && editProductOliveImages.length > 0) {
      editProductOliveImages.forEach(file => form.append('oliveImages', file));
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

  const updateEditingComboField = (event) => {
    const { name, value } = event.target;
    setEditingCombo(curr => {
      const next = { ...curr, [name]: value };
      if (name === 'originalPrice' || name === 'discountPercent' || name === 'discountedPrice') {
        const orig = Number(next.originalPrice) || 0;
        if (name === 'discountPercent') {
          const pct = Math.min(100, Math.max(0, Number(value)));
          next.discountedPrice = orig === 0 ? '' : Math.round(orig * (100 - pct) / 100);
        } else if (name === 'originalPrice') {
          const pct = Number(next.discountPercent || 0);
          next.discountedPrice = orig === 0 ? '' : Math.round(orig * (100 - pct) / 100);
        } else if (name === 'discountedPrice') {
          const disc = Number(value) || 0;
          const pct = orig === 0 ? 0 : Math.round(((orig - disc) / orig) * 100);
          next.discountPercent = value === '' ? '' : Math.min(100, Math.max(0, pct));
        }
      }
      return next;
    });
  };

  const handleEditComboImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const oversized = files.some((file) => file.size > 8 * 1024 * 1024);
    if (oversized) {
      setMessage('Each combo image must be less than 8MB.');
      event.target.value = null;
      setEditComboImages([]);
    } else {
      setMessage('');
      setEditComboImages(files);
    }
  };

  const saveComboEdit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    const manualComboItems = editingCombo.productNames.split(',').map((name) => name.trim()).filter(Boolean);
    if (!manualComboItems.length) {
      setMessage('Enter at least one product name for the combo.');
      setBusy(false);
      return;
    }

    const form = new FormData();
    Object.entries(editingCombo).forEach(([key, value]) => {
      if (key !== 'images' && key !== 'items' && key !== 'productNames' && key !== 'savings') {
        form.append(key, value);
      }
    });

    form.append('items', JSON.stringify(manualComboItems.map((name) => ({ 
      name, 
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), 
      price: 0 
    }))));

    if (editComboImages && editComboImages.length > 0) {
      editComboImages.forEach(file => form.append('images', file));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/combos/${editingCombo._id}`, {
        method: 'PUT',
        body: form,
        credentials: 'include'
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Update failed');

      setCatalog(current => current.map(item => item._id === editingCombo._id ? payload.data : item));
      setMessage('Combo updated successfully.');
      setEditingCombo(null);
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
    if (tab === 'products' && productBlackImages.some(file => file.size > 3 * 1024 * 1024)) {
      setMessage('Each black color image must be less than 3MB.');
      return;
    }
    if (tab === 'products' && productOliveImages.some(file => file.size > 3 * 1024 * 1024)) {
      setMessage('Each olive color image must be less than 3MB.');
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
    if (tab === 'products') {
      const objections = [
        { question: values.objection1Question, answer: values.objection1Answer },
        { question: values.objection2Question, answer: values.objection2Answer },
        { question: values.objection3Question, answer: values.objection3Answer }
      ].filter(o => o.question || o.answer);
      form.append('objections', JSON.stringify(objections));

      Object.entries(values).forEach(([key, value]) => {
        if (!['objection1Question', 'objection1Answer', 'objection2Question', 'objection2Answer', 'objection3Question', 'objection3Answer'].includes(key)) {
          form.append(key, value);
        }
      });
    } else {
      Object.entries(values).forEach(([key, value]) => form.append(key, value));
    }
    if (tab === 'combos') form.append('items', JSON.stringify(manualComboItems.map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), price: 0 }))));
    if (tab === 'products' && productImage) form.append('image', productImage);
    if (tab === 'products' && productBackImage) form.append('backImage', productBackImage);
    if (tab === 'products' && productBlackImages.length > 0) {
      productBlackImages.forEach(file => form.append('blackImages', file));
    }
    if (tab === 'products' && productOliveImages.length > 0) {
      productOliveImages.forEach(file => form.append('oliveImages', file));
    }
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
      setProductBlackImages([]);
      setProductOliveImages([]);
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
      if (file.size > 8 * 1024 * 1024) {
        setMessage('Product image must be less than 8MB.');
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
      if (file.size > 8 * 1024 * 1024) {
        setMessage('Secondary product image must be less than 8MB.');
        event.target.value = null;
        setProductBackImage(null);
      } else {
        setMessage('');
        setProductBackImage(file);
      }
    }
  };

  const handleProductBlackImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      setMessage('Maximum of 5 images allowed for Black color.');
      event.target.value = null;
      setProductBlackImages([]);
      return;
    }
    const oversized = files.some((file) => file.size > 8 * 1024 * 1024);
    if (oversized) {
      setMessage('Each image must be less than 8MB.');
      event.target.value = null;
      setProductBlackImages([]);
    } else {
      setMessage('');
      setProductBlackImages(files);
    }
  };

  const handleProductOliveImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      setMessage('Maximum of 5 images allowed for Olive color.');
      event.target.value = null;
      setProductOliveImages([]);
      return;
    }
    const oversized = files.some((file) => file.size > 8 * 1024 * 1024);
    if (oversized) {
      setMessage('Each image must be less than 8MB.');
      event.target.value = null;
      setProductOliveImages([]);
    } else {
      setMessage('');
      setProductOliveImages(files);
    }
  };

  const handleEditProductBlackImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      setMessage('Maximum of 5 images allowed for Black color.');
      event.target.value = null;
      setEditProductBlackImages([]);
      return;
    }
    const oversized = files.some((file) => file.size > 8 * 1024 * 1024);
    if (oversized) {
      setMessage('Each image must be less than 8MB.');
      event.target.value = null;
      setEditProductBlackImages([]);
    } else {
      setMessage('');
      setEditProductBlackImages(files);
    }
  };

  const handleEditProductOliveImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      setMessage('Maximum of 5 images allowed for Olive color.');
      event.target.value = null;
      setEditProductOliveImages([]);
      return;
    }
    const oversized = files.some((file) => file.size > 8 * 1024 * 1024);
    if (oversized) {
      setMessage('Each image must be less than 8MB.');
      event.target.value = null;
      setEditProductOliveImages([]);
    } else {
      setMessage('');
      setEditProductOliveImages(files);
    }
  };

  const handleComboImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const oversized = files.some((file) => file.size > 8 * 1024 * 1024);
    if (oversized) {
      setMessage('Each combo image must be less than 8MB.');
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
            {/* <input className={fieldClass} name="bestFor" value={product.bestFor} onChange={update(setProduct)} placeholder="Best for" /> */}
            <textarea className={`${fieldClass} md:col-span-2`} name="shortDescription" value={product.shortDescription} onChange={update(setProduct)} placeholder="Short description" required />
            <input className={fieldClass} name="colors" value={product.colors} onChange={update(setProduct)} placeholder="Colors, comma separated" />
            <input className={fieldClass} name="sizes" value={product.sizes} onChange={update(setProduct)} placeholder="Sizes, comma separated" />
            <input className={fieldClass} name="tags" value={product.tags} onChange={update(setProduct)} placeholder="Tags, comma separated" />

            {/* Copywriting & Objection fields */}
            <div className="md:col-span-2 grid gap-4 border-t border-slate-100 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Copywriting & Details</span>
              <div className="grid gap-4 md:grid-cols-2">
                <input className={fieldClass} name="emotionalHook" value={product.emotionalHook} onChange={update(setProduct)} placeholder="Emotional Hook (e.g., For days when jeans feel like a punishment.)" />
                <input className={fieldClass} name="fitDetailLine" value={product.fitDetailLine} onChange={update(setProduct)} placeholder="Fit Detail Line (e.g., The rise is set for sitting...)" />
                <input className={fieldClass} name="careLine" value={product.careLine} onChange={update(setProduct)} placeholder="Care Line (e.g., Machine wash cold. Air dry. Gets softer with use.)" />
                <textarea className={`${fieldClass} h-20 resize-none md:col-span-2`} name="shortCopy" value={product.shortCopy} onChange={update(setProduct)} placeholder="Short Copy / Proof Points (e.g., Soft joggers that look like you made an effort...)" />
              </div>
            </div>

            <div className="md:col-span-2 grid gap-4 border-t border-slate-100 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Objection Removals (Product Page Q&A)</span>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 border border-slate-100 p-3 rounded-xl bg-slate-50/30">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Objection 1</span>
                  <input className={fieldClass} name="objection1Question" value={product.objection1Question} onChange={update(setProduct)} placeholder='Question (e.g., "Will it look too casual?")' />
                  <input className={fieldClass} name="objection1Answer" value={product.objection1Answer} onChange={update(setProduct)} placeholder="Answer (e.g., It's the jogger that reads as intentional...)" />
                </div>
                <div className="space-y-2 border border-slate-100 p-3 rounded-xl bg-slate-50/30">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Objection 2</span>
                  <input className={fieldClass} name="objection2Question" value={product.objection2Question} onChange={update(setProduct)} placeholder='Question (e.g., "Will the waistband dig when I sit?")' />
                  <input className={fieldClass} name="objection2Answer" value={product.objection2Answer} onChange={update(setProduct)} placeholder="Answer (e.g., Designed to sit flat...)" />
                </div>
                <div className="space-y-2 border border-slate-100 p-3 rounded-xl bg-slate-50/30 md:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Objection 3</span>
                  <input className={fieldClass} name="objection3Question" value={product.objection3Question} onChange={update(setProduct)} placeholder='Question (e.g., "Will my thighs feel tight?")' />
                  <input className={fieldClass} name="objection3Answer" value={product.objection3Answer} onChange={update(setProduct)} placeholder="Answer (e.g., Relaxed through the thigh...)" />
                </div>
              </div>
            </div>
            
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
              <label className={`${fieldClass} flex cursor-pointer items-center gap-3`}><Upload size={18} /><span className="truncate">{productBlackImages.length ? `${productBlackImages.length} black image(s) selected` : 'Choose up to 5 Black color images'}</span><input className="hidden" type="file" accept="image/*" multiple onChange={handleProductBlackImagesChange} /></label>
              <label className={`${fieldClass} flex cursor-pointer items-center gap-3`}><Upload size={18} /><span className="truncate">{productOliveImages.length ? `${productOliveImages.length} olive image(s) selected` : 'Choose up to 5 Olive color images'}</span><input className="hidden" type="file" accept="image/*" multiple onChange={handleProductOliveImagesChange} /></label>
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
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Combo Stock Level</span>
              <input className={fieldClass} name="stock" type="number" min="0" value={combo.stock} onChange={update(setCombo)} placeholder="Combo stock quantity (e.g. 50)" required />
            </label>
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
                    {item.stock !== undefined && ` · ${item.stock} total stock`}
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
                  {(tab === 'products' || tab === 'combos') && (
                    <button 
                      onClick={() => startEdit(item)} 
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 transition" 
                      aria-label={tab === 'products' ? "Edit product and stock" : "Edit combo and stock"}
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

                  {/* Edit Copywriting & Objection Fields */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Copywriting & Details</h4>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Emotional Hook</span>
                      <input className={fieldClass} name="emotionalHook" value={editingProduct.emotionalHook || ''} onChange={updateEditingField} placeholder="For days when jeans feel like a punishment." />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Fit Detail Line</span>
                      <input className={fieldClass} name="fitDetailLine" value={editingProduct.fitDetailLine || ''} onChange={updateEditingField} placeholder="The rise is set for sitting..." />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Care Line</span>
                      <input className={fieldClass} name="careLine" value={editingProduct.careLine || ''} onChange={updateEditingField} placeholder="Machine wash cold. Air dry..." />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Short Copy</span>
                      <textarea className={`${fieldClass} h-20 resize-none`} name="shortCopy" value={editingProduct.shortCopy || ''} onChange={updateEditingField} placeholder="Soft joggers that look like you made an effort..." />
                    </label>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Objection Removals</h4>
                    <div className="space-y-2 border border-slate-100 p-2.5 rounded-xl bg-slate-50/30">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Objection 1</span>
                      <input className={fieldClass} name="objection1Question" value={editingProduct.objection1Question || ''} onChange={updateEditingField} placeholder='Question (e.g., "Will it look too casual?")' />
                      <input className={fieldClass} name="objection1Answer" value={editingProduct.objection1Answer || ''} onChange={updateEditingField} placeholder="Answer..." />
                    </div>
                    <div className="space-y-2 border border-slate-100 p-2.5 rounded-xl bg-slate-50/30">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Objection 2</span>
                      <input className={fieldClass} name="objection2Question" value={editingProduct.objection2Question || ''} onChange={updateEditingField} placeholder='Question (e.g., "Will the waistband dig when I sit?")' />
                      <input className={fieldClass} name="objection2Answer" value={editingProduct.objection2Answer || ''} onChange={updateEditingField} placeholder="Answer..." />
                    </div>
                    <div className="space-y-2 border border-slate-100 p-2.5 rounded-xl bg-slate-50/30">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Objection 3</span>
                      <input className={fieldClass} name="objection3Question" value={editingProduct.objection3Question || ''} onChange={updateEditingField} placeholder='Question (e.g., "Will my thighs feel tight?")' />
                      <input className={fieldClass} name="objection3Answer" value={editingProduct.objection3Answer || ''} onChange={updateEditingField} placeholder="Answer..." />
                    </div>
                  </div>

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

                  {/* Black Images Input in Edit Modal */}
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Black Images (Leave blank to keep existing, max 5)</span>
                    <label className={`${fieldClass} flex cursor-pointer items-center gap-3 bg-slate-50`}>
                      <Upload size={18} />
                      <span className="truncate">{editProductBlackImages.length ? `${editProductBlackImages.length} black image(s) selected` : 'Choose new Black color images'}</span>
                      <input className="hidden" type="file" accept="image/*" multiple onChange={handleEditProductBlackImagesChange} />
                    </label>
                  </label>

                  {/* Olive Images Input in Edit Modal */}
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Olive Images (Leave blank to keep existing, max 5)</span>
                    <label className={`${fieldClass} flex cursor-pointer items-center gap-3 bg-slate-50`}>
                      <Upload size={18} />
                      <span className="truncate">{editProductOliveImages.length ? `${editProductOliveImages.length} olive image(s) selected` : 'Choose new Olive color images'}</span>
                      <input className="hidden" type="file" accept="image/*" multiple onChange={handleEditProductOliveImagesChange} />
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

      {/* Combo Editor Modal */}
      {editingCombo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold">Edit Combo & Stock</h2>
                <p className="text-xs text-slate-500 mt-1">Manage description, pricing, items, and stock level.</p>
              </div>
              <button 
                onClick={() => setEditingCombo(null)} 
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <form onSubmit={saveComboEdit} className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Title</span>
                  <input className={fieldClass} name="title" value={editingCombo.title} onChange={updateEditingComboField} required />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Headline</span>
                  <input className={fieldClass} name="headline" value={editingCombo.headline} onChange={updateEditingComboField} required />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Original Price (₹)</span>
                  <input className={fieldClass} name="originalPrice" type="number" min="0" value={editingCombo.originalPrice} onChange={updateEditingComboField} required />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Discount Percent (%)</span>
                  <input className={fieldClass} name="discountPercent" type="number" min="0" max="100" value={editingCombo.discountPercent} onChange={updateEditingComboField} required />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500">Price after discount (₹)</span>
                  <input className={fieldClass} name="discountedPrice" type="number" min="0" value={editingCombo.discountedPrice} onChange={updateEditingComboField} required />
                </label>
                
                {/* Combo Stock Input field */}
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500">Combo Stock Level</span>
                  <input className={fieldClass} name="stock" type="number" min="0" value={editingCombo.stock || 0} onChange={updateEditingComboField} required />
                </label>

                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500">Description</span>
                  <textarea className={`${fieldClass} h-20 resize-none`} name="description" value={editingCombo.description} onChange={updateEditingComboField} required />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500">Value Line / Slogan</span>
                  <input className={fieldClass} name="valueLine" value={editingCombo.valueLine || ''} onChange={updateEditingComboField} />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500">Product Names</span>
                  <input className={fieldClass} name="productNames" value={editingCombo.productNames} onChange={updateEditingComboField} required />
                  <span className="block text-[10px] text-slate-400">Separate each product name with a comma.</span>
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500">Combo Images (Leave blank to keep existing, max 5)</span>
                  <label className={`${fieldClass} flex cursor-pointer items-center gap-3 bg-slate-50`}>
                    <Upload size={18} />
                    <span className="truncate">{editComboImages.length ? `${editComboImages.length} image(s) selected` : 'Choose new combo images'}</span>
                    <input className="hidden" type="file" accept="image/*" multiple onChange={handleEditComboImagesChange} />
                  </label>
                </label>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingCombo(null)}
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
