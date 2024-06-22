'use client'

import { useFormState } from 'react-dom'

import { TextField } from '@ayataka0nk/ryokucha-ui/TextField'
import { Button } from '@ayataka0nk/ryokucha-ui/Button'
import { loginFormAction } from './actions'

export const LoginForm = () => {
  const [result, dispatch] = useFormState(loginFormAction, undefined)
  return (
    <form action={dispatch}>
      {result?.message && <p>{result.message}</p>}
      <TextField
        label="email"
        name="email"
        type="email"
        error={result?.errors?.email}
      />
      <TextField
        label="password"
        name="password"
        type="password"
        error={result?.errors?.password}
      />
      <Button type="submit" variant="filled">
        ログイン
      </Button>
    </form>
  )
}
