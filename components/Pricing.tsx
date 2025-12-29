
import React from 'react';
import { Check, Sparkles, Star, Zap } from 'lucide-react';

interface PricingProps {
  onStart: () => void;
  onTierSelect?: (pages: number) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onStart, onTierSelect }) => {
  const tiers = [
    {
      name: "Digital Dreamer",
      price: "$9.99",
      pages: 5,
      desc: "Perfect for tablet bedtime stories",
      icon: <Zap className="w-6 h-6" />,
      color: "indigo",
      features: ["5 Personalized Pages", "Pixar-style Hero Avatar", "Full HD PDF Download", "Access to Magic Mike Chat"]
    },
    {
      name: "Magic Hardcover",
      price: "$24.99",
      pages: 10,
      desc: "Our most popular choice",
      icon: <Sparkles className="w-6 h-6" />,
      color: "pink",
      popular: true,
      features: ["10 Personalized Pages", "Premium Hardcover Book", "High-Quality Illustrations", "Global Shipping", "Personalized Dedication"]
    },
    {
      name: "Collector's Vault",
      price: "$39.99",
      pages: 20,
      desc: "For the ultimate memory",
      icon: <Star className="w-6 h-6" />,
      color: "yellow",
      features: ["20 Personalized Pages", "AI Voice Narration", "Gold Foil Cover Lettering", "Priority 4K Illustrations", "Lifetime PDF Updates"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bubblegum text-slate-800">Pick Your Magic</h2>
        <p className="text-xl text-slate-600">Upgrade your story to a full-length adventure.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier, idx) => (
          <div 
            key={idx} 
            className={`relative flex flex-col p-8 rounded-[40px] bg-white border-4 ${
              tier.popular ? 'border-pink-300 shadow-2xl scale-105 z-10' : 'border-white shadow-xl'
            } transition-all hover:translate-y-[-8px]`}
          >
            {tier.popular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-1 rounded-full text-sm font-bold uppercase tracking-widest">Most Popular</div>}
            
            <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center ${tier.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : tier.color === 'pink' ? 'bg-pink-100 text-pink-600' : 'bg-yellow-100 text-yellow-700'}`}>{tier.icon}</div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-bubblegum text-slate-900">{tier.price}</span></div>
            <p className="text-slate-500 text-sm mb-8">{tier.desc}</p>

            <div className="space-y-4 flex-1 mb-8">
              {tier.features.map((feat, fIdx) => (
                <div key={fIdx} className="flex gap-3 text-sm font-semibold text-slate-600"><Check className="w-5 h-5 text-green-500 shrink-0" /><span>{feat}</span></div>
              ))}
            </div>

            <button 
              onClick={() => onTierSelect ? onTierSelect(tier.pages) : onStart()}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-md ${tier.popular ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            >
              {onTierSelect ? `Generate ${tier.pages} Pages` : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
