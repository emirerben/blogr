import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id as string;
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { published: true },
    });
    res.json(post);
  } catch (error) {
    console.error("Error publishing post:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Error publishing post", details: error.message });
    } else {
      res.status(500).json({ error: "Error publishing post", details: "An unknown error occurred" });
    }
  }
}