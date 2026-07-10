import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../lib/api';
import { 
  Save, 
  RotateCcw, 
  Eye, 
  Type, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const HomepageEditor = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Content state
  const [heroContent, setHeroContent] = useState({
    tagline: 'First drop · Live now',
    titleLine1: 'Wear it.',
    titleLine2: "Forget you're wearing it.",
    description: 'Everyday tees, joggers, shorts, hoodies, and harem pants. Built for sitting, walking, and doing your actual day — without pulling, tugging, or thinking about what you\'re wearing.',
    primaryBtnText: 'Shop The First Drop →',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'Shop Combos',
    secondaryBtnLink: '/combos'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
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
      console.error("Error fetching content:", error);
      showFeedback('Failed to load content from server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch(`${API_BASE_URL}/admin/homepage/section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sectionName: 'hero',
          content: heroContent
        }),
      });
      const data = await response.json();
      if (data.success) {
        showFeedback('Homepage hero section updated successfully!', 'success');
      } else {
        showFeedback(data.message || 'Failed to update section.', 'error');
      }
    } catch (error) {
      showFeedback('Network error. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showFeedback = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: <Type size={18} /> },
    { id: 'products', name: 'Product Drop', icon: <ImageIcon size={18} /> },
    { id: 'combos', name: 'Combos Section', icon: <Plus size={18} /> },
    { id: 'categories', name: 'Categories', icon: <LinkIcon size={18} /> },
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-medium">Loading CMS configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homepage CMS</h1>
          <p className="text-slate-500 mt-1">Update website content in real-time without touching code.</p>
        </div>
        <div className="flex items-center gap-3">
          {message.text && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold animate-in slide-in-from-right-4 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all border border-slate-200 bg-white">
            <Eye size={18} />
            Preview Site
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Selector */}
        <div className="w-full lg:w-72 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all border ${
                activeSection === section.id 
                  ? 'bg-olive text-white border-olive shadow-md shadow-olive/20' 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
              }`}
            >
              {section.icon}
              <span className="font-bold text-sm">{section.name}</span>
            </button>
          ))}
        </div>

        {/* Editor Form */}
        <div className="flex-1 space-y-6">
          {activeSection === 'hero' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Type className="text-olive" />
                  Hero Section Content
                </h2>
                <button 
                  onClick={fetchContent}
                  className="text-slate-400 hover:text-olive transition-colors"
                  title="Reset to published"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tagline</label>
                  <input 
                    type="text" 
                    value={heroContent.tagline}
                    onChange={(e) => setHeroContent({...heroContent, tagline: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-olive/10 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Button Text</label>
                  <input 
                    type="text" 
                    value={heroContent.primaryBtnText}
                    onChange={(e) => setHeroContent({...heroContent, primaryBtnText: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-olive/10 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title - Line 1</label>
                  <input 
                    type="text" 
                    value={heroContent.titleLine1}
                    onChange={(e) => setHeroContent({...heroContent, titleLine1: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-olive/10 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title - Line 2 (Italic)</label>
                  <input 
                    type="text" 
                    value={heroContent.titleLine2}
                    onChange={(e) => setHeroContent({...heroContent, titleLine2: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-olive/10 outline-none font-serif italic"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description Paragraph</label>
                  <textarea 
                    rows="4"
                    value={heroContent.description}
                    onChange={(e) => setHeroContent({...heroContent, description: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-olive/10 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Hero Images (Visual CMS)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="group relative aspect-[3/4] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-olive hover:bg-olive/10 transition-all overflow-hidden">
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-slate-300 mb-2 group-hover:text-olive" />
                        <p className="text-xs font-medium text-slate-400 group-hover:text-olive">Update Hero Image {idx}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'hero' && (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="text-slate-300 animate-spin-slow" size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Module Under Construction</h2>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">This section's editing interface is being optimized for the best CMS experience.</p>
              <button className="mt-8 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all">
                Check Progress
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Settings = ({ size, className }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export default HomepageEditor;
