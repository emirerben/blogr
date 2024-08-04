import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

// Helper function to safely convert Date to ISO string
const toISOString = (date: Date | null | undefined) => date?.toISOString() ?? null;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true, username: true },
      },
    },
  });

  if (!post) {
    return { notFound: true };
  }

  // Convert Date objects to ISO strings
  const serializedPost = {
    ...post,
    createdAt: toISOString(post.createdAt),
    updatedAt: toISOString(post.updatedAt),
    author: post.author,
  };

  return {
    props: { post: JSON.parse(JSON.stringify(serializedPost)) },
  };
};

const Post: React.FC<{ post: PostProps }> = (props) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.post.author?.email;

  const shareableLink = `${process.env.NEXT_PUBLIC_SITE_URL}/post/${props.post.author?.username}/${props.post.slug}`;

  const editPost = () => {
    Router.push(`/edit/${props.post.id}`);
  };

  const publishPost = async (id: string) => {
    await fetch(`/api/publish/${id}`, {
      method: 'PUT',
    });
    await Router.push('/');
  };

  const deletePost = async (id: string) => {
    await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    });
    Router.push('/');
  };

  return (
    <Layout>
      <div>
        <h2>{props.post.title}</h2>
        <p>By {props.post.author?.name || 'Unknown author'}</p>
        {props.post.published && (
          <div>
            <p>Shareable link:</p>
            <input type="text" value={shareableLink} readOnly />
          </div>
        )}
        <ReactMarkdown children={props.post.content} />
        {userHasValidSession && postBelongsToUser && (
          <div className="actions">
            {!props.post.published && (
              <button onClick={() => publishPost(props.post.id)}>Publish</button>
            )}
            <button onClick={() => editPost()}>Edit</button>
            <button onClick={() => deletePost(props.post.id)}>Delete</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
          margin-right: 1rem;
        }

        input[type="text"] {
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