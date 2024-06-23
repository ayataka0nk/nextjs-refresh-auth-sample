import { cookies } from 'next/headers'
import { LoginForm } from './LoginForm'
import Link from 'next/link'

export default async function LoginPage() {
  const hoge = fetch('http://localhost:3000/token/refresh')
  return (
    <main>
      <LoginForm />
      <Link href="/dashboard">dahdash</Link>
    </main>
  )
}
