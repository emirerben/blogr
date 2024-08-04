import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
  const { title, content } = req.body;

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: true,
        author: { connect: { id: session.user.id } },
      },
    });
    res.json(result);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post", details: error.message });
  }
}