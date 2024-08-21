import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '../pages/p/PostBody.module.css';
import Button from '../components/Button';

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
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      await Router.push('/drafts');
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  if (!session) {
    return (
      <Layout>
        <p>You need to be logged in to create a post.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.formContainer}>
        <form onSubmit={submitData}>
          <input
            className={styles.input}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <div className={styles.textareaContainer}>
            <div className={styles.animatedText}>
              {content}
              <span className={styles.cursor}></span>
            </div>
            <textarea
              ref={textareaRef}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              value={content}
              className={styles.textarea}
            />
          </div>
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
};

export default CreatePost;