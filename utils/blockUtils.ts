import { Block, BlockType } from '../types/EditorTypes';
import { v4 as uuidv4 } from 'uuid';

export const parseContent = (content: string): Block[] => {
  try {
    // Try to parse as JSON first (for new format)
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.map(block => ({
        ...block,
        id: block.id || uuidv4() // Ensure each block has an ID
      }));
    }
  } catch (e) {
    // If parsing fails, treat as legacy content and convert to text block
    return [{
      id: uuidv4(),
      type: 'text' as BlockType,
      content: content || ''
    }];
  }
  return [];
};

export const serializeBlocks = (blocks: Block[]): string => {
  // Create a sanitized version of blocks without any non-serializable data
  const sanitizedBlocks = blocks.map(block => {
    const sanitizedBlock = {
      id: block.id,
      type: block.type,
      content: block.content || ''
    };

    // Add additional properties based on block type
    switch (block.type) {
      case 'header':
        return {
          ...sanitizedBlock,
          level: block.level || 1
        };
      case 'image':
        return {
          ...sanitizedBlock,
          url: block.url || '',
          caption: block.caption || ''
        };
      case 'youtube':
        return {
          ...sanitizedBlock,
          videoId: block.videoId || ''
        };
      case 'spotify':
        return {
          ...sanitizedBlock,
          trackId: block.trackId || ''
        };
      default:
        return sanitizedBlock;
    }
  });

  return JSON.stringify(sanitizedBlocks);
};

export const createEmptyBlock = (type: BlockType): Block => {
  const baseBlock = {
    id: uuidv4(),
    type,
    content: ''
  };

  switch (type) {
    case 'text':
      return baseBlock;
    case 'header':
      return { ...baseBlock, level: 1 };
    case 'image':
      return { ...baseBlock, url: '', caption: '' };
    case 'youtube':
      return { ...baseBlock, videoId: '' };
    case 'spotify':
      return { ...baseBlock, trackId: '' };
    default:
      return baseBlock;
  }
}; 