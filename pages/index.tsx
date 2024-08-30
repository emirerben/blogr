import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Router from 'next/router'  // Added this line
import styles from '../components/Post.module.css'
import Button from '../components/Button'
import buttonStyles from '../components/Button.module.css'
import LandingPage from '../components/LandingPage'
import { getSession } from 'next-auth/react' // Added this import

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return { props: { feed: [] } };
  }

  const feed = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: true,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Convert Date objects to ISO strings
  const serializedFeed = feed.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  return { props: { feed: serializedFeed } }
}

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  const { data: session } = useSession()

  const deletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      });
      Router.push('/'); // Use the imported Router
    }
  };

  if (!session) {
    return <LandingPage />;
  }

  return (
    <Layout>
      <div className={styles.page}>
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id}>
              <Post post={post} onDelete={deletePost} />
            </div>
          ))}
        </main>
      </div>
      {session && (
        <div className={styles.createNewPost}>
          <Link href="/create">
            <Button className={`${buttonStyles.button} ${buttonStyles.circularButton}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  )
}

export default Blog