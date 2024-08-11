import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Button from '../../components/Button';
import styles from './PostBody.module.css';

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
  const [isCopied, setIsCopied] = useState(false);

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.post.author?.email;

  const shareableLink = `${process.env.NEXT_PUBLIC_SITE_URL}/p/${props.post.id}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

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
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      });
      Router.push('/');
    }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <h2 className={styles.title}>{props.post.title}</h2>
        <p className={styles.author}>By {props.post.author?.name || 'Unknown author'}</p>
        <div className={styles.shareLink}>
          <Button 
            className={`${styles.button} ${isCopied ? styles.copiedButton : ''}`} 
            onClick={copyToClipboard}
          >
            <span className={styles.buttonText}>
              {isCopied ? 'Copied' : 'Share'}
            </span>
            <span className={styles.icon}>
              {isCopied ? '✅' : '🔗'}
            </span>
          </Button>
        </div>
        <div className={styles.content}>
          <ReactMarkdown>{props.post.content}</ReactMarkdown>
        </div>
        {userHasValidSession && postBelongsToUser && (
          <div className={styles.actions}>
            {!props.post.published && (
              <Button
                className={`${styles.actionButton} ${styles.publishButton}`}
                onClick={() => publishPost(props.post.id)}
              >
                Publish
              </Button>
            )}
            <Button
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={editPost}
            >
              Edit
            </Button>
            <Button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => deletePost(props.post.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Post;