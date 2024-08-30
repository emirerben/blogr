import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username, userEmail } = req.body
  console.log('Received request to set username:', { username, userEmail })

  try {
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { username },
    })
    console.log('Username updated successfully:', updatedUser)
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating username:', error)
    res.status(400).json({ message: 'Error updating username' })
  }
}