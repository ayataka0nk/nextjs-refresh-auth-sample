import { Unauthorized } from './Unauthorized'
import jwt from 'jsonwebtoken'
import { headers } from 'next/headers'
import { prisma } from '@/prisma'

const JWT_SECRET = process.env.JWT_SECRET || ''

export type Session = {
  userId: string
}

export const getServerSessionOrFail = () => {
  const authorizationHeader = headers().get('Authorization')
  if (!authorizationHeader) {
    throw new Unauthorized()
  }

  const accessToken = authorizationHeader.replace('Bearer ', '')

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET)
    if (payload === null || typeof payload === 'string') {
      throw new Unauthorized()
    }
    const { userId } = payload as { userId: string }
    return { userId }
  } catch (error) {
    throw new Unauthorized()
  }
}

export const createToken = ({ userId }: { userId: string }) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' })
}

export const getSessionUser = async () => {
  const { userId } = getServerSessionOrFail()
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!user) {
    throw new Unauthorized()
  }
  return user
}
