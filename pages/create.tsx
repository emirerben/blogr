import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '../pages/p/PostBody.module.css'
import Button from '../components/Button';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: session } = useSession();

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
      <div className={styles.page}>
        <form onSubmit={submitData}>
          <h1 className={styles.title}>Create Draft</h1>
          <input
            className={styles.input}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            className={styles.textarea}
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
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