import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useSession } from 'next-auth/react';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: session } = useSession();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, published: false }; // Explicitly set published to false
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      await Router.push('/drafts'); // Redirect to drafts page after creation
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
      <div>
        <form onSubmit={submitData}>
          <h1>Create Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input disabled={!content || !title} type="submit" value="Save Draft" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;