import React, { useState, useEffect } from 'react';
import { Megaphone, Save, Upload, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';

const PopupManagement = () => {
  const [formData, setFormData] = useState({
    isActive: false,
    title: '',
    description: '',
    link: '',
    buttonText: '',
  });
  const [currentImage, setCurrentImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchPopupSettings();
  }, []);

  const fetchPopupSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/popup`, { credentials: 'include' });
      const data = await response.json();
      if (data.success && data.data) {
        setFormData({
          isActive: data.data.isActive,
          title: data.data.title || '',
          description: data.data.description || '',
          link: data.data.link || '',
          buttonText: data.data.buttonText || '',
        });
        setCurrentImage(data.data.imageUrl || '');
      }
    } catch (error) {
      showFeedback('Failed to load popup configurations.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showFeedback('Image size must be less than 3MB.', 'error');
        event.target.value = null;
        setSelectedImage(null);
        setImagePreview('');
      } else {
        setMessage({ text: '', type: '' });
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    const form = new FormData();
    form.append('isActive', formData.isActive);
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('link', formData.link);
    form.append('buttonText', formData.buttonText);

    if (selectedImage) {
      form.append('image', selectedImage);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/popup`, {
        method: 'PUT',
        body: form,
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showFeedback('Promo popup settings updated successfully!', 'success');
        setCurrentImage(data.data.imageUrl || '');
        setSelectedImage(null);
        setImagePreview('');
      } else {
        throw new Error(data.message || 'Failed to update popup settings.');
      }
    } catch (error) {
      showFeedback(error.message || 'Server error. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showFeedback = (text, type) => {
    setMessage({ text, type });
    // Scroll to top of settings card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-olive transition-all';

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-medium">Loading Popup configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive">Promotion Manager</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Homepage Promo Popup</h1>
          <p className="mt-2 text-slate-500 font-medium">Manage the one-time modal shown to customers on the store entrance.</p>
        </div>
        <div className="flex items-center gap-3">
          {message.text && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold animate-in slide-in-from-right-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-olive/20 hover:bg-olive/90 transition-all disabled:opacity-75"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Megaphone className="text-olive" />
              Popup Configurations
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-olive"></div>
              <span className="ml-3 text-sm font-bold text-slate-700">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Popup Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Hype Drop!"
                className={fieldClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description / Message</label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Get 10% off on our limited-edition unisex harem pants. Only for today!"
                className={`${fieldClass} resize-none`}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Button Link (Redirect URL)</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="e.g., /shop or /combos"
                  className={fieldClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Button CTA Text</label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  placeholder="e.g., Claim Discount"
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Popup Banner Image</label>
              <div className="flex items-center gap-6">
                <label className="flex-1 flex cursor-pointer items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-olive transition-all">
                  <Upload size={18} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-600">Choose new image (Max 3MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                    title="Remove selected image"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Live Preview</h2>
          <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 flex items-center justify-center min-h-[400px]">
            {/* Modal Mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-sm flex flex-col relative">
              {/* Close Button Mock */}
              <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-slate-900/40 flex items-center justify-center text-white text-[10px] cursor-not-allowed">
                ✕
              </div>

              {/* Image Preview Area */}
              {(imagePreview || currentImage) ? (
                <div className="w-full bg-slate-200 overflow-hidden">
                  <img 
                    src={imagePreview || currentImage} 
                    alt="Promo Banner Preview" 
                    className="w-full h-auto block"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <Megaphone size={32} className="opacity-55 mb-2" />
                  <span className="text-xs font-medium">No banner image uploaded</span>
                </div>
              )}

              {/* Button Area */}
              <div className="p-5 text-center bg-white border-t border-slate-100 flex justify-center">
                <span className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-8 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                  {formData.buttonText || 'Shop Now'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupManagement;
