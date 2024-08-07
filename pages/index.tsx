import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma'
import { useSession, getSession } from 'next-auth/react'
import Link from 'next/link'
import styles from '../components/Post.module.css'
import Button from '../components/Button';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    return { props: { feed: [] } };
  }

  const feed = await prisma.post.findMany({
    where: { 
      published: true,
      author: { email: session.user.email }
    },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { 
    props: { 
      feed: JSON.parse(JSON.stringify(feed))
    } 
  };
};

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Blog</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={styles.page}>
        <h1>My Published Posts</h1>
        <main className={styles.mainContent}>
          {props.feed.length > 0 ? (
            props.feed.map((post) => (
              <Post key={post.id} post={post} />
            ))
          ) : (
            <p>You haven't published any posts yet.</p>
          )}
        </main>
        <div className="actions">
          <Link href="/create">
            <Button>Create New Post</Button>
          </Link>

        </div>
      </div>

    </Layout>
  )
}

export default Blog