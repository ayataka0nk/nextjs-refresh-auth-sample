'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type LoginError = {
  message: string
  errors?: {
    email?: string
    password?: string
  }
}

export const loginFormAction = async (
  _currentState: unknown,
  formData: FormData
) => {
  const result = await fetch('http://localhost:3000/api/token', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  if (result.status === 200) {
    const { userId, accessToken, refreshToken } = await result.json()

    cookies().set('accessToken', accessToken, {
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + 1000 * 10)
    })
    cookies().set('refreshToken', refreshToken)
    cookies().set('userId', userId)
    redirect('/dashboard')
  } else if (result.status === 401) {
    return {
      message: 'Invalid email or password.'
    }
  } else if (result.status === 422) {
    const errors = (await result.json()) as LoginError
    return errors
  } else {
    return {
      message: 'Unknown error occurred.'
    }
  }
}
