import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import prisma from '../../lib/prisma';

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

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) Router.push('/');
  }, [session, status]);

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
      <div>
        <form onSubmit={submitData}>
          <h1>Edit {post.published ? 'Post' : 'Draft'}</h1>
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
          <input disabled={!content || !title} type="submit" value="Update" />
          <a className="back" href="#" onClick={() => Router.push(post.published ? `/p/${post.id}` : '/drafts')}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default EditPost;