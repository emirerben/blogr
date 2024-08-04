import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma'
import { useSession, getSession } from 'next-auth/react'
import Link from 'next/link'

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
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>
  }

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
      <div className="page">
        <h1>My Published Posts</h1>
        <main>
          {props.feed.length > 0 ? (
            props.feed.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))
          ) : (
            <p>You haven't published any posts yet.</p>
          )}
        </main>
        <div className="actions">
          <Link href="/create">
            <button>Create New Post</button>
          </Link>
          <Link href="/drafts">
            <button>View Drafts</button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
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

        button:hover {
          background: #e6e6e6;
        }
      `}</style>
    </Layout>
  )
}

export default Blog