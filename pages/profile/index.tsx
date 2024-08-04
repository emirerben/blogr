import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';
import Layout from '../../components/Layout';

type Props = {
  user: { name: string; subdomain: string } | null;
  posts: { title: string; content: string }[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { subdomain } = context.params as { subdomain: string };

  const user = await prisma.user.findUnique({
    where: { subdomain },
    select: { name: true, subdomain: true },
  });

  if (!user) {
    return { notFound: true };
  }

  const posts = await prisma.post.findMany({
    where: { author: { subdomain } },
    select: { title: true, content: true },
  });

  return { props: { user, posts } };
};

const SubdomainPage: React.FC<Props> = ({ user, posts }) => {
  return (
    <Layout>
      <h1>{user?.name}'s Blog</h1>
      {posts.map((post, index) => (
        <article key={index}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </Layout>
  );
};

export default SubdomainPage;