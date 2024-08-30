import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prisma'
import { User } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email || !account) {
        return false;
      }

      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (dbUser && account) {
        if (!dbUser.accounts.some(acc => acc.providerAccountId === account.providerAccountId)) {
          await prisma.account.create({
            data: {
              userId: dbUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }
      } else if (!dbUser && account) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? null,
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              }
            }
          },
          include: { accounts: true },
        });
      }

      return true;
    },
    async session({ session, user }: { session: any, user: User & { id: string } }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true },
        });
        session.user.username = dbUser?.username || null;
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)