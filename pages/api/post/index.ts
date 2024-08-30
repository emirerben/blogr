import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content } = req.body;

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: false,
        author: { connect: { id: user.id } },
      },
    });
    res.json(result);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  }
}