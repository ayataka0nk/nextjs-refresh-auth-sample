import { NextRequest } from 'next/server'

import { refreshAccessToken } from './middlewares/refreshAccessToken'

export async function middleware(request: NextRequest) {
  const refreshAccessTokenMiddleware = await refreshAccessToken()
  const response = await refreshAccessTokenMiddleware(request)
  return response
}
