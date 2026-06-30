import React, { useState, useEffect } from 'react';
import { Save, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';

const FooterManagement = () => {
  const [formData, setFormData] = useState({
    tagline: '',
    quote: '',
    instagramUrl: '',
    copyrightText: '',
    copyrightSubtext: '',
    trustLabel1: '',
    trustLabel2: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/footer`, { credentials: 'include' });
      const data = await response.json();
      if (data.success && data.data) {
        setFormData({
          tagline: data.data.tagline || '',
          quote: data.data.quote || '',
          instagramUrl: data.data.instagramUrl || '',
          copyrightText: data.data.copyrightText || '',
          copyrightSubtext: data.data.copyrightSubtext || '',
          trustLabel1: data.data.trustLabel1 || '',
          trustLabel2: data.data.trustLabel2 || '',
        });
      }
    } catch (error) {
      showFeedback('Failed to load footer configurations.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showFeedback('Footer configurations updated successfully!', 'success');
      } else {
        throw new Error(data.message || 'Failed to update footer settings.');
      }
    } catch (error) {
      showFeedback(error.message || 'Server error. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showFeedback = (text, type) => {
    setMessage({ text, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-olive transition-all';

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-medium">Loading Footer configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive">Layout Manager</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Footer Customization</h1>
          <p className="mt-2 text-slate-500 font-medium">Customize taglines, statement quote, socials, copyright, and trust badges on the footer area.</p>
        </div>
        <div className="flex items-center gap-3">
          {message.text && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold animate-in slide-in-from-right-4 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
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
          <h2 className="text-xl font-bold flex items-center gap-3 border-b border-slate-100 pb-4">
            <Info className="text-olive" />
            Footer Area Fields
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Footer Tagline</label>
                <input 
                  type="text" 
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="e.g., No More Adjusting."
                  className={fieldClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instagram Link (URL)</label>
                <input 
                  type="text" 
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleInputChange}
                  placeholder="e.g., https://instagram.com/osoul.in"
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand Statement / Quote</label>
              <textarea 
                rows="3"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                placeholder="e.g., If it makes you adjust, it failed."
                className={`${fieldClass} resize-none font-serif italic text-base`}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Copyright Text</label>
                <input 
                  type="text" 
                  name="copyrightText"
                  value={formData.copyrightText}
                  onChange={handleInputChange}
                  placeholder="e.g., © 2026 O'Soul. All rights reserved."
                  className={fieldClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Copyright Subtext</label>
                <input 
                  type="text" 
                  name="copyrightSubtext"
                  value={formData.copyrightSubtext}
                  onChange={handleInputChange}
                  placeholder="e.g., Everyday comfort that still looks clean."
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trust Label 1</label>
                <input 
                  type="text" 
                  name="trustLabel1"
                  value={formData.trustLabel1}
                  onChange={handleInputChange}
                  placeholder="e.g., Secure Razorpay checkout"
                  className={fieldClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trust Label 2</label>
                <input 
                  type="text" 
                  name="trustLabel2"
                  value={formData.trustLabel2}
                  onChange={handleInputChange}
                  placeholder="e.g., Easy exchange support"
                  className={fieldClass}
                  required
                />
              </div>
            </div>
          </div>
        </form>

        {/* Live Preview */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Live Footer Preview</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between min-h-[400px] text-white">
            
            {/* Top Brand Block Mock */}
            <div className="space-y-4">
              <div className="font-serif text-xl tracking-tighter uppercase font-bold text-white">O'Soul</div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">
                {formData.tagline || 'No More Adjusting.'}
              </div>
              <p className="font-serif text-2xl italic text-slate-200 leading-tight pt-4">
                "{formData.quote || 'If it makes you adjust, it failed.'}"
              </p>
              
              <div className="pt-2 text-sm">
                <span className="text-slate-400 font-medium">Social: </span>
                <a href={formData.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-olive underline hover:text-olive/80">
                  Instagram
                </a>
              </div>
            </div>

            {/* Bottom Copyright Block Mock */}
            <div className="border-t border-slate-800 pt-6 mt-8 space-y-3">
              <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold leading-relaxed">
                {formData.copyrightText || '© 2026 O\'Soul. All rights reserved.'} 
                <span className="mx-1 opacity-40">|</span> 
                {formData.copyrightSubtext || 'Everyday comfort that still looks clean.'}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8px] uppercase tracking-widest text-slate-600 font-bold">
                <span>✓ {formData.trustLabel1 || 'Secure Razorpay checkout'}</span>
                <span>✓ {formData.trustLabel2 || 'Easy exchange support'}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterManagement;
