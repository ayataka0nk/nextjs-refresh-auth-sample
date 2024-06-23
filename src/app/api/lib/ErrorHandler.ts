import { NextRequest, NextResponse } from 'next/server'
import { Unauthorized } from './Unauthorized'
type RouteHandler = (
  request: NextRequest,
  ...args: any[]
) => Promise<NextResponse> | NextResponse | Promise<Response> | Response

function withErrorHandler(handler: RouteHandler) {
  return async function (request: NextRequest, ...args: any[]) {
    try {
      return await handler(request, ...args)
    } catch (error) {
      if (error instanceof Unauthorized) {
        // Respond with a 401 Unauthorized
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      } else {
        // Respond with a generic 500 Internal Server Error
        return NextResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 }
        )
      }
    }
  }
}

export { withErrorHandler }
