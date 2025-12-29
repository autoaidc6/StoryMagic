
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { StoryForm } from './components/StoryForm';
import { Loader } from './components/Loader';
import { StoryPreview } from './components/StoryPreview';
import { ChatBot } from './components/ChatBot';
import { Checkout } from './components/Checkout';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { AppState, ChildInfo, StoryBook } from './types';
import { createStoryBookAPI } from './services/geminiService';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>('home');
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [story, setStory] = useState<StoryBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStart = () => setState('form');
  
  const handleFormSubmit = async (info: ChildInfo) => {
    setState('loading');
    setError(null);
    
    try {
      const result = await createStoryBookAPI(info);
      setChildInfo({ ...info, magicAvatar: (result as any).magicAvatar });
      setStory(result);
      setState('preview');
    } catch (err: any) {
      console.error("Backend Process Error:", err);
      setError(err.message || "Something went wrong with the magic. Please try again!");
      setState('form');
    }
  };

  const handleReset = () => {
    setStory(null);
    setChildInfo(null);
    setState('home');
    setShowSuccess(false);
  };

  const handleCheckoutSuccess = () => {
    setShowSuccess(true);
    setState('home');
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleNavigate = (page: 'home' | 'how-it-works' | 'pricing') => {
    setError(null);
    setState(page);
  };

  return (
    <Layout onNavigate={handleNavigate}>
      <div className="animate-in fade-in duration-1000 relative min-h-[60vh]">
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
            <div className="bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold">Magic Order Received! ✨</span>
            </div>
          </div>
        )}

        {state === 'home' && <Hero onStart={handleStart} />}
        
        {state === 'how-it-works' && <HowItWorks onStart={handleStart} />}
        
        {state === 'pricing' && <Pricing onStart={handleStart} />}

        {state === 'form' && (
          <div className="space-y-4">
            {error && (
              <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-3xl flex items-center justify-center gap-3 font-bold">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            <StoryForm onSubmit={handleFormSubmit} onBack={() => setState('home')} />
          </div>
        )}
        
        {state === 'loading' && <Loader />}
        
        {state === 'preview' && story && childInfo && (
          <StoryPreview 
            book={story} 
            child={childInfo} 
            onReset={handleReset} 
            onCheckout={() => setState('checkout')}
          />
        )}

        {state === 'checkout' && childInfo && (
          <Checkout 
            childName={childInfo.name} 
            onBack={() => setState('preview')} 
            onSuccess={handleCheckoutSuccess} 
          />
        )}
      </div>
      <ChatBot />
    </Layout>
  );
}
