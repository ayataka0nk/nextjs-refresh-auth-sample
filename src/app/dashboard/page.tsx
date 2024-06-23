import { authFetch } from '@/lib/authFetch'

export default async function DashboardPage() {
  const res = await authFetch('/profile')
  const data: {
    id: string
    name: string
    email: string
  } = await res.json()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
      <p>Your session ID is {data.id}</p>
    </div>
  )
}
