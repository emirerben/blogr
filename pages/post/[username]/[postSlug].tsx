import { GetServerSideProps } from "next"
import Layout from "../../../components/Layout"
import prisma from "../../../lib/prisma"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username, postSlug } = context.params as { username: string; postSlug: string };
  
  const post = await prisma.post.findFirst({
    where: { 
      slug: postSlug,
      author: { username }
    },
    include: { author: true },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
};

type Props = {
  post: {
    title: string;
    content: string;
    author: { username: string };
  }
}

const Post: React.FC<Props> = ({ post }) => {
  return (
    <Layout>
      <h1>{post.title}</h1>
      <p>By: {post.author.username}</p>
      <div>{post.content}</div>
    </Layout>
  )
}

export default Post