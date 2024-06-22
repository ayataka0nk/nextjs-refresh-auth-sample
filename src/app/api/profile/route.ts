import { NextRequest } from 'next/server'
import { getSessionUser } from '../lib/session'
import { withErrorHandler } from '../lib/ErrorHandler'

export const GET = withErrorHandler(async (request: NextRequest) => {
  const user = await getSessionUser()

  return Response.json({
    id: user.id,
    name: user.name,
    email: user.email
  })
})
