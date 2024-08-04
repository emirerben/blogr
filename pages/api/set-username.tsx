import prisma from '../../lib/prisma'

export default async function handle(req, res) {
  const { username, userId } = req.body
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username },
    })
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ error: 'Username already taken' })
  }
}