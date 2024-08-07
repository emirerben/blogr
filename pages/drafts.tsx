import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Post, { PostProps } from '../components/Post';
import prisma from '../lib/prisma';
import Router from 'next/router';
import styles from '../components/Post.module.css';
import Button from '../components/Button';


// Helper function to convert Date to ISO string
const toISOString = (date: Date | null) => date?.toISOString() ?? null;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  // Serialize the drafts, converting Date objects to strings
  const serializedDrafts = drafts.map(draft => ({
    ...draft,
    createdAt: toISOString(draft.createdAt),
    updatedAt: toISOString(draft.updatedAt),
  }));

  return {
    props: { drafts: serializedDrafts },
  };
};

const Drafts: React.FC<{ drafts: PostProps[] }> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  const publishPost = async (id: string) => {
    await fetch(`/api/publish/${id}`, {
      method: 'PUT',
    });
    await Router.push('/drafts');
  };

  const editPost = (id: string) => {
    Router.push(`/edit/${id}`);
  };

  return (
    <Layout>
      <div className={styles.page}>
        <h1>My Drafts</h1>
        <main className={styles.mainContent}>
          {props.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
              <Button onClick={() => editPost(post.id)}>Edit</Button>
              <Button onClick={() => publishPost(post.id)}>Publish</Button>
            </div>
          ))}
        </main>
        
      </div>
    </Layout>
  );
};

export default Drafts;