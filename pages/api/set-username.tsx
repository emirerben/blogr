import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username, userEmail } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { username },
    })

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: 'Error updating username' })
  }
}