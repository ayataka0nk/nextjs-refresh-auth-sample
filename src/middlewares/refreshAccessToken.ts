import { Unauthorized } from '@/app/error/Unauthorized'
import {
  RequestCookies,
  ResponseCookies
} from 'next/dist/compiled/@edge-runtime/cookies'
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL

function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers)
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers)
  const newReqCookies = new RequestCookies(newReqHeaders)
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie))
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders }
  }).headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value)
    }
  })
}

type MiddlewareType = (request: NextRequest) => Promise<NextResponse>

const defaultMiddleware = async (request: NextRequest) => NextResponse.next()

export const refreshAccessToken = async (
  middleware: MiddlewareType = defaultMiddleware
): Promise<MiddlewareType> => {
  return async (request: NextRequest) => {
    const response = await middleware(request)
    if (
      request.nextUrl.pathname.match(
        '^/(api|_next/static|_next/image|favicon.ico)'
      )
    ) {
      //API, _next, static, _next/image, favicon.ico は対象外
      return response
    }

    try {
      const { accessToken } = await refreshAccessTokenIfNotExists(request)
      response.cookies.set('accessToken', accessToken, {
        sameSite: 'strict',
        secure: true,
        expires: new Date(Date.now() + 1000 * 10)
      })
      applySetCookie(request, response)
      return response
    } catch (e) {
      return response
    }
  }
}

const refreshAccessTokenIfNotExists = async (
  request: NextRequest
): Promise<{ accessToken: string }> => {
  const userId = request.cookies.get('userId')
  const refreshToken = request.cookies.get('refreshToken')
  if (typeof userId === 'undefined' || typeof refreshToken === 'undefined') {
    throw new Unauthorized()
  }
  const accessToken = request.cookies.get('accessToken')
  if (typeof accessToken !== 'undefined') {
    // 不要
    throw new Error()
  }

  const formData = new FormData()
  formData.append('userId', userId.value)
  formData.append('refreshToken', refreshToken.value)
  const refreshResponse = await fetch(API_URL + '/token/refresh', {
    method: 'POST',
    body: formData
  })
  if (refreshResponse.status === 200) {
    const newTokens = await refreshResponse.json()
    return {
      accessToken: newTokens.accessToken
    }
  } else if (refreshResponse.status === 401) {
    throw new Unauthorized()
  } else {
    //TODO 別のエラー処理にする？
    throw new Unauthorized()
  }
}
