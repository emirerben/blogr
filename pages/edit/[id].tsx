import React, { useState, useRef, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import prisma from '../../lib/prisma';
import styles from '../p/PostBody.module.css';
import Button from '../../components/Button';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post: JSON.parse(JSON.stringify(post)) },
  };
};

const EditPost: React.FC<{ post: any }> = ({ post }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const { data: session, status } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) Router.push('/');
  }, [session, status]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch(`/api/post/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push(post.published ? `/p/${post.id}` : '/drafts');
    } catch (error) {
      console.error(error);
    }
  };

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
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            onChange={(e) => {
              setContent(e.target.value);
              adjustTextareaHeight();
            }}
            placeholder="Write your post content here..."
            value={content}
          />
          <div className={styles.actions}>
            <Button
              disabled={!content || !title}
              type="submit"
            >
              Update {post.published ? 'Post' : 'Draft'}
            </Button>
            <a className={styles.back} href="#" onClick={() => Router.push(post.published ? `/p/${post.id}` : '/drafts')}>
              or Cancel
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPost;