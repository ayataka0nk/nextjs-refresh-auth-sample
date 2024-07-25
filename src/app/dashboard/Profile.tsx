'use client'

import { authFetcher } from '@/lib/swr'
import useSWR from 'swr'

export const Profile = () => {
  const profile = useSWR('/api/profile', authFetcher)
  console.log(profile.data)
  return (
    <div>
      <p>profile</p>
    </div>
  )
}
