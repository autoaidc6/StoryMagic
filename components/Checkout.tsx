
import React, { useState } from 'react';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

interface CheckoutProps {
  childName: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ childName, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 space-y-8">
        <button onClick={onBack} className="flex items-center text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Book
        </button>

        <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bubblegum text-indigo-600 mb-8">Secure Checkout</h2>
          
          <form onSubmit={handlePay} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Email Address</label>
              <input type="email" required placeholder="parent@magic.com" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Card Information</label>
              <div className="relative">
                <input type="text" required placeholder="Card number" className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
                <input type="text" required placeholder="CVC" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay $24.99
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400">Your magic is secured with 256-bit encryption. ✨</p>
          </form>
        </div>
      </div>

      <div className="w-full md:w-80 space-y-6">
        <div className="bg-indigo-50 rounded-[30px] p-6 space-y-4">
          <h3 className="font-bold text-indigo-700">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">StoryMagic Hardcover</span>
            <span className="font-bold">$24.99</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Personalized: {childName}</span>
            <span className="text-green-600 font-bold">FREE</span>
          </div>
          <div className="h-px bg-indigo-100"></div>
          <div className="flex justify-between text-lg font-bold text-indigo-900">
            <span>Total</span>
            <span>$24.99</span>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl bg-white border border-indigo-100 flex items-center gap-3">
          <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" />
          <p className="text-xs text-slate-600">Estimated delivery: <span className="font-bold">7-10 Magical Days</span></p>
        </div>
      </div>
    </div>
  );
};
