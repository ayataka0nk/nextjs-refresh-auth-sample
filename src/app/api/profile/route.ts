import { NextRequest } from 'next/server'
import { getServerSessionUser } from '../lib/session'
import { withErrorHandler } from '../lib/ErrorHandler'

export const GET = withErrorHandler(async (request: NextRequest) => {
  const user = await getServerSessionUser()

  return Response.json({
    id: user.id,
    name: user.name,
    email: user.email
  })
})
