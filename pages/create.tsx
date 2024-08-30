import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '../pages/p/PostBody.module.css';
import Button from '../components/Button';
import LLMSuggestions from '../components/LLMSuggestions';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: session } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, published: false };
      console.log('Submitting draft:', body);
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log('Draft saved successfully:', data);
      await Router.push('/drafts');
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to save draft. Please try again.");
    }
  };

  if (!session) {
    return (
      <Layout>
        <p>You need to be logged in to create a post.</p>
      </Layout>
    );
  }

  console.log('CreatePost rendered, content length:', content.length);

  return (
    <Layout>
      <div className={styles.formContainer}>
        <form onSubmit={submitData}>
          <input
            className={styles.input}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            ref={textareaRef}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            value={content}
            className={styles.textarea}
          />
          <LLMSuggestions content={content} title={title} />
          <div className={styles.actions}>
            <Button
              disabled={!content || !title}
              type="submit"
            >
              Save Draft
            </Button>
            <a className={styles.back} href="#" onClick={() => Router.push('/')}>
              or Cancel
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default CreatePost;