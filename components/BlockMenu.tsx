import React from 'react';
import styles from './BlockMenu.module.css';
import { BlockType } from '../types/EditorTypes';

interface BlockMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

const BlockMenu: React.FC<BlockMenuProps> = ({ onSelect, onClose }) => {
  const blockTypes: { type: BlockType; label: string; icon: string }[] = [
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'header', label: 'Header', icon: 'H' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'youtube', label: 'YouTube', icon: '▶️' },
    { type: 'spotify', label: 'Spotify', icon: '🎵' },
  ];

  return (
    <div className={styles.menu}>
      {blockTypes.map(({ type, label, icon }) => (
        <button
          key={type}
          className={styles.menuItem}
          onClick={() => {
            onSelect(type);
            onClose();
          }}
        >
          <span className={styles.icon}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
};

export default BlockMenu; 