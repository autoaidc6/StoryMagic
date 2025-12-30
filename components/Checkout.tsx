
import React, { useState } from 'react';
import { CreditCard, Lock, ArrowLeft, CheckCircle, ShieldCheck, CreditCard as CardIcon } from 'lucide-react';

interface CheckoutProps {
  childName: string;
  onBack: () => void;
  onSuccess: () => void;
  tierPrice?: string;
}

export const Checkout: React.FC<CheckoutProps> = ({ childName, onBack, onSuccess, tierPrice = "$24.99" }) => {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of payment gateway processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 space-y-6">
        <button onClick={onBack} className="flex items-center text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Return to Story
        </button>

        <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-50 p-6 flex items-center justify-between border-b border-indigo-100">
            <h2 className="text-2xl font-bubblegum text-indigo-700">Checkout</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Secure Magic
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setMethod('stripe')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${method === 'stripe' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                <CardIcon className="w-4 h-4" /> Credit Card
              </button>
              <button 
                onClick={() => setMethod('paypal')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${method === 'paypal' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                <span className="font-extrabold italic text-blue-800">Pay</span>
                <span className="font-extrabold italic text-blue-400">Pal</span>
              </button>
            </div>

            {method === 'stripe' ? (
              <form onSubmit={handlePay} className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cardholder Name</label>
                    <input type="text" required placeholder="Name on card" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Card Details</label>
                    <div className="relative">
                      <input type="text" required placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all" />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Exp Date</label>
                      <input type="text" required placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">CVC</label>
                      <input type="text" required placeholder="123" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
                    </div>
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
                      Complete Order ({tierPrice})
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-8 py-4 animate-in fade-in duration-300">
                <div className="p-6 bg-blue-50 rounded-3xl text-center space-y-4 border border-blue-100">
                  <div className="flex justify-center text-4xl font-extrabold italic">
                    <span className="text-blue-800">Pay</span>
                    <span className="text-blue-500">Pal</span>
                  </div>
                  <p className="text-blue-600 text-sm">You will be redirected to PayPal to securely complete your magical purchase.</p>
                </div>
                
                <button 
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                   {loading ? (
                    <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="italic">PayPal</span> Checkout
                    </>
                  )}
                </button>
              </div>
            )}
            
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">256-bit magical encryption enabled</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-80 space-y-6 shrink-0">
        <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 space-y-6">
          <h3 className="font-bold text-slate-800 text-xl border-b border-slate-100 pb-4">Magic Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Custom Adventure</span>
              <span className="font-bold text-slate-800">{tierPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Hero: {childName}</span>
              <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded-full">Included</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">AI Illumination</span>
              <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded-full">Pro Tier</span>
            </div>
            <div className="h-px bg-slate-100"></div>
            <div className="flex justify-between text-xl font-bold text-indigo-600 pt-2">
              <span>Total</span>
              <span>{tierPrice}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-[30px] bg-indigo-600 text-white flex items-center gap-4 shadow-xl">
          <div className="bg-indigo-500 p-3 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Instant Delivery</p>
            <p className="text-indigo-200">Digital copies arrive in seconds!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
