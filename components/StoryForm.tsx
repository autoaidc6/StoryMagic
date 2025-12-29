
import React, { useState } from 'react';
import { Camera, User, ArrowRight, X, Sparkles, Wand2 } from 'lucide-react';
import { ChildInfo } from '../types';

interface StoryFormProps {
  onSubmit: (info: ChildInfo) => void;
  onBack: () => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
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
        mockMagicTransformation(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const mockMagicTransformation = (original: string) => {
    setIsTransforming(true);
    // Simulate processing time for Pixar transformation
    setTimeout(() => {
      // For mock purposes, using a high-quality 3D avatar placeholder
      setMagicAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'magic'}&backgroundColor=b6e3f4&style=circle`);
      setIsTransforming(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onSubmit({ name, gender, photo, magicAvatar });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-xl border-4 border-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <h2 className="text-3xl font-bubblegum text-indigo-600 mb-8 text-center relative">Tell Us About the Hero!</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Original Photo */}
          <div className="relative group">
            <div className={`w-32 h-32 rounded-[30px] bg-slate-100 flex items-center justify-center overflow-hidden border-4 ${photo ? 'border-pink-300' : 'border-dashed border-slate-300'} transition-all`}>
              {photo ? (
                <>
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setPhoto(null); setMagicAvatar(null); }}
                    className="absolute -top-2 -right-2 bg-red-400 text-white p-1 rounded-full shadow-md z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase text-center px-2">Original</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="hidden md:block">
            <ArrowRight className="text-indigo-200 w-8 h-8" />
          </div>

          {/* Transformed Mock Avatar */}
          <div className="relative">
            <div className={`w-32 h-32 rounded-[30px] bg-indigo-50 flex items-center justify-center overflow-hidden border-4 ${magicAvatar ? 'border-yellow-400' : 'border-slate-100'} transition-all`}>
              {isTransforming ? (
                <div className="flex flex-col items-center text-indigo-400 animate-pulse">
                  <Wand2 className="w-8 h-8 mb-1 animate-bounce" />
                  <span className="text-[10px] font-bold uppercase">Magifying...</span>
                </div>
              ) : magicAvatar ? (
                <div className="relative w-full h-full">
                   <img src={magicAvatar} alt="Magic Preview" className="w-full h-full object-cover bg-white" />
                   <div className="absolute bottom-0 inset-x-0 bg-yellow-400 text-white text-[8px] font-bold py-0.5 text-center uppercase tracking-widest">3D Magic</div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                  <Sparkles className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Avatar</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 -mt-4">Upload a photo to see the magic Pixar-style transformation!</p>

        <div className="space-y-6">
          <div>
            <label className="block text-slate-700 font-bold mb-2 ml-1">Hero's Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What's their name?"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-300 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-3 ml-1">Gender</label>
            <div className="grid grid-cols-3 gap-4">
              {['boy', 'girl', 'other'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g as any)}
                  className={`py-3 rounded-2xl font-bold capitalize transition-all border-2 ${
                    gender === g 
                    ? 'bg-indigo-100 border-indigo-400 text-indigo-700 shadow-sm' 
                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between gap-4">
          <button 
            type="button" 
            onClick={onBack}
            className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
          >
            Go Back
          </button>
          <button 
            type="submit"
            disabled={!name || isTransforming}
            className="flex-1 inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Create Magic Story
            <Wand2 className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
