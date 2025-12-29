
import React from 'react';
import { Camera, Wand2, BrainCircuit, Printer, Sparkles, ArrowDown } from 'lucide-react';

interface HowItWorksProps {
  onStart: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  const steps = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "1. Capture the Hero",
      desc: "Upload a simple photo of your child. Our system respects privacy and only uses the image to map their unique features.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "2. Pixar-Style Transformation",
      desc: "Our AI 'magic wand' transforms the photo into a beautiful 3D-animated character that looks just like them.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "3. Gemini Story Engine",
      desc: "The world-class Gemini AI writes a personalized 10-page adventure featuring your child's name and character.",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "4. Grounded in Reality",
      desc: "Every story is woven with 2 real-world educational facts, verified by Google Search, making learning part of the fun.",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      icon: <Printer className="w-8 h-8" />,
      title: "5. High-Quality Print",
      desc: "Review your digital preview, then order a high-quality hardcover book delivered straight to your door.",
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bubblegum text-slate-800">The Secret Sauce</h2>
        <p className="text-xl text-slate-600">How we turn stardust into storytime.</p>
      </div>

      <div className="space-y-12">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center gap-8 w-full group">
              <div className={`w-20 h-20 shrink-0 rounded-[24px] ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">{step.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{step.desc}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <ArrowDown className="mt-12 text-slate-200 w-8 h-8 animate-bounce" />
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={onStart}
          className="px-12 py-5 bg-indigo-600 text-white font-bold rounded-3xl shadow-2xl hover:bg-indigo-700 transition-all hover:-translate-y-1"
        >
          Make Magic Now
        </button>
      </div>
    </div>
  );
};
