import prisma from '../../../lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request method:', req.method);
    const postId = req.query.id as string;
    const { title, content } = req.body;

    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log('Post ID:', postId);
    console.log('Session:', session);

    if (req.method === 'PUT') {
      console.log('Attempting to update post:', { title, content });
      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          title: title,
          content: content,
        },
      }).catch(() => null);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json(post);
    } else if (req.method === 'DELETE') {
      const post = await prisma.post.delete({
        where: { id: postId },
      }).catch(() => null);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json(post);
    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      method: req.method,
      postId,
      session: !!session
    });
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}