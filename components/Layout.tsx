
import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-yellow-400 p-2 rounded-2xl shadow-sm">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bubblegum text-indigo-600 tracking-wide">StoryMagic</h1>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="px-4 py-2 text-slate-600 font-semibold hover:text-indigo-600 transition-colors">How it works</button>
          <button className="px-4 py-2 text-slate-600 font-semibold hover:text-indigo-600 transition-colors">Pricing</button>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="p-6 text-center text-slate-400 text-sm">
        <p>© 2024 StoryMagic. Magic in every page. ✨</p>
      </footer>
    </div>
  );
};
