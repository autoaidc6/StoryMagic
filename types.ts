
export interface ChildInfo {
  name: string;
  gender: 'boy' | 'girl' | 'other';
  photo: string | null;
}

export interface StoryPage {
  pageNumber: number;
  content: string;
  illustrationPrompt: string;
  imageUrl?: string;
}

export interface StoryBook {
  title: string;
  pages: StoryPage[];
  sources?: { uri: string; title: string }[];
}

export type AppState = 'home' | 'form' | 'loading' | 'preview';