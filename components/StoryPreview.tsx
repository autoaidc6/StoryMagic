
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Sparkles, ShoppingCart, Wand2, Image as ImageIcon, Loader2, AlertCircle, Key } from 'lucide-react';
import { StoryBook, ChildInfo, ImageSize } from '../types';
import { generatePageImageAPI } from '../services/geminiService';

interface StoryPreviewProps {
  book: StoryBook;
  child: ChildInfo;
  onReset: () => void;
  onCheckout: () => void;
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ book, child, onReset, onCheckout }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(book.pages);
  const [genError, setGenError] = useState<{ message: string; type: string } | null>(null);

  const nextPage = () => currentPage < pages.length && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);
  const isCover = currentPage === 0;

  const injectName = (text: string) => text?.replace(/{{child_name}}/g, child.name) || "";

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setGenError(null);
    }
  };

  const handleGenerateImage = async (pageIdx: number, size: ImageSize) => {
    setGenError(null);
    const newPages = [...pages];
    newPages[pageIdx].isGeneratingImage = true;
    setPages([...newPages]);

    try {
      const url = await generatePageImageAPI(newPages[pageIdx].visual_prompt, size);
      newPages[pageIdx].imageUrl = url;
    } catch (err: any) {
      let type = 'general';
      if (err.message.includes('QUOTA_EXCEEDED')) type = 'quota';
      if (err.message.includes('REAUTH_REQUIRED')) type = 'auth';
      
      setGenError({ 
        message: err.message.replace(/QUOTA_EXCEEDED: |REAUTH_REQUIRED: /, ''), 
        type 
      });
    } finally {
      newPages[pageIdx].isGeneratingImage = false;
      setPages([...newPages]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bubblegum text-indigo-600">{injectName(book.title)}</h2>
          <p className="text-slate-400 text-sm">Preview Phase (3 Pages Generated)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onReset} className="p-3 bg-white rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><RefreshCw className="w-5 h-5" /></button>
          <button onClick={onCheckout} className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-indigo-900 rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-md">
            <ShoppingCart className="w-4 h-4" /> Pick a Tier to Expand
          </button>
        </div>
      </div>

      {genError && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="bg-red-100 p-3 rounded-2xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-red-800 font-bold">The magic wand stuttered!</p>
            <p className="text-red-600 text-sm leading-relaxed">{genError.message}</p>
          </div>
          {(genError.type === 'quota' || genError.type === 'auth') && (
            <button 
              onClick={handleSelectKey}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg flex items-center gap-2 shrink-0"
            >
              <Key className="w-4 h-4" />
              Select Paid API Key
            </button>
          )}
          <button 
            onClick={() => setGenError(null)}
            className="text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest px-2"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="relative group">
        <div className="flex flex-col md:flex-row bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[500px] border-l-[12px] border-indigo-700 relative">
          
          <div className="w-full md:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
             {isCover ? (
                <div className="text-center space-y-6">
                  <div className="w-64 h-80 bg-indigo-100 rounded-[40px] shadow-inner overflow-hidden flex items-center justify-center relative border-4 border-white">
                    <img src={`https://picsum.photos/seed/${book.title}/600/800`} className="w-full h-full object-cover opacity-80" />
                    {child.magicAvatar && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-[30px] shadow-2xl overflow-hidden">
                        <img src={child.magicAvatar} className="w-full h-full object-cover bg-white" />
                      </div>
                    )}
                  </div>
                  <Sparkles className="absolute top-10 right-10 w-12 h-12 text-yellow-400 animate-pulse" />
                </div>
             ) : (
                <div className="w-full h-full flex flex-col gap-4">
                   <div className="flex-1 bg-white rounded-[30px] shadow-sm overflow-hidden border-4 border-white relative flex items-center justify-center min-h-[300px]">
                      {pages[currentPage - 1].isGeneratingImage ? (
                        <div className="flex flex-col items-center gap-4 text-indigo-400 animate-pulse p-12 text-center">
                          <Loader2 className="w-12 h-12 animate-spin" />
                          <p className="font-bold text-sm">Mixing Pro Pixels...<br/><span className="text-[10px] font-normal uppercase tracking-widest">Nano Banana Pro 3.1</span></p>
                        </div>
                      ) : pages[currentPage - 1].imageUrl ? (
                        <img src={pages[currentPage - 1].imageUrl} className="w-full h-full object-cover animate-in fade-in duration-700" />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-slate-300 p-12 text-center">
                          <ImageIcon className="w-16 h-16 opacity-50" />
                          <p className="text-sm">Click below to generate<br/>High-Quality Pro 3D Art</p>
                        </div>
                      )}
                   </div>
                   
                   {!pages[currentPage-1].imageUrl && !pages[currentPage-1].isGeneratingImage && (
                     <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2">
                        <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Generate with Pro Magic</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['1K', '2K', '4K'] as ImageSize[]).map(size => (
                            <button 
                              key={size}
                              onClick={() => handleGenerateImage(currentPage - 1, size)}
                              className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md flex items-center justify-center gap-1 active:scale-95 transition-transform"
                            >
                              <Wand2 className="w-3 h-3" /> {size}
                            </button>
                          ))}
                        </div>
                     </div>
                   )}
                </div>
             )}
          </div>

          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white border-l border-slate-100 relative">
            <div className="absolute top-8 right-8 text-slate-200 text-4xl font-bubblegum">
              {isCover ? 'Cover' : `${currentPage} / ${pages.length}`}
            </div>
            
            <div className="space-y-6">
              {isCover ? (
                <div className="space-y-4">
                  <h1 className="text-5xl font-bubblegum text-slate-800">{injectName(book.title)}</h1>
                  <p className="text-xl text-indigo-500 font-bold uppercase tracking-widest">For {child.name}</p>
                </div>
              ) : (
                <p className="text-2xl text-slate-700 leading-relaxed font-medium">
                  {injectName(pages[currentPage - 1].text)}
                </p>
              )}
            </div>
            
            <div className="mt-8 flex gap-4">
              <button onClick={prevPage} disabled={currentPage === 0} className="p-4 rounded-full bg-slate-50 text-slate-400 disabled:opacity-0 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><ChevronLeft/></button>
              <button onClick={nextPage} disabled={currentPage === pages.length} className="p-4 rounded-full bg-slate-50 text-slate-400 disabled:opacity-0 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><ChevronRight/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
