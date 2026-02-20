import { useState, useEffect } from 'react'
import { fetchProfile, type ProfileResponse } from '@/lib/api'

export function useProfile(userId: string) {
  const [data, setData] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchProfile(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  return { data, loading, error }
}
