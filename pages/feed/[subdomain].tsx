import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import Post, { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"
import { useSession } from 'next-auth/react'
import Router from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Context:", context); // Debug log

  const subdomain = context.params?.subdomain as string | undefined;
  
    if (!subdomain) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  console.log("Subdomain:", subdomain); // Debug log

  const feed = await prisma.post.findMany({
    where: { 
      published: true,
      author: { username: subdomain }
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return {
    props: { feed, subdomain },
  };
};

type Props = {
  feed: PostProps[]
  subdomain: string
}

const Blog: React.FC<Props> = ({ feed, subdomain }) => {
  const { data: session } = useSession()

  const deletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      });
      Router.push(`/feed/${subdomain}`); // Refresh the current feed page
    }
  };

  return (
    <Layout>
      <div className="page">
        <h1>{subdomain}'s Feed</h1>
        <main>
          {feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} onDelete={deletePost} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }
        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog