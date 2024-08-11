import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma'

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, published } = req.body;

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.username) {
      return res.status(400).json({ error: "User doesn't have a username set" });
    }

    const slug = generateSlug(title);

    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published ?? false, // Use the provided value or default to false
        author: { connect: { id: session.user.id } },
        slug: slug,
      },
    });
    res.json(result);
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Error creating post", details: error.message });
    } else {
      res.status(500).json({ error: "Error creating post", details: "An unknown error occurred" });
    }
  }
}