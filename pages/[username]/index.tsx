import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import Post, { PostProps } from '../../components/Post'
import prisma from '../../lib/prisma'

// Helper function to safely convert Date to ISO string
const toISOString = (date: Date | null | undefined) => date?.toISOString() ?? null;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const username = params?.username as string
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: { published: true },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) {
    return { notFound: true }
  }

  // Convert Date objects to ISO strings, handling potential null values
  const posts = user.posts.map(post => ({
    ...post,
    createdAt: toISOString(post.createdAt),
    updatedAt: toISOString(post.updatedAt),
    author: post.author ? {
      ...post.author,
    } : null
  }))

  return {
    props: { 
      user: { 
        name: user.name, 
        username: user.username 
      }, 
      posts: JSON.parse(JSON.stringify(posts)) // Ensure all data is serializable
    },
  }
}

type Props = {
  user: { name: string; username: string }
  posts: PostProps[]
}

const UserProfile: React.FC<Props> = ({ user, posts }) => {
  return (
    <Layout>
      <h1>{user.name}'s Blog</h1>
      <main>
        {posts.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </main>
    </Layout>
  )
}

export default UserProfile