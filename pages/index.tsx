import React from "react"
import Layout from "../components/Layout"
import Link from "next/link"
import { useSession } from 'next-auth/react'

const Home: React.FC = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="page">
        <h1>Welcome to Our Blogging Platform</h1>
        {session ? (
          <>
            <p>Welcome, {session.user.name}!</p>
            <Link href="/create">
              <a>Create new post</a>
            </Link>
          </>
        ) : (
          <p>Please sign in to create posts.</p>
        )}
      </div>
    </Layout>
  )
}

export default Home