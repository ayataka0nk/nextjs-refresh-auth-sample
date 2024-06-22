'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.API_URL

export const serverFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(API_URL + '/' + url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${cookies().get('accessToken')?.value}`
    }
  })
  return res
}
