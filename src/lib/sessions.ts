'use server'
import crypto from 'crypto-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type Session = {
  userId: string
}

export const encryptSession = async (session: Session): Promise<string> => {
  const encryptionKey = process.env.ENCRYPTION_KEY || ''
  return crypto.AES.encrypt(JSON.stringify(session), encryptionKey).toString()
}

export const decryptSession = async (
  encryptedSession: string
): Promise<Session> => {
  const encryptionKey = process.env.ENCRYPTION_KEY || ''
  const bytes = crypto.AES.decrypt(encryptedSession, encryptionKey)
  return JSON.parse(bytes.toString(crypto.enc.Utf8))
}

// export const setSession = (session: Session): void => {
//   const encryptionKey = process.env.ENCRYPTION_KEY || ''
//   const encryptedSessionData = crypto.AES.encrypt(
//     JSON.stringify(session),
//     encryptionKey
//   )
//   cookies().set('session', encryptedSessionData.toString(), {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     maxAge: 60 * 60 * 24 * 7, // One week
//     path: '/'
//   })
// }

export const getServerSession = async (): Promise<Session | undefined> => {
  const encryptedSessionData = cookies().get('session')?.value
  if (!encryptedSessionData) {
    return undefined
  }
  return decryptSession(encryptedSessionData)
}

export const getServerSessionOrFail = async (): Promise<Session> => {
  const session = await getServerSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export const clearSession = (): void => {
  cookies().delete('session')
}
