import { Unauthorized } from '@/app/error/Unauthorized'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL

export const authFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const accessToken = cookies().get('accessToken')?.value
  if (typeof accessToken === 'undefined') {
    throw new Unauthorized()
  }
  const res = await fetch(API_URL + '/' + url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`
    }
  })
  if (res.status === 200) {
    return res
  } else if (res.status === 201) {
    return res
  } else if (res.status === 204) {
    return res
  } else if (res.status === 401) {
    throw new Unauthorized()
  } else {
    throw new Error('Unknown error occurred')
  }
}
