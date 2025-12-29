
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { StoryForm } from './components/StoryForm';
import { Loader } from './components/Loader';
import { StoryPreview } from './components/StoryPreview';
import { ChatBot } from './components/ChatBot';
import { AppState, ChildInfo, StoryBook } from './types';
import { generatePersonalizedStory } from './services/geminiService';

export default function App() {
  const [state, setState] = useState<AppState>('home');
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [story, setStory] = useState<StoryBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasRuntimeError, setHasRuntimeError] = useState(false);

  // Catch unhandled errors that might cause a blank screen
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error("Runtime Magic Error:", e.error);
      setHasRuntimeError(true);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasRuntimeError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-50 p-6 text-center">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md border-4 border-white">
          <h1 className="text-4xl font-bubblegum text-indigo-600 mb-4">Oh Sparkles!</h1>
          <p className="text-slate-600 mb-8 font-medium">The magic encountered a little hiccup. Please try refreshing the page!</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
      console.error(err);
      setError("The magic spell fizzled out! Please check your connection and try again.");
      setState('form');
    }
  };

  const handleReset = () => {
    setStory(null);
    setChildInfo(null);
    setState('home');
  };

  return (
    <Layout>
      <div className="animate-in fade-in duration-1000">
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
          <StoryPreview book={story} child={childInfo} onReset={handleReset} />
        )}
      </div>
      <ChatBot />
    </Layout>
  );
}
