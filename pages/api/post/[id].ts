import prisma from '../../../lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id as string;
  const { title, content } = req.body;

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === 'PUT') {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title,
        content: content,
      },
    });
    res.json(post);
  } else if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}