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
    return {
      props: { drafts: [] },
    };
  }

  if (!session.user?.email) {
    return {
      props: { drafts: [] },
    };
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
    orderBy: {
      createdAt: 'desc',
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
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Layout>Loading...</Layout>
  }

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

  const deletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      });
      Router.push('/drafts');
    }
  };
  
  return (
    <Layout>
      <div className={styles.page}>
        <h1>My Drafts</h1>
        <main className={styles.mainContent}>
          {props.drafts.map((post) => (
            <div key={post.id} className={styles.Post}>
              <Post post={post} onDelete={deletePost} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Drafts;