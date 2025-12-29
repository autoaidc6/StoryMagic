
import React from 'react';
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: 'home' | 'how-it-works' | 'pricing') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 z-30 bg-blue-50/80 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="bg-yellow-400 p-2 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bubblegum text-indigo-600 tracking-wide">StoryMagic</h1>
        </div>
        <nav className="flex gap-2 md:gap-6">
          <button 
            onClick={() => onNavigate('how-it-works')}
            className="px-3 py-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm md:text-base"
          >
            How it works
          </button>
          <button 
            onClick={() => onNavigate('pricing')}
            className="px-3 py-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm md:text-base"
          >
            Pricing
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
        </div>
        <p>© 2024 StoryMagic. Magic in every page. ✨</p>
      </footer>
    </div>
  );
};
