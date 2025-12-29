
import React from 'react';
import { BookOpen, Star, Sparkles } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-12">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">
          <Star className="w-4 h-4 fill-indigo-600" />
          <span>Personalized Magic</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-bubblegum text-slate-800 leading-tight">
          Every Child is the <span className="text-pink-500">Hero</span> of Their Story
        </h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-xl">
          Create custom-illustrated children's books in seconds. Your child, their name, their face, a brand new world.
        </p>
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-3xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-xl"
        >
          <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Create My Story
        </button>
      </div>

      <div className="flex-1 relative w-full max-w-md">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
        <div className="relative bg-white p-4 rounded-[40px] shadow-2xl rotate-3 transform transition-transform hover:rotate-0 duration-500">
          <img 
            src="https://picsum.photos/seed/kidsbook/600/800" 
            alt="Sample Book" 
            className="rounded-[30px] w-full h-auto object-cover border-4 border-indigo-50"
          />
          <div className="absolute top-1/2 -right-6 bg-yellow-400 p-4 rounded-3xl shadow-lg -rotate-12">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
