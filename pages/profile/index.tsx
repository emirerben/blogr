import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Layout from '../../components/Layout';

type Props = {
  user: { name: string; username: string } | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, username: true },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user },
  };
};

const SubdomainPage: React.FC<Props> = ({ user }) => {
  return (
    <Layout>
      <h1>{user?.name}'s Blog</h1>
    </Layout>
  );
};

export default SubdomainPage;