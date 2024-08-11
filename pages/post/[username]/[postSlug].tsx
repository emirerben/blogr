import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../../components/Layout';
import { PostProps } from '../../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Helper function to convert Date to ISO string
const toISOString = (date: Date | null) => date?.toISOString() ?? null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username, postSlug } = context.params as { username: string; postSlug: string };
  
  const post = await prisma.post.findFirst({
    where: { 
      slug: postSlug,
      author: { username },
      published: true,
    },
    include: { author: true },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: `/p/${post.id}`,
      permanent: false,
    },
  };
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const { data: session, status } = useSession();
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post.author?.email;

  const shareableLink = `${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.author?.username}/${post.slug}`;

  const editPost = () => {
    Router.push(`/edit/${post.id}`);
  };

  const deletePost = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/post/${post.id}`, {
        method: 'DELETE',
      });
      Router.push('/');
    }
  };

  return (
    <Layout>
      <div className="post">
        <h1>{post.title}</h1>
        <p>By {post.author?.name || 'Unknown author'}</p>
        <ReactMarkdown children={post.content} />
        {userHasValidSession && postBelongsToUser && (
          <div className="actions">
            <button onClick={editPost}>Edit</button>
            <button onClick={deletePost}>Delete</button>
          </div>
        )}
        <div className="share">
          <p>Share this post:</p>
          <input type="text" value={shareableLink} readOnly onClick={(e) => e.currentTarget.select()} />
        </div>
      </div>
      <style jsx>{`
        .post {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .actions {
          margin-top: 2rem;
        }
        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 0.5rem 1rem;
          margin-right: 1rem;
        }
        .share {
          margin-top: 2rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Layout>
  );
};

export default Post;