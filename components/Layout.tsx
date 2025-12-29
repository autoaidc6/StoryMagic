
import React, { useState, useEffect } from 'react';
import { Sparkles, Key } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: 'home' | 'how-it-works' | 'pricing') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success per guidelines
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto w-full sticky top-0 z-30 bg-blue-50/80 backdrop-blur-md gap-4">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="bg-yellow-400 p-2 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bubblegum text-indigo-600 tracking-wide">StoryMagic</h1>
        </div>
        
        <nav className="flex items-center gap-2 md:gap-4 bg-white/50 p-1 rounded-2xl border border-slate-100">
          <button onClick={() => onNavigate('how-it-works')} className="px-3 py-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm">How it works</button>
          <button onClick={() => onNavigate('pricing')} className="px-3 py-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm">Pricing</button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button 
            onClick={handleSelectKey}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              hasKey ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Key className="w-3 h-3" />
            {hasKey ? 'Pro Magic Ready' : 'Unlock Pro Magic'}
          </button>
        </nav>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="p-12 text-center text-slate-400 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-indigo-600">Home</button>
          <button onClick={() => onNavigate('how-it-works')} className="hover:text-indigo-600">Method</button>
          <button onClick={() => onNavigate('pricing')} className="hover:text-indigo-600">Tiers</button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hover:text-indigo-600 underline">Billing Info</a>
        </div>
        <p>© 2024 StoryMagic. Magic in every page. ✨</p>
      </footer>
    </div>
  );
};
