import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from './prisma'
import { Prisma } from '@prisma/client'

export function CustomPrismaAdapter(p = prisma) {
  return {
    ...PrismaAdapter(p),
    createUser: (data: Prisma.UserCreateInput) => {
      const subdomain = data.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || ''
      return p.user.create({
        data: {
          ...data,
        },
      })
    },
  }
}