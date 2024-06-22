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
    const { accessToken } = await result.json()
    cookies().set('accessToken', accessToken)
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
