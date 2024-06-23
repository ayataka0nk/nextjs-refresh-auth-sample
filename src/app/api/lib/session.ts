import { Unauthorized } from './Unauthorized'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { headers } from 'next/headers'
import { prisma } from '@/prisma'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

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
  } catch (e) {
    throw new Unauthorized()
  }
}

const createAccessToken = ({ userId }: { userId: string }) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '10s' })
}

const createRefreshToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf.toString('hex'))
      }
    })
  })
}
const refreshTokenExpireDuration = 1000 * 60 * 60 * 24 * 7 // 7日間

async function hashToken(token: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(token, salt)
}

export const createSession = async ({ userId }: { userId: string }) => {
  const accessToken = createAccessToken({ userId })
  const refreshToken = await createRefreshToken()
  const hashedRefreshToken = await hashToken(refreshToken)
  await prisma.userToken.create({
    data: {
      userId: userId,
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + refreshTokenExpireDuration)
    }
  })
  return { accessToken, refreshToken }
}

export const refreshSession = async ({
  userId,
  refreshToken
}: {
  userId: string
  refreshToken: string
}) => {
  const userTokens = await prisma.userToken.findMany({
    where: {
      userId: userId
    }
  })

  // リフレッシュトークンが一致するものを探す
  let targetUserToken = null
  for (const userToken of userTokens) {
    if (await bcrypt.compare(refreshToken, userToken.refreshToken)) {
      targetUserToken = userToken
      break
    }
  }

  if (targetUserToken === null || targetUserToken.expiresAt < new Date()) {
    throw new Unauthorized()
  }

  const newAccessToken = createAccessToken({ userId: targetUserToken.userId })

  return { accessToken: newAccessToken }
}

export const getServerSessionUser = async () => {
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
