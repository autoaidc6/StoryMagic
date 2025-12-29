
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
}

export interface StoryBook {
  title: string;
  pages: StoryPage[];
  sources?: { uri: string; title: string }[];
}

export type AppState = 'home' | 'form' | 'loading' | 'preview' | 'checkout' | 'how-it-works' | 'pricing';
