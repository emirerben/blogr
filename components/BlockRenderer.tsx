import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './BlockRenderer.module.css';

interface BaseBlock {
  id: string;
  type: string;
  content: string;
  videoId?: string;
  trackId?: string;
}

interface BlockRendererProps {
  blocks: BaseBlock[];
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  // Helper function to extract YouTube video ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  // Helper function to extract Spotify track ID
  const getSpotifyId = (url: string) => {
    // Handle full URLs
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) return trackMatch[1];
    
    // Handle just the ID
    const idMatch = url.match(/^[a-zA-Z0-9]{22}$/);
    if (idMatch) return url;
    
    return null;
  };

  const renderBlock = (block: BaseBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className={styles.textBlock}>
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        );

      case 'youtube':
        const youtubeId = getYoutubeId(block.videoId || '');
        return (
          <div className={styles.youtubeBlock}>
            <div className={styles.videoWrapper}>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );

      case 'spotify':
        const spotifyId = getSpotifyId(block.trackId || '');
        return (
          <div className={styles.spotifyBlock}>
            <iframe
              src={`https://open.spotify.com/embed/track/${spotifyId}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
            />
          </div>
        );

      default:
        return <div>{block.content}</div>;
    }
  };

  return (
    <div className={styles.blocks}>
      {blocks.map((block) => (
        <div key={block.id} className={styles.block}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};

export default BlockRenderer; 