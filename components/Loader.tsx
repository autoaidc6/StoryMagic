
import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Book } from 'lucide-react';

interface LoaderProps {
  customStatus?: string | null;
}

export const Loader: React.FC<LoaderProps> = ({ customStatus }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Opening the library of dreams...",
    "Finding the magical pen...",
    "Mixing the stardust and colors...",
    "Painting your child into the adventure...",
    "Sprinkling extra magic on every page...",
    "Almost ready for story time!"
  ];

  useEffect(() => {
    if (customStatus) return; // Use custom cycle if no explicit status
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length, customStatus]);

  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-8">
      <div className="relative inline-block">
        <div className="animate-bounce bg-white p-8 rounded-[50px] shadow-xl">
          <Book className="w-20 h-20 text-indigo-500" />
        </div>
        <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400 animate-pulse" />
        <Star className="absolute -bottom-4 -left-4 w-10 h-10 text-pink-400 animate-spin-slow" />
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bubblegum text-indigo-700 transition-all duration-500 min-h-[2em] flex items-center justify-center">
          {customStatus || steps[step]}
        </h3>
        <div className="w-full h-3 bg-indigo-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: customStatus ? '75%' : `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      
      <p className="text-slate-400 text-sm animate-pulse italic">
        {customStatus ? "Harnessing Nano Banana Pro 3.1..." : '"One magic minute equals a thousand years of story..."'}
      </p>
    </div>
  );
};
