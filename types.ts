
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  category: 'neuroscience' | 'psychology' | 'relationship' | 'general';
  relevanceScore: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  text: string;
  sources: GroundingSource[];
}

export enum NewsCategory {
  NEUROSCIENCE = 'Neurosciences',
  PSYCHOLOGY = 'Psychologie',
  RELATIONSHIPS = 'Relations de Couple',
  GENERAL = 'Actualités'
}
