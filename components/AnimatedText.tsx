import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './AnimatedText.module.css';

interface AnimatedTextProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { 
          opacity: 0, 
          width: 0 
        },
        { 
          opacity: 1, 
          width: 'auto', 
          duration: 1, 
          ease: 'power2.out' 
        }
      );

      gsap.fromTo(
        textRef.current.children,
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.05, 
          ease: 'power2.out' 
        }
      );
    }
  }, [text]);

  return (
    <div ref={textRef} className={styles.animatedText}>
      {text.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </div>
  );
};

export default AnimatedText;