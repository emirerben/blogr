import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from './prisma'

export function CustomPrismaAdapter(p = prisma) {
  return {
    ...PrismaAdapter(p),
    createUser: (data) => {
      const subdomain = data.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
      return p.user.create({
        data: {
          ...data,
        },
      })
    },
  }
}