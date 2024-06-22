import { NextResponse } from 'next/server'
import { Unauthorized } from './Unauthorized'

function withErrorHandler(fn: any) {
  return async function (request: any, ...args: any) {
    try {
      return await fn(request, ...args)
    } catch (error) {
      console.log('error')
      console.log(error)
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
