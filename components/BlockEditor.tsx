import React from 'react';
import { Block } from '../types/EditorTypes';
import styles from './BlockEditor.module.css';

interface BlockEditorProps {
  block: Block;
  onChange: (data: Partial<Block>) => void;
  onDelete: () => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, onChange, onDelete }) => {
  // Helper function to extract YouTube video ID from URL
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  // Helper function to extract Spotify track ID from URL
  const extractSpotifyId = (url: string) => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : url;
  };

  const renderEditor = () => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            className={styles.textInput}
            value={block.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Type your text here..."
          />
        );

      case 'header':
        return (
          <div className={styles.headerBlock}>
            <select
              value={(block as any).level || 1}
              onChange={(e) => onChange({ level: Number(e.target.value) })}
              className={styles.headerSelect}
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
            <input
              type="text"
              className={styles.headerInput}
              value={block.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Header text..."
            />
          </div>
        );

      case 'image':
        return (
          <div className={styles.imageBlock}>
            <input
              type="text"
              className={styles.urlInput}
              value={(block as any).url || ''}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="Enter image URL..."
            />
            <input
              type="text"
              className={styles.captionInput}
              value={(block as any).caption || ''}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="Image caption (optional)..."
            />
            {(block as any).url && (
              <img 
                src={(block as any).url} 
                alt={(block as any).caption || ''} 
                className={styles.imagePreview}
              />
            )}
          </div>
        );

      case 'youtube':
        return (
          <div className={styles.youtubeBlock}>
            <input
              type="text"
              className={styles.urlInput}
              value={(block as any).videoId || ''}
              onChange={(e) => {
                const videoId = extractYoutubeId(e.target.value);
                onChange({ videoId });
              }}
              placeholder="Paste YouTube URL or video ID..."
            />
            {(block as any).videoId && (
              <div className={styles.youtubePreview}>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${(block as any).videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case 'spotify':
        return (
          <div className={styles.spotifyBlock}>
            <input
              type="text"
              className={styles.urlInput}
              value={(block as any).trackId || ''}
              onChange={(e) => {
                const trackId = extractSpotifyId(e.target.value);
                onChange({ trackId });
              }}
              placeholder="Paste Spotify track URL..."
            />
            {(block as any).trackId && (
              <div className={styles.spotifyPreview}>
                <iframe
                  src={`https://open.spotify.com/embed/track/${(block as any).trackId}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="encrypted-media"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.blockEditor}>
      <div className={styles.blockContent}>
        {renderEditor()}
      </div>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={onDelete}
        title="Delete block"
      >
        ×
      </button>
    </div>
  );
};

export default BlockEditor; 