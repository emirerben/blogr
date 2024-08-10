import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from '../components/Post.module.css'
import Button from '../components/Button'
import buttonStyles from '../components/Button.module.css'

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

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

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id}>
              <Post post={post} />
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