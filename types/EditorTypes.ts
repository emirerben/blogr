export type BlockType = 'text' | 'header' | 'image' | 'youtube' | 'spotify';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  videoId?: string;
  trackId?: string;
  url?: string;
  caption?: string;
  level?: number;
} 