import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Layout from '../../components/Layout';

type Props = {
  user: { name: string | null; username: string | null } | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  if (!session.user?.email) {
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

const ProfilePage: React.FC<Props> = ({ user }) => {
  if (!user) {
    return <Layout><p>User not found</p></Layout>;
  }

  return (
    <Layout>
      <h1>{user.name ?? 'Unnamed User'}'s Profile</h1>
      <p>Username: {user.username ?? 'Not set'}</p>
    </Layout>
  );
};

export default ProfilePage;