
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ChildInfo {
  name: string;
  gender: 'boy' | 'girl' | 'other';
  photo: string | null;
  magicAvatar?: string;
}

export interface StoryPage {
  page: number;
  text: string;
  visual_prompt: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface StoryBook {
  title: string;
  pages: StoryPage[];
  theme: string;
  sources?: { uri: string; title: string }[];
}

export type ImageSize = '1K' | '2K' | '4K';

export type AppState = 'home' | 'form' | 'loading' | 'preview' | 'checkout' | 'how-it-works' | 'pricing' | 'full-generation' | 'auth';
