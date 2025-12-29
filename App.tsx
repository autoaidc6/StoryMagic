
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { StoryForm } from './components/StoryForm';
import { Loader } from './components/Loader';
import { StoryPreview } from './components/StoryPreview';
import { ChatBot } from './components/ChatBot';
import { Checkout } from './components/Checkout';
import { AppState, ChildInfo, StoryBook } from './types';
import { generatePersonalizedStory } from './services/geminiService';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>('home');
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [story, setStory] = useState<StoryBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log("StoryMagic App successfully mounted ✨");
  }, []);

  const handleStart = () => setState('form');
  
  const handleFormSubmit = async (info: ChildInfo) => {
    setChildInfo(info);
    setState('loading');
    setError(null);
    
    try {
      const generatedStory = await generatePersonalizedStory(info);
      setStory(generatedStory);
      setState('preview');
    } catch (err) {
      console.error("Story generation error:", err);
      setError("The magic spell fizzled out! Please check your connection and try again.");
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
    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <Layout>
      <div className="animate-in fade-in duration-1000 relative">
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
            <div className="bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold">Magic Order Received! Check your email. ✨</span>
            </div>
          </div>
        )}

        {state === 'home' && <Hero onStart={handleStart} />}
        
        {state === 'form' && (
          <div className="space-y-4">
            {error && (
              <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-3xl text-center font-bold">
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
