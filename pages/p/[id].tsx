import React, { useState, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import BlockRenderer from '../../components/BlockRenderer';
import styles from './PostBody.module.css';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!prisma) throw new Error('Database client is not initialized');
  
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
    props: { 
      post: JSON.parse(JSON.stringify(post))
    },
  };
};

interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    published: boolean;
    author: {
      name: string;
      email: string;
    } | null;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { data: session } = useSession();
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post?.author?.email;

  const publishPost = async (id: string) => {
    try {
      await fetch(`/api/publish/${id}`, {
        method: 'PUT',
      });
      Router.push('/');
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`/api/post/${id}`, {
          method: 'DELETE',
        });
        Router.push('/');
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const blocks = useMemo(() => {
    try {
      return JSON.parse(post.content);
    } catch (e) {
      return [{
        id: 'legacy',
        type: 'text',
        content: post.content
      }];
    }
  }, [post.content]);

  const shareableLink = `${process.env.NEXT_PUBLIC_SITE_URL}/p/${post.id}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.author}>By {post.author?.name || 'Unknown author'}</p>
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
          <BlockRenderer blocks={blocks} />
        </div>
        {userHasValidSession && postBelongsToUser && (
          <div className={styles.actions}>
            {!post.published && (
              <Button
                className={`${styles.actionButton} ${styles.publishButton}`}
                onClick={() => publishPost(post.id)}
              >
                Publish
              </Button>
            )}
            <Button
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={() => Router.push(`/edit/${post.id}`)}
            >
              Edit
            </Button>
            <Button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => deletePost(post.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Post;