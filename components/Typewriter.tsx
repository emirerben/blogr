import React, { useState, useEffect } from 'react';
import styles from './Typewriter.module.css';

interface TypewriterProps {
  text: string;
  delay?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, delay = 20 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span className={styles.typewriter}>{currentText}</span>;
};

export default Typewriter;