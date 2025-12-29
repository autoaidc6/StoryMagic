
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Download, RefreshCw, Sparkles, ExternalLink, ShoppingCart, Wand2 } from 'lucide-react';
import { StoryBook, ChildInfo } from '../types';

interface StoryPreviewProps {
  book: StoryBook;
  child: ChildInfo;
  onReset: () => void;
  onCheckout: () => void;
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ book, child, onReset, onCheckout }) => {
  const [currentPage, setCurrentPage] = useState(0); // 0 is cover, 1-10 are pages

  const nextPage = () => {
    if (currentPage < book.pages.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const isCover = currentPage === 0;

  // Helper to inject name dynamically using the new {{child_name}} placeholder
  const injectName = (text: string) => {
    if (!text) return "";
    return text.replace(/{{child_name}}/g, child.name);
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bubblegum text-indigo-600">{injectName(book.title)}</h2>
          <p className="text-slate-400 text-sm">A personalized adventure for {child.name}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
           <button onClick={onReset} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Create New">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-200 transition-all">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button 
            onClick={onCheckout}
            className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-indigo-900 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-all shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Hardcover
          </button>
        </div>
      </div>

      <div className="relative group perspective-1000">
        <div className="flex flex-col md:flex-row bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[500px] border-l-[12px] border-indigo-700 book-shadow">
          
          {/* Illustration Side */}
          <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden">
             {isCover ? (
                <div className="relative text-center space-y-6">
                  <div className="w-64 h-80 bg-indigo-100 rounded-[40px] shadow-inner overflow-hidden flex items-center justify-center relative">
                    <img src={`https://picsum.photos/seed/${book.title}/600/800`} alt="Cover" className="w-full h-full object-cover opacity-90" />
                    {child.magicAvatar && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white rounded-[40px] shadow-2xl overflow-hidden">
                        <img src={child.magicAvatar} alt="Transformed Hero" className="w-full h-full object-cover bg-white" />
                      </div>
                    )}
                  </div>
                  <Sparkles className="absolute -top-6 -right-6 w-12 h-12 text-yellow-400 animate-pulse" />
                </div>
             ) : (
                <div className="w-full h-full flex flex-col gap-4">
                   <div className="flex-1 bg-white rounded-[30px] shadow-sm overflow-hidden border-4 border-white relative">
                      <img 
                        src={`https://picsum.photos/seed/${currentPage}${book.title}/600/400`} 
                        alt={`Page ${currentPage}`} 
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                      {child.magicAvatar && currentPage % 3 === 0 && (
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-white rounded-2xl shadow-lg overflow-hidden">
                          <img src={child.magicAvatar} alt="Hero Avatar" className="w-full h-full object-cover bg-white" />
                        </div>
                      )}
                   </div>
                   <div className="text-[10px] text-slate-300 italic text-center">
                      Scene Prompt: {book.pages[currentPage - 1].visual_prompt}
                   </div>
                </div>
             )}
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white border-l border-slate-100 relative">
            <div className="absolute top-8 right-8 text-slate-200 text-4xl font-bubblegum">
              {isCover ? 'Cover' : `${currentPage} / 10`}
            </div>
            
            <div className="space-y-8">
              {isCover ? (
                <div className="space-y-6">
                  <h1 className="text-5xl font-bubblegum text-slate-800 leading-tight">{injectName(book.title)}</h1>
                  <p className="text-xl text-indigo-500 font-bold uppercase tracking-widest">A Magic Book for {child.name}</p>
                  <div className="w-20 h-1 bg-pink-300 rounded-full"></div>
                  <div className="flex items-center gap-4">
                    {child.photo && (
                      <div className="relative">
                        <img src={child.photo} alt="Original" className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                        <Wand2 className="absolute -bottom-1 -right-1 w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                    <span className="text-slate-500 font-semibold italic text-sm">Transformed into the Starry Key Hero</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                   <p className="text-2xl text-slate-700 leading-relaxed font-medium">
                     {injectName(book.pages[currentPage - 1].text)}
                   </p>
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-between items-center md:hidden">
              <button onClick={prevPage} disabled={currentPage === 0} className="p-4 rounded-full bg-indigo-50 text-indigo-600 disabled:opacity-30"><ChevronLeft/></button>
              <button onClick={nextPage} disabled={currentPage === book.pages.length} className="p-4 rounded-full bg-indigo-50 text-indigo-600 disabled:opacity-30"><ChevronRight/></button>
            </div>
          </div>
        </div>

        <button 
          onClick={prevPage}
          disabled={currentPage === 0}
          className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all disabled:opacity-0"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextPage}
          disabled={currentPage === book.pages.length}
          className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all disabled:opacity-0"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {book.sources && book.sources.length > 0 && (
        <div className="mt-8 p-6 bg-white rounded-[30px] shadow-sm border border-slate-100 animate-in fade-in duration-1000">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Magical Space Facts Sources
          </h4>
          <div className="flex flex-wrap gap-3">
            {book.sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-50 transition-colors border border-slate-100"
              >
                {source.title || 'Source'}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 p-8 bg-indigo-600 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="space-y-2 relative">
          <h4 className="text-xl font-bubblegum">Ready to hold the magic?</h4>
          <p className="text-indigo-100">Order your personalized {child.name} book today.</p>
        </div>
        <button 
          onClick={onCheckout}
          className="relative px-8 py-4 bg-yellow-400 text-indigo-900 font-bold rounded-2xl shadow-lg hover:bg-yellow-300 transition-all transform hover:-translate-y-1"
        >
          Buy Now - $24.99
        </button>
      </div>
    </div>
  );
};
