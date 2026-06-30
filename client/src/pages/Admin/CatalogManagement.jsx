import React, { useCallback, useEffect, useState } from 'react';
import { PackagePlus, Trash2, Upload } from 'lucide-react';
import { API_BASE_URL, fetchCatalog } from '../../lib/api';

const initialProduct = {
  name: '', slug: '', price: '', originalPrice: '', stock: '', category: 'Unisex', type: 'Tees', shortDescription: '',
  bestFor: '', colors: 'Black, Olive', sizes: 'S, M, L, XL, XXL', tags: ''
};
const initialCombo = {
  title: '', headline: '', description: '', valueLine: '', productNames: '', originalPrice: '', discountPercent: '', discountedPrice: ''
};

const CatalogManagement = () => {
  const [tab, setTab] = useState('products');
  const [product, setProduct] = useState(initialProduct);
  const [combo, setCombo] = useState(initialCombo);
  const [productImage, setProductImage] = useState(null);
  const [comboImages, setComboImages] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const loadCatalog = useCallback(async () => {
    try { setCatalog(await fetchCatalog(tab)); }
    catch (error) { setMessage(error.message); }
  }, [tab]);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  const update = (setter) => (event) => {
    const { name, value, type, checked } = event.target;
    setter((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
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
    if (tab === 'combos') comboImages.forEach((image) => form.append('images', image));

    try {
      const response = await fetch(`${API_BASE_URL}/${tab}`, { method: 'POST', body: form, credentials: 'include' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Upload failed');
      setMessage(`${tab === 'products' ? 'Product' : 'Combo'} uploaded successfully.`);
      setProduct(initialProduct);
      setCombo(initialCombo);
      setProductImage(null);
      setComboImages([]);
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Quantity</span>
              <input className={fieldClass} name="stock" type="number" min="0" step="1" value={product.stock} onChange={update(setProduct)} placeholder="Enter available quantity" required />
            </label>
            <select className={fieldClass} name="category" value={product.category} onChange={update(setProduct)}><option>Men</option><option>Women</option><option>Unisex</option></select>
            <input className={fieldClass} name="type" value={product.type} onChange={update(setProduct)} placeholder="Type (Tees, Joggers...)" required />
            <input className={fieldClass} name="bestFor" value={product.bestFor} onChange={update(setProduct)} placeholder="Best for" />
            <textarea className={`${fieldClass} md:col-span-2`} name="shortDescription" value={product.shortDescription} onChange={update(setProduct)} placeholder="Short description" required />
            <input className={fieldClass} name="colors" value={product.colors} onChange={update(setProduct)} placeholder="Colors, comma separated" />
            <input className={fieldClass} name="sizes" value={product.sizes} onChange={update(setProduct)} placeholder="Sizes, comma separated" />
            <input className={fieldClass} name="tags" value={product.tags} onChange={update(setProduct)} placeholder="Tags, comma separated" />
            <label className={`${fieldClass} flex cursor-pointer items-center gap-3`}><Upload size={18} /><span>{productImage?.name || 'Choose product image'}</span><input className="hidden" type="file" accept="image/*" onChange={handleProductImageChange} required /></label>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Uploaded {tab}</h2>
        <div className="divide-y divide-slate-100">
          {catalog.map((item) => <div key={item._id} className="flex items-center gap-4 py-4"><img className="h-14 w-14 rounded-lg object-cover" src={item.image || item.images?.[0]} alt="" /><div className="flex-1"><p className="font-semibold">{item.name || item.title}</p><p className="text-sm text-slate-500">₹{item.price || item.discountedPrice}{tab === 'products' ? ` · ${item.stock} in stock` : ''}</p></div><button onClick={() => remove(item._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 size={18} /></button></div>)}
          {!catalog.length && <p className="py-8 text-center text-slate-400">No uploaded {tab} yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default CatalogManagement;
