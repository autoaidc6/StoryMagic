
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
import { AppState, ChildInfo, StoryBook, StoryPage } from './types';
import { createStoryBookAPI, generatePageImageAPI } from './services/geminiService';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>('home');
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [story, setStory] = useState<StoryBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const handleStart = () => setState('form');
  
  const handleFormSubmit = async (info: ChildInfo, theme: string) => {
    setState('loading');
    setLoadingStatus("Writing the adventure...");
    setError(null);
    
    try {
      // Step 1: Generate Story Text (Flash)
      const storyResult = await createStoryBookAPI(info, theme, 3);
      
      // Step 2: Auto-Generate Preview Illustrations (Pro)
      setLoadingStatus("Painting the Hero (Pro 3D)...");
      
      const illustratedPages = await Promise.all(
        storyResult.pages.map(async (page: StoryPage) => {
          try {
            // Attempt to auto-generate 1K preview images if possible
            const imageUrl = await generatePageImageAPI(page.visual_prompt, '1K');
            return { ...page, imageUrl };
          } catch (e) {
            console.warn(`Auto-image gen failed for page ${page.page}:`, e);
            return page; // Fallback to text-only if image fails
          }
        })
      );

      setChildInfo(info);
      setStory({ ...storyResult, pages: illustratedPages });
      setState('preview');
    } catch (err: any) {
      setError(err.message || "The magical ink dried up!");
      setState('form');
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleTierSelected = async (pagesCount: number) => {
    if (!childInfo || !story) return;
    setState('loading');
    setLoadingStatus(`Expanding to ${pagesCount} pages...`);
    try {
      const fullStory = await createStoryBookAPI(childInfo, story.theme, pagesCount);
      setStory(fullStory);
      setState('preview');
    } catch (err: any) {
      setError(err.message);
      setState('pricing');
    } finally {
      setLoadingStatus(null);
    }
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
        {state === 'pricing' && (
          <Pricing onStart={() => setState('form')} onTierSelect={handleTierSelected} />
        )}

        {state === 'form' && (
          <div className="space-y-4">
            {error && <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-3xl flex items-center justify-center gap-3 font-bold"><AlertCircle className="w-5 h-5" />{error}</div>}
            <StoryForm onSubmit={handleFormSubmit} onBack={() => setState('home')} />
          </div>
        )}
        
        {state === 'loading' && <Loader customStatus={loadingStatus} />}
        
        {state === 'preview' && story && childInfo && (
          <StoryPreview book={story} child={childInfo} onReset={() => setState('home')} onCheckout={() => setState('pricing')} />
        )}

        {state === 'checkout' && childInfo && (
          <Checkout childName={childInfo.name} onBack={() => setState('preview')} onSuccess={() => { setShowSuccess(true); setState('home'); }} />
        )}
      </div>
      <ChatBot />
    </Layout>
  );
}
