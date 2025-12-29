
import React, { useState } from 'react';
import { Camera, User, ArrowRight, X, Sparkles, Wand2, BookOpen } from 'lucide-react';
import { ChildInfo } from '../types';

interface StoryFormProps {
  onSubmit: (info: ChildInfo, theme: string) => void;
  onBack: () => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [magicAvatar, setMagicAvatar] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhoto(result);
        setIsTransforming(true);
        setTimeout(() => {
          setMagicAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'magic'}&backgroundColor=b6e3f4&style=circle`);
          setIsTransforming(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && theme) {
      onSubmit({ name, gender, photo, magicAvatar: magicAvatar || undefined }, theme);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-xl border-4 border-white overflow-hidden relative">
      <h2 className="text-3xl font-bubblegum text-indigo-600 mb-8 text-center relative">Tell Us About the Hero!</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-[30px] bg-slate-100 flex items-center justify-center overflow-hidden border-4 ${photo ? 'border-pink-300' : 'border-dashed border-slate-300'}`}>
              {photo ? (
                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Original</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <ArrowRight className="hidden md:block text-indigo-200 w-8 h-8" />
          <div className={`w-32 h-32 rounded-[30px] bg-indigo-50 flex items-center justify-center overflow-hidden border-4 ${magicAvatar ? 'border-yellow-400' : 'border-slate-100'}`}>
             {isTransforming ? <Wand2 className="w-8 h-8 text-indigo-400 animate-bounce" /> : 
              magicAvatar ? <img src={magicAvatar} className="w-full h-full object-cover" /> : <Sparkles className="w-8 h-8 text-slate-200" />}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-slate-700 font-bold ml-1">Hero's Name</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="What's their name?" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-300 outline-none" />
            
            <label className="block text-slate-700 font-bold ml-1">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {['boy', 'girl', 'other'].map((g) => (
                <button key={g} type="button" onClick={() => setGender(g as any)} className={`py-3 rounded-xl text-sm font-bold capitalize ${gender === g ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{g}</button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-slate-700 font-bold ml-1">Story Theme</label>
            <textarea 
              required 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)} 
              placeholder="e.g. A space journey to find a lost kitten, or a deep sea quest for a hidden crown..." 
              className="w-full h-[142px] px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-300 outline-none resize-none"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between gap-4">
          <button type="button" onClick={onBack} className="text-slate-400 font-bold hover:text-slate-600">Go Back</button>
          <button type="submit" disabled={!name || !theme || isTransforming} className="flex-1 flex items-center justify-center px-8 py-4 font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg disabled:opacity-50">
            Generate 3-Page Preview <Wand2 className="w-5 h-5 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};
