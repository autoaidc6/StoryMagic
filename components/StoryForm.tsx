
import React, { useState } from 'react';
import { Camera, User, ArrowRight, X } from 'lucide-react';
import { ChildInfo } from '../types';

interface StoryFormProps {
  onSubmit: (info: ChildInfo) => void;
  onBack: () => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [photo, setPhoto] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onSubmit({ name, gender, photo });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-xl border-4 border-white">
      <h2 className="text-3xl font-bubblegum text-indigo-600 mb-8 text-center">Tell Us About the Hero!</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className={`w-40 h-40 rounded-[40px] bg-slate-100 flex items-center justify-center overflow-hidden border-4 ${photo ? 'border-pink-300' : 'border-dashed border-slate-300'} transition-all`}>
              {photo ? (
                <>
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setPhoto(null)}
                    className="absolute -top-2 -right-2 bg-red-400 text-white p-1 rounded-full shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Camera className="w-10 h-10 mb-2" />
                  <span className="text-xs font-semibold px-4 text-center">Add Portrait Photo</span>
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
          <p className="text-xs text-slate-400">We'll use this to imagine your child in the story!</p>
        </div>

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
            <label className="block text-slate-700 font-bold mb-3 ml-1">Gender (helps with story flow)</label>
            <div className="grid grid-cols-3 gap-4">
              {['boy', 'girl', 'other'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g as any)}
                  className={`py-3 rounded-2xl font-bold capitalize transition-all border-2 ${
                    gender === g 
                    ? 'bg-indigo-100 border-indigo-400 text-indigo-700' 
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
            disabled={!name}
            className="flex-1 inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mix the Magic
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};
