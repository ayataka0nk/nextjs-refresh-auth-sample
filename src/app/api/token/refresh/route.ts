import { NextRequest } from 'next/server'
import { refreshSession } from '../../lib/session'
import { z } from 'zod'

const RefreshTokenFormSchema = z.object({
  userId: z.string(),
  refreshToken: z.string()
})
export const POST = async (request: NextRequest) => {
  const formData = await request.formData()
  const userId = formData.get('userId')
  const currentRefreshToken = formData.get('refreshToken')
  const validated = RefreshTokenFormSchema.parse({
    userId: userId,
    refreshToken: currentRefreshToken
  })
  const { accessToken } = await refreshSession({
    userId: validated.userId,
    refreshToken: validated.refreshToken
  })
  return Response.json({
    accessToken
  })
}
