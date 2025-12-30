
import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, Github } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onSuccess: (user: UserType) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSuccess({
        id: 'user_123',
        name: name || 'Wizard Parent',
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-[40px] shadow-2xl border-4 border-white overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="bg-indigo-600 p-8 text-center text-white relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl font-bubblegum">{isLogin ? 'Welcome Back!' : 'Join the Magic'}</h2>
        <p className="text-indigo-100 text-sm mt-2">
          {isLogin ? 'The library awaits your next adventure.' : 'Start creating personalized stories for your little heroes.'}
        </p>
      </div>

      <div className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input 
                  required 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-200 outline-none transition-all" 
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@magic.com" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-200 outline-none transition-all" 
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-200 outline-none transition-all" 
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? 'Enter Library' : 'Become a Wizard'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase tracking-tighter"><span className="bg-white px-2 text-slate-400">or magic in with</span></div>
        </div>

        <button className="w-full py-3 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <Github className="w-5 h-5" /> Google Magic
        </button>

        <div className="text-center space-y-2">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already a wizard? Log in"}
          </button>
          <br />
          <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600">Maybe later</button>
        </div>
      </div>
    </div>
  );
};
