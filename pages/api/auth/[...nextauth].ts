import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (existingUser && existingUser.accounts.length === 0) {
        // User exists but has no linked account, let's link it
        await prisma.account.create({
          data: {
            userId: existingUser.id,
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
        return true;
      }

      return true; // Allow sign in
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.username = user.username || null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback called')
      console.log('URL:', url)
      console.log('Base URL:', baseUrl)
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true, // Enable debug messages
}

export default NextAuth(authOptions)