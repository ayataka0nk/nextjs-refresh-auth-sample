import { serverFetch } from '@/lib/serverFetch'

export default async function DashboardPage() {
  const res = await serverFetch('/api/profile')
  if (res.status === 401) {
    // TODO グローバルページエラーハンドリング
    return <p>You must be logged in to view this page</p>
  }
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
