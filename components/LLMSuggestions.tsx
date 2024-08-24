import React, { useState, useEffect } from 'react';
import styles from './LLMSuggestions.module.css';
import Typewriter from './Typewriter';

interface LLMSuggestionsProps {
  content: string;
  title: string;
}

const LLMSuggestions: React.FC<LLMSuggestionsProps> = ({ content, title }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const generateSuggestion = async () => {
      if (content.length > 50) {
        setLoading(true);
        setSuggestion(''); // Clear the previous suggestion
        try {
          const response = await fetch('/api/llm-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, title }),
          });
          if (!response.ok) {
            throw new Error('Failed to generate suggestion');
          }
          const data = await response.json();
          setSuggestion(data.suggestion);
          setError(null);
        } catch (error) {
          console.error('Error generating suggestion:', error);
          setError('Failed to generate suggestion. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestion('');
        setError(null);
      }
    };

    const debounce = setTimeout(generateSuggestion, 1000);
    return () => clearTimeout(debounce);
  }, [content, title]);

  return (
    <div className={styles.suggestionsContainer}>
      {loading && <p>Generating suggestion...</p>}
      {error && <div className={styles.error}>{error}</div>}
      {suggestion ? (
        <Typewriter text={suggestion} key={suggestion} />
      ) : (
        <p>{content.length <= 50 ? "Type more to get a suggestion" : "No suggestion available"}</p>
      )}
    </div>
  );
};

export default LLMSuggestions;